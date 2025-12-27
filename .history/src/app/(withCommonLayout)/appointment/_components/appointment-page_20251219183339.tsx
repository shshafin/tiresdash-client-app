"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Calendar,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Wrench,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import { useCreateAppointment } from "@/src/hooks/appointment.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetServices } from "@/src/hooks/service.hook";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface AppointmentData {
  services: string[]; // Array of service IDs

  additionalNotes: string;
  schedule: {
    date: string;
    time: string;
  };
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };
  paymentMethod: "stripe" | "paypal" | "cash";
}

const AppointmentBookingPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    services: [],

    additionalNotes: "",
    schedule: {
      date: "",
      time: "",
    },
    user: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      zipCode: "",
      city: "",
      state: "",
      country: "United States",
    },
    paymentMethod: "stripe",
  });

  const {
    mutate: handleCreateAppointment,
    isPending: createAppointmentPending,
  } = useCreateAppointment({
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["GET_APPOINTMENT"] });

      // Handle nested response structure - data is at response.data
      const data = response.data || response;

      if (data.paymentRequired) {
        // Redirect to payment gateway
        if (appointmentData.paymentMethod === "stripe") {
          const paymentUrl = data.paymentData?.url;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            toast.error("Payment URL not found");
          }
        } else if (appointmentData.paymentMethod === "paypal") {
          const approvalLink = data.paymentData?.links?.find(
            (link: any) => link.rel === "approve"
          );
          if (approvalLink) {
            window.location.href = approvalLink.href;
          } else {
            toast.error("PayPal approval link not found");
          }
        }
      } else {
        // Cash payment - go to success page
        toast.success("Appointment created successfully");
        setCurrentStep(5); // Success step
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create appointment");
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Format data for backend
      const formattedData = {
        services: appointmentData.services, // Array of service IDs
        schedule: appointmentData.schedule,
        user: appointmentData.user,
        paymentMethod: appointmentData.paymentMethod,
      };

      handleCreateAppointment(formattedData);
    } catch (error) {
      console.error("Error submitting appointment:", error);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-600 mb-2">
            Book Your Appointment
          </h1>
          <p className="text-gray-600">
            Schedule your tire and wheel service with our experts
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep <= totalSteps && (
          <div className="mb-8">
            <Progress
              value={progress}
              className="mb-2"
              color="danger"
              size="sm"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card className="shadow-lg">
          {currentStep === 1 && (
            <ServicesStep
              appointmentData={appointmentData}
              setAppointmentData={setAppointmentData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <ScheduleStep
              appointmentData={appointmentData}
              setAppointmentData={setAppointmentData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 3 && (
            <UserInfoStep
              appointmentData={appointmentData}
              setAppointmentData={setAppointmentData}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {currentStep === 4 && (
            <PaymentStep
              appointmentData={appointmentData}
              setAppointmentData={setAppointmentData}
              onSubmit={handleSubmit}
              onPrevious={handlePrevious}
              createAppointmentPending={createAppointmentPending}
            />
          )}

          {currentStep === 5 && <SuccessStep />}
        </Card>
      </div>
    </div>
  );
};

// Services Selection Step
const ServicesStep = ({ appointmentData, setAppointmentData, onNext }: any) => {
  const { data: servicesData, isLoading, isError } = useGetServices({});

  const allServices = servicesData?.data || [];
  const mostPopularServices = allServices.slice(0, 4);
  const otherServicesData = allServices.slice(4);

  const hasSelectedService = appointmentData.services.length > 0;

  if (isLoading) {
    return (
      <>
        <CardHeader className="pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold">Select Services</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </CardBody>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <CardHeader className="pb-4 gap-4">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold">Select Services</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-12">
            <p className="text-red-500">
              Failed to load services. Please try again.
            </p>
          </div>
        </CardBody>
      </>
    );
  }

  const renderServiceCard = (service: any) => {
    const isSelected = appointmentData.services.includes(service._id);

    return (
      <Card
        key={service._id}
        className={`cursor-pointer transition-all ${
          isSelected
            ? "border-red-500 bg-red-50 text-black"
            : "border-gray-200 hover:border-red-300"
        }`}
        isPressable
        onPress={() => {
          setAppointmentData({
            ...appointmentData,
            services: isSelected
              ? appointmentData.services.filter(
                  (id: string) => id !== service._id
                )
              : [...appointmentData.services, service._id],
          });
        }}>
        <CardBody className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div>
                <h4 className="font-medium">{service.serviceName}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {service.serviceTitle}
                </p>
                <p className="text-sm font-semibold text-red-600 mt-2">
                  ${service.servicePrice}
                </p>
              </div>
            </div>
            <div className="text-right">
              <Checkbox
                isSelected={isSelected}
                className="mt-2"
              />
            </div>
          </div>
        </CardBody>
      </Card>
    );
  };

  return (
    <>
      <CardHeader className="pb-4 gap-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Select Services</h2>
        </div>
        <p className="text-gray-600">
          Choose the services you need for your vehicle
        </p>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Most Popular Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-red-600">
            Most Popular Services
          </h3>
          {mostPopularServices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No services available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mostPopularServices.map(renderServiceCard)}
            </div>
          )}
        </div>

        <Divider />

        {/* Other Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Other Services</h3>
          {otherServicesData.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No other services available
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {otherServicesData.map(renderServiceCard)}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <Textarea
            label="Additional Notes"
            placeholder="Any specific requirements or additional information..."
            value={appointmentData.additionalNotes}
            onValueChange={(value) => {
              setAppointmentData({
                ...appointmentData,
                additionalNotes: value,
              });
            }}
            minRows={3}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button
            color="danger"
            onPress={onNext}
            disabled={!hasSelectedService}
            endContent={<ArrowRight className="h-4 w-4" />}>
            Continue to Schedule
          </Button>
        </div>
      </CardBody>
    </>
  );
};

// Schedule Step
const ScheduleStep = ({
  appointmentData,
  setAppointmentData,
  onNext,
  onPrevious,
}: any) => {
  const timeSlots = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ];

  const isFormValid =
    appointmentData.schedule.date && appointmentData.schedule.time;

  return (
    <>
      <CardHeader className="pb-4 gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Schedule Appointment</h2>
        </div>
        <p className="text-gray-600">Choose your preferred date and time</p>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Date Selection */}
        <div>
          <Input
            type="date"
            label="Preferred Date"
            value={appointmentData.schedule.date}
            onValueChange={(value) => {
              setAppointmentData({
                ...appointmentData,
                schedule: {
                  ...appointmentData.schedule,
                  date: value,
                },
              });
            }}
            min={new Date().toISOString().split("T")[0]}
            isRequired
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Preferred Time
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={
                  appointmentData.schedule.time === time ? "solid" : "bordered"
                }
                color={
                  appointmentData.schedule.time === time ? "danger" : "default"
                }
                onPress={() => {
                  setAppointmentData({
                    ...appointmentData,
                    schedule: {
                      ...appointmentData.schedule,
                      time: time,
                    },
                  });
                }}
                className="h-12">
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="bordered"
            onPress={onPrevious}
            startContent={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <Button
            color="danger"
            onPress={onNext}
            disabled={!isFormValid}
            endContent={<ArrowRight className="h-4 w-4" />}>
            Continue to Contact Info
          </Button>
        </div>
      </CardBody>
    </>
  );
};

// User Info Step
const UserInfoStep = ({
  appointmentData,
  setAppointmentData,
  onNext,
  onPrevious,
}: any) => {
  const isFormValid =
    appointmentData.user.firstName &&
    appointmentData.user.lastName &&
    appointmentData.user.email &&
    appointmentData.user.phoneNumber &&
    appointmentData.user.addressLine1 &&
    appointmentData.user.zipCode &&
    appointmentData.user.city &&
    appointmentData.user.state;

  return (
    <>
      <CardHeader className="pb-4 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Contact Information</h2>
        </div>
        <p className="text-gray-600">
          We'll use this information to confirm your appointment
        </p>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={appointmentData.user.firstName}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, firstName: value },
                });
              }}
              isRequired
            />
            <Input
              label="Last Name"
              value={appointmentData.user.lastName}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, lastName: value },
                });
              }}
              isRequired
            />
            <Input
              type="email"
              label="Email"
              value={appointmentData.user.email}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, email: value },
                });
              }}
              isRequired
            />
            <Input
              type="tel"
              label="Phone Number"
              value={appointmentData.user.phoneNumber}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, phoneNumber: value },
                });
              }}
              isRequired
            />
          </div>
        </div>

        <Divider />

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Address Information</h3>
          <div className="space-y-4">
            <AddressAutocomplete
              label="Address Line 1"
              value={appointmentData.user.addressLine1}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, addressLine1: value },
                });
              }}
              onAddressSelect={(addressComponents) => {
                setAppointmentData({
                  ...appointmentData,
                  user: {
                    ...appointmentData.user,
                    addressLine1: addressComponents.addressLine1,
                    addressLine2: addressComponents.addressLine2,
                    city: addressComponents.city,
                    state: addressComponents.state,
                    zipCode: addressComponents.zipCode,
                    country: addressComponents.country || "United States",
                  },
                });
              }}
              isRequired
              placeholder="Start typing your address..."
            />
            <Input
              label="Address Line 2 (Optional)"
              value={appointmentData.user.addressLine2}
              onValueChange={(value) => {
                setAppointmentData({
                  ...appointmentData,
                  user: { ...appointmentData.user, addressLine2: value },
                });
              }}
              placeholder="Apt, Suite, Unit, etc."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="ZIP Code"
                value={appointmentData.user.zipCode}
                onValueChange={(value) => {
                  setAppointmentData({
                    ...appointmentData,
                    user: { ...appointmentData.user, zipCode: value },
                  });
                }}
                isRequired
              />
              <Input
                label="City"
                value={appointmentData.user.city}
                onValueChange={(value) => {
                  setAppointmentData({
                    ...appointmentData,
                    user: { ...appointmentData.user, city: value },
                  });
                }}
                isRequired
              />
              <Input
                label="State"
                value={appointmentData.user.state}
                onValueChange={(value) => {
                  setAppointmentData({
                    ...appointmentData,
                    user: { ...appointmentData.user, state: value },
                  });
                }}
                isRequired
              />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="bordered"
            onPress={onPrevious}
            startContent={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <Button
            color="danger"
            onPress={onNext}
            disabled={!isFormValid}
            endContent={<ArrowRight className="h-4 w-4" />}>
            Proceed to Payment
          </Button>
        </div>
      </CardBody>
    </>
  );
};

