"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
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
  Clock,
  MapPin,
} from "lucide-react";
import { useCreateAppointment } from "@/src/hooks/appointment.hook";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetServices } from "@/src/hooks/service.hook";
import { AddressAutocomplete } from "./AddressAutocomplete";

interface AppointmentData {
  services: string[];
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
  paymentMethod: "stripe";
}

const AppointmentBookingPage = () => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    services: [],
    additionalNotes: "",
    schedule: { date: "", time: "" },
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
      const data = response.data || response;
      if (data.paymentRequired) {
        const paymentUrl = data.paymentData?.url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          toast.error("Payment session could not be created");
        }
      } else {
        toast.success("Appointment booked successfully!");
        setCurrentStep(5);
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create appointment");
    },
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () =>
    currentStep < totalSteps && setCurrentStep(currentStep + 1);
  const handlePrevious = () =>
    currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleSubmit = async () => {
    handleCreateAppointment(appointmentData);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 md:py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
            BOOK <span className="text-danger">SERVICE</span>
          </h1>
          <p className="text-default-500 max-w-md mx-auto text-sm md:text-base">
            Professional tire and wheel maintenance at your convenience. Secure
            your slot in seconds.
          </p>
        </div>

        {/* Progress Section */}
        {currentStep <= totalSteps && (
          <div className="mb-10 px-2">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-danger uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-lg font-black">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <span className="text-sm font-bold text-default-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2 rounded-full"
              color="danger"
            />
          </div>
        )}

        <Card className="shadow-2xl rounded-3xl overflow-hidden bg-content1 border border-divider">
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

/* --- Step 1: Services --- */
const ServicesStep = ({ appointmentData, setAppointmentData, onNext }: any) => {
  const { data: servicesData, isLoading } = useGetServices({});
  const allServices = servicesData?.data || [];

  if (isLoading)
    return (
      <div className="p-20 flex justify-center">
        <Spinner
          color="danger"
          size="lg"
        />
      </div>
    );

  return (
    <CardBody className="p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-danger-50 p-3 rounded-2xl">
          <Wrench className="text-danger" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Select Services</h2>
          <p className="text-sm text-default-500">
            Pick one or more maintenance tasks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allServices.map((service: any) => {
          const isSelected = appointmentData.services.includes(service._id);
          return (
            <div
              key={service._id}
              onClick={() => {
                const newServices = isSelected
                  ? appointmentData.services.filter(
                      (id: string) => id !== service._id
                    )
                  : [...appointmentData.services, service._id];
                setAppointmentData({
                  ...appointmentData,
                  services: newServices,
                });
              }}
              className={`group cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between h-full ${
                isSelected
                  ? "border-danger bg-danger-50 shadow-md"
                  : "border-divider hover:border-danger bg-content2"
              }`}>
              <div className="flex justify-between items-start mb-4">
                <h4
                  className={`font-bold text-base ${isSelected ? "text-danger" : "text-foreground"}`}>
                  {service.serviceName}
                </h4>
                <Checkbox
                  isSelected={isSelected}
                  color="danger"
                  size="sm"
                  radius="full"
                />
              </div>
              <div>
                <p className="text-xs text-default-500 mb-4 line-clamp-2">
                  {service.serviceTitle}
                </p>
                <p className="text-xl font-black text-danger">
                  ${service.servicePrice}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <Textarea
        label="Special Instructions"
        placeholder="Anything we should know about your vehicle?"
        value={appointmentData.additionalNotes}
        onValueChange={(val) =>
          setAppointmentData({ ...appointmentData, additionalNotes: val })
        }
        className="mt-6"
        variant="bordered"
      />

      <div className="flex justify-end pt-4">
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold shadow-lg shadow-danger/20"
          onPress={onNext}
          disabled={appointmentData.services.length === 0}
          endContent={<ArrowRight className="h-4 w-4" />}>
          Continue
        </Button>
      </div>
    </CardBody>
  );
};

/* --- Step 2: Schedule --- */
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
    <CardBody className="p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-warning-50 p-3 rounded-2xl">
          <Calendar className="text-warning" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Choose Time</h2>
          <p className="text-sm text-default-500">
            Select your preferred window
          </p>
        </div>
      </div>

      <Input
        type="date"
        label="Service Date"
        variant="bordered"
        value={appointmentData.schedule.date}
        onValueChange={(val) =>
          setAppointmentData({
            ...appointmentData,
            schedule: { ...appointmentData.schedule, date: val },
          })
        }
        min={new Date().toISOString().split("T")[0]}
        className="max-w-xs"
      />

      <div className="space-y-4">
        <label className="text-sm font-black uppercase text-default-400 flex items-center gap-2">
          <Clock size={16} /> Available Slots
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {timeSlots.map((time) => (
            <Button
              key={time}
              variant={
                appointmentData.schedule.time === time ? "solid" : "bordered"
              }
              color={
                appointmentData.schedule.time === time ? "danger" : "default"
              }
              onPress={() =>
                setAppointmentData({
                  ...appointmentData,
                  schedule: { ...appointmentData.schedule, time },
                })
              }
              className="font-bold py-6 rounded-xl">
              {time}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}
          startContent={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onNext}
          disabled={!isFormValid}>
          Next Step
        </Button>
      </div>
    </CardBody>
  );
};

/* --- Step 3: User Info --- */
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
    appointmentData.user.city &&
    appointmentData.user.state;

  return (
    <CardBody className="p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-primary-50 p-3 rounded-2xl">
          <User className="text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Contact Details</h2>
          <p className="text-sm text-default-500">
            Provide info for confirmation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          variant="bordered"
          isRequired
          value={appointmentData.user.firstName}
          onValueChange={(v) =>
            setAppointmentData({
              ...appointmentData,
              user: { ...appointmentData.user, firstName: v },
            })
          }
        />
        <Input
          label="Last Name"
          variant="bordered"
          isRequired
          value={appointmentData.user.lastName}
          onValueChange={(v) =>
            setAppointmentData({
              ...appointmentData,
              user: { ...appointmentData.user, lastName: v },
            })
          }
        />
        <Input
          label="Email Address"
          type="email"
          variant="bordered"
          isRequired
          value={appointmentData.user.email}
          onValueChange={(v) =>
            setAppointmentData({
              ...appointmentData,
              user: { ...appointmentData.user, email: v },
            })
          }
        />
        <Input
          label="Phone Number"
          type="tel"
          variant="bordered"
          isRequired
          value={appointmentData.user.phoneNumber}
          onValueChange={(v) =>
            setAppointmentData({
              ...appointmentData,
              user: { ...appointmentData.user, phoneNumber: v },
            })
          }
        />
      </div>

      <Divider className="my-4" />

      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase text-default-400 flex items-center gap-2">
          <MapPin size={16} /> Location
        </h3>
        <AddressAutocomplete
          label="Full Address"
          value={appointmentData.user.addressLine1}
          onValueChange={(v) =>
            setAppointmentData({
              ...appointmentData,
              user: { ...appointmentData.user, addressLine1: v },
            })
          }
          onAddressSelect={(comp) =>
            setAppointmentData({
              ...appointmentData,
              user: {
                ...appointmentData.user,
                addressLine1: comp.addressLine1,
                addressLine2: comp.addressLine2,
                city: comp.city,
                state: comp.state,
                zipCode: comp.zipCode,
              },
            })
          }
          isRequired
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            variant="bordered"
            value={appointmentData.user.city}
            onValueChange={(v) =>
              setAppointmentData({
                ...appointmentData,
                user: { ...appointmentData.user, city: v },
              })
            }
          />
          <Input
            label="State"
            variant="bordered"
            value={appointmentData.user.state}
            onValueChange={(v) =>
              setAppointmentData({
                ...appointmentData,
                user: { ...appointmentData.user, state: v },
              })
            }
          />
          <Input
            label="Zip Code"
            variant="bordered"
            value={appointmentData.user.zipCode}
            onValueChange={(v) =>
              setAppointmentData({
                ...appointmentData,
                user: { ...appointmentData.user, zipCode: v },
              })
            }
          />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}
          startContent={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onNext}
          disabled={!isFormValid}>
          Finalize Booking
        </Button>
      </div>
    </CardBody>
  );
};

/* --- Step 4: Payment --- */
const PaymentStep = ({
  appointmentData,
  onSubmit,
  onPrevious,
  createAppointmentPending,
}: any) => {
  const { data: servicesData } = useGetServices({});

  const selectedServices = appointmentData.services
    .map((id: string) => servicesData?.data?.find((s: any) => s._id === id))
    .filter(Boolean);

  const total = selectedServices.reduce(
    (acc: number, curr: any) => acc + curr.servicePrice,
    0
  );

  return (
    <CardBody className="p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-success-50 p-3 rounded-2xl">
          <ShieldCheck className="text-success" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Review & Pay</h2>
          <p className="text-sm text-default-500">Secure Stripe Checkout</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-default-50 p-6 rounded-3xl border-2 border-dashed border-divider">
          <h3 className="font-black text-default-400 text-xs uppercase tracking-widest mb-4">
            Summary
          </h3>
          {selectedServices.map((s: any) => (
            <div
              key={s._id}
              className="flex justify-between py-2 border-b last:border-0 border-divider">
              <span className="font-bold text-default-700">
                {s.serviceName}
              </span>
              <span className="font-black">${s.servicePrice}</span>
            </div>
          ))}
          <div className="flex justify-between pt-4 mt-2">
            <span className="text-xl font-black">Total</span>
            <span className="text-2xl font-black text-danger">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-danger-50 p-6 rounded-3xl border border-danger-200 flex items-center gap-4">
          <div className="bg-background p-3 rounded-2xl shadow-sm">
            <CreditCard className="text-danger" />
          </div>
          <div>
            <h4 className="font-bold">Secure Stripe Payment</h4>
            <p className="text-xs text-default-500">
              You will be redirected to the secure portal
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}
          startContent={<ArrowLeft size={16} />}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onSubmit}
          isLoading={createAppointmentPending}
          endContent={!createAppointmentPending && <CheckCircle size={18} />}>
          Pay & Confirm
        </Button>
      </div>
    </CardBody>
  );
};