// Payment Step
const PaymentStep = ({
  appointmentData,
  setAppointmentData,
  onSubmit,
  onPrevious,
  createAppointmentPending,
}: any) => {
  const { data: servicesData } = useGetServices({});

  const calculateTotal = () => {
    let total = 0;
    appointmentData.services.forEach((serviceId: string) => {
      const service = servicesData?.data?.find((s: any) => s._id === serviceId);
      if (service) {
        total += service.servicePrice;
      }
    });
    return total;
  };

  const getSelectedServices = () => {
    return appointmentData.services
      .map((serviceId: string) => {
        return servicesData?.data?.find((s: any) => s._id === serviceId);
      })
      .filter(Boolean);
  };

  const selectedServices = getSelectedServices();
  const totalAmount = calculateTotal();

  return (
    <>
      <CardHeader className="pb-4 gap-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-red-600" />
          <h2 className="text-2xl font-bold">Payment & Review</h2>
        </div>
        <p className="text-gray-600">
          Review your appointment and select payment method
        </p>
      </CardHeader>

      <CardBody className="space-y-6">
        {/* Services Summary */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Selected Services</h3>
          <div className="space-y-3">
            {selectedServices.length > 0 ? (
              selectedServices.map((service: any) => (
                <Card
                  key={service._id}
                  className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                  <CardBody className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="bg-red-100 p-2 rounded-lg">
                            <Wrench className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {service.serviceName}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {service.serviceTitle}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-red-600">
                          ${service.servicePrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card className="bg-gray-50">
                <CardBody className="p-4 text-center text-gray-500">
                  No services selected
                </CardBody>
              </Card>
            )}
          </div>

          {/* Total Amount - Prominent Display */}
          <Card className="mt-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
            <CardBody className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-3xl font-bold text-red-600">
                    ${totalAmount.toFixed(2)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-full shadow-md">
                  <CreditCard className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Divider />

        {/* Appointment Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Appointment Details</h3>
          <Card className="bg-gray-50">
            <CardBody className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Date:</span>
                  <p className="text-gray-900 mt-1">
                    {new Date(
                      appointmentData.schedule.date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Time:</span>
                  <p className="text-gray-900 mt-1">
                    {appointmentData.schedule.time}
                  </p>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Contact:</span>
                  <p className="text-gray-900 mt-1">
                    {appointmentData.user.firstName}{" "}
                    {appointmentData.user.lastName}
                  </p>
                  <p className="text-gray-600">{appointmentData.user.email}</p>
                  <p className="text-gray-600">
                    {appointmentData.user.phoneNumber}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <Divider />

        {/* Payment Method Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {/* Stripe Payment Option */}
            <Card
              className={`cursor-pointer transition-all ${
                appointmentData.paymentMethod === "stripe"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border border-gray-200 hover:border-red-300"
              }`}
              isPressable
              onPress={() => {
                setAppointmentData({
                  ...appointmentData,
                  paymentMethod: "stripe",
                });
              }}>
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      appointmentData.paymentMethod === "stripe"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}>
                    <CreditCard
                      className={`h-6 w-6 ${
                        appointmentData.paymentMethod === "stripe"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Credit/Debit Card
                    </h4>
                    <p className="text-sm text-gray-600">
                      Secure payment via Stripe
                    </p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={appointmentData.paymentMethod === "stripe"}
                      onChange={() => {}}
                      className="h-5 w-5 text-red-600"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* PayPal Payment Option */}
            {/* <Card
              className={`cursor-pointer transition-all ${appointmentData.paymentMethod === "paypal"
                ? "border-2 border-red-500 bg-red-50"
                : "border border-gray-200 hover:border-red-300"
                }`}
              isPressable
              onPress={() => {
                setAppointmentData({
                  ...appointmentData,
                  paymentMethod: "paypal",
                });
              }}
            >
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${appointmentData.paymentMethod === "paypal"
                      ? "bg-red-100"
                      : "bg-gray-100"
                      }`}
                  >
                    <CreditCard
                      className={`h-6 w-6 ${appointmentData.paymentMethod === "paypal"
                        ? "text-red-600"
                        : "text-gray-600"
                        }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">PayPal</h4>
                    <p className="text-sm text-gray-600">
                      Pay with your PayPal account
                    </p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={appointmentData.paymentMethod === "paypal"}
                      onChange={() => { }}
                      className="h-5 w-5 text-red-600"
                    />
                  </div>
                </div>
              </CardBody>
            </Card> */}

            {/* Cash Payment Option */}
            {/* <Card
              className={`cursor-pointer transition-all ${
                appointmentData.paymentMethod === "cash"
                  ? "border-2 border-red-500 bg-red-50"
                  : "border border-gray-200 hover:border-red-300"
              }`}
              isPressable
              onPress={() => {
                setAppointmentData({
                  ...appointmentData,
                  paymentMethod: "cash",
                });
              }}>
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full ${
                      appointmentData.paymentMethod === "cash"
                        ? "bg-red-100"
                        : "bg-gray-100"
                    }`}>
                    <ShieldCheck
                      className={`h-6 w-6 ${
                        appointmentData.paymentMethod === "cash"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      Cash Payment
                    </h4>
                    <p className="text-sm text-gray-600">
                      Pay at the store when you arrive
                    </p>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={appointmentData.paymentMethod === "cash"}
                      onChange={() => {}}
                      className="h-5 w-5 text-red-600"
                    />
                  </div>
                </div>
              </CardBody>
            </Card> */}
          </div>
        </div>

        {/* Secure Payment Badge */}
        <div className="flex items-center justify-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-700">
            Secure & encrypted payment processing
          </span>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="bordered"
            onPress={onPrevious}
            startContent={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
          <Button
            color="danger"
            size="lg"
            onPress={onSubmit}
            disabled={createAppointmentPending}
            endContent={<CheckCircle className="h-4 w-4" />}>
            {createAppointmentPending ? (
              <div className="flex items-center gap-2">
                <Spinner
                  size="sm"
                  color="white"
                />
                Processing...
              </div>
            ) : (
              `Confirm & ${
                appointmentData.paymentMethod === "cash"
                  ? "Book"
                  : appointmentData.paymentMethod === "stripe"
                    ? "Pay with Stripe"
                    : "Pay with PayPal"
              }`
            )}
          </Button>
        </div>
      </CardBody>
    </>
  );
};

// Success Step
const SuccessStep = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("appointment-confirmation.pdf");
  };

  return (
    <CardBody className="text-center py-12">
      <div
        ref={printRef}
        className="flex flex-col items-center space-y-6 pt-8">
        <div className="bg-green-100 p-6 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-600 mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-gray-600 text-lg">
            Thank you for booking with us. We'll send you a confirmation email
            shortly.
          </p>
        </div>

        <Card className="bg-blue-50 border-blue-200 max-w-md w-full">
          <CardBody className="p-4">
            <h3 className="font-semibold mb-2 text-black">What's Next?</h3>
            <ul className="text-sm space-y-1 text-left text-black">
              <li>• You'll receive a confirmation email within 5 minutes</li>
              <li>• We'll call you 24 hours before your appointment</li>
              <li>• Bring your vehicle and any relevant documentation</li>
              <li>• Our team will be ready to serve you!</li>
            </ul>
          </CardBody>
        </Card>
      </div>

      <div className="flex gap-4 mt-6 justify-center">
        <Button
          color="danger"
          variant="bordered"
          onClick={handlePrint}>
          Print Confirmation
        </Button>
        <Button
          color="danger"
          onClick={() => {
            window.location.href = "/";
          }}>
          Back to Home
        </Button>
      </div>
    </CardBody>
  );
};

export default AppointmentBookingPage;