/* --- Success Step (Success screen) --- */
const SuccessStep = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, { scale: 2 });
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
    pdf.save("appointment.pdf");
  };

  return (
    <CardBody className="text-center p-12 space-y-6">
      <div
        ref={printRef}
        className="flex flex-col items-center space-y-6">
        <div className="bg-success-50 p-8 rounded-full animate-bounce">
          <CheckCircle className="h-20 w-20 text-success" />
        </div>
        <div>
          <h2 className="text-3xl font-black mb-2">Service Booked!</h2>
          <p className="text-default-500 font-medium">
            We've sent a confirmation to your email.
          </p>
        </div>
        <div className="bg-default-50 p-6 rounded-3xl border border-divider text-left max-w-sm">
          <h4 className="font-black text-xs uppercase tracking-widest text-default-400 mb-3">
            Reminder
          </h4>
          <p className="text-sm leading-relaxed">
            • Bring your vehicle at the scheduled time.
            <br />• Check email for invoice details.
            <br />• Payment completed via Stripe.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          variant="bordered"
          className="font-bold border-2"
          onPress={handlePrint}>
          Download PDF
        </Button>
        <Button
          color="danger"
          className="font-bold px-10"
          onPress={() => (window.location.href = "/")}>
          Return Home
        </Button>
      </div>
    </CardBody>
  );
};

export default AppointmentBookingPage;
