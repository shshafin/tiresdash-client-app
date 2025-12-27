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
  Printer,
  Mail,
  Phone,
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
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight uppercase">
            Book <span className="text-danger">Service</span>
          </h1>
          <p className="text-default-500 max-w-md mx-auto text-sm md:text-base">
            Professional maintenance for your vehicle. Fast, secure, and expert.
          </p>
        </div>

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
          {currentStep === 5 && (
            <SuccessStep appointmentData={appointmentData} />
          )}
        </Card>
      </div>
    </div>
  );
};

/* --- Components --- */

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
    <CardBody className="p-6 md:p-10 space-y-8 text-foreground">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-danger-50 p-3 rounded-2xl">
          <Wrench className="text-danger" />
        </div>
        <h2 className="text-2xl font-black">Select Services</h2>
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
              className={`group cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${isSelected ? "border-danger bg-danger-50 shadow-md" : "border-divider bg-content2"}`}>
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{service.serviceName}</h4>
                <Checkbox
                  isSelected={isSelected}
                  color="danger"
                  radius="full"
                />
              </div>
              <p className="text-xl font-black text-danger">
                ${service.servicePrice}
              </p>
            </div>
          );
        })}
      </div>
      <Textarea
        label="Special Instructions"
        placeholder="Optional notes..."
        value={appointmentData.additionalNotes}
        onValueChange={(val) =>
          setAppointmentData({ ...appointmentData, additionalNotes: val })
        }
        variant="bordered"
      />
      <div className="flex justify-end pt-4">
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onNext}
          disabled={appointmentData.services.length === 0}>
          Continue
        </Button>
      </div>
    </CardBody>
  );
};

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
        <h2 className="text-2xl font-black">Choose Time</h2>
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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
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
            className="font-bold py-6">
            {time}
          </Button>
        ))}
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}>
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
        <h2 className="text-2xl font-black">Contact Details</h2>
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
          label="Email"
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
          label="Phone"
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
      <AddressAutocomplete
        label="Address"
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
      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onNext}
          disabled={!isFormValid}>
          Review Booking
        </Button>
      </div>
    </CardBody>
  );
};

const PaymentStep = ({
  appointmentData,
  onSubmit,
  onPrevious,
  createAppointmentPending,
}: any) => {
  const { data: servicesData } = useGetServices({});
  const selected = appointmentData.services
    .map((id: string) => servicesData?.data?.find((s: any) => s._id === id))
    .filter(Boolean);
  const total = selected.reduce(
    (acc: number, curr: any) => acc + curr.servicePrice,
    0
  );
  return (
    <CardBody className="p-6 md:p-10 space-y-8">
      <div className="flex items-center gap-3 border-b border-divider pb-6">
        <div className="bg-success-50 p-3 rounded-2xl">
          <ShieldCheck className="text-success" />
        </div>
        <h2 className="text-2xl font-black">Review & Pay</h2>
      </div>
      <div className="bg-default-50 p-6 rounded-3xl border-2 border-dashed border-divider">
        {selected.map((s: any) => (
          <div
            key={s._id}
            className="flex justify-between py-2 border-b border-divider last:border-0">
            <span className="font-bold">{s.serviceName}</span>
            <span className="font-black">${s.servicePrice}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4">
          <span className="text-xl font-black">Total</span>
          <span className="text-2xl font-black text-danger">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex justify-between pt-6">
        <Button
          variant="light"
          className="font-bold"
          onPress={onPrevious}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="px-10 font-bold"
          onPress={onSubmit}
          isLoading={createAppointmentPending}>
          Pay via Stripe
        </Button>
      </div>
    </CardBody>
  );
};

/* --- SUCCESS STEP WITH IMPROVED PDF INVOICE --- */
const SuccessStep = ({
  appointmentData,
}: {
  appointmentData: AppointmentData;
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { data: servicesData } = useGetServices({});
  const selected = appointmentData.services
    .map((id: string) => servicesData?.data?.find((s: any) => s._id === id))
    .filter(Boolean);
  const total = selected.reduce(
    (acc: number, curr: any) => acc + curr.servicePrice,
    0
  );

  const handleDownloadInvoice = async () => {
    if (!invoiceRef.current) return;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Invoice_${appointmentData.user.firstName}.pdf`);
  };

  return (
    <CardBody className="p-6 md:p-12 text-center space-y-8">
      {/* UI Visualization */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-success-50 p-6 rounded-full animate-bounce">
          <CheckCircle
            size={64}
            className="text-success"
          />
        </div>
        <h2 className="text-3xl font-black uppercase">Service Booked!</h2>
        <p className="text-default-500">
          Your professional service is scheduled. Details sent to your email.
        </p>
      </div>

      {/* Hidden Professional Invoice Template (used only for PDF capture) */}
      <div className="absolute left-[-9999px] top-0">
        <div
          ref={invoiceRef}
          className="w-[800px] p-12 bg-white text-black font-sans leading-normal">
          <div className="flex justify-between items-start border-b-4 border-red-600 pb-8">
            <div>
              <h1 className="text-4xl font-black text-red-600">TYRE DASH</h1>
              <p className="text-gray-500 font-bold tracking-widest uppercase">
                Professional Service Invoice
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase">
                Date: {new Date().toLocaleDateString()}
              </h2>
              <p className="text-gray-500">
                Invoice ID: #TD-{Math.floor(1000 + Math.random() * 9000)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 my-12">
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-red-600 border-b pb-2">
                Customer Info
              </h3>
              <p className="font-bold text-lg">
                {appointmentData.user.firstName} {appointmentData.user.lastName}
              </p>
              <p className="text-gray-600">{appointmentData.user.email}</p>
              <p className="text-gray-600">
                {appointmentData.user.phoneNumber}
              </p>
              <p className="text-gray-600 italic mt-2">
                {appointmentData.user.addressLine1}, {appointmentData.user.city}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase text-red-600 border-b pb-2">
                Schedule Details
              </h3>
              <div className="flex items-center gap-2 font-bold">
                <Calendar size={14} /> Date: {appointmentData.schedule.date}
              </div>
              <div className="flex items-center gap-2 font-bold">
                <Clock size={14} /> Time: {appointmentData.schedule.time}
              </div>
              <p className="text-green-600 font-black uppercase text-xs mt-2 border border-green-600 inline-block px-2 py-1">
                Payment Status: Paid via Stripe
              </p>
            </div>
          </div>

          <table className="w-full text-left my-8 border-collapse">
            <thead>
              <tr className="bg-gray-100 uppercase text-xs font-black border-b-2 border-gray-300">
                <th className="py-4 px-2">Service Description</th>
                <th className="py-4 px-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {selected.map((s: any) => (
                <tr
                  key={s._id}
                  className="border-b border-gray-100">
                  <td className="py-4 px-2 font-medium">{s.serviceName}</td>
                  <td className="py-4 px-2 text-right font-bold">
                    ${s.servicePrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-6">
            <div className="w-64 space-y-3">
              <div className="flex justify-between items-center text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>Tax (0%)</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-red-600 pt-4">
                <span className="text-xl font-black">TOTAL</span>
                <span className="text-2xl font-black text-red-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-20 border-t pt-8 text-center text-gray-400 text-xs uppercase tracking-widest">
            Tyre Dash LLC • Performance Guaranteed • Thank you for your
            business!
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          color="danger"
          className="font-black px-12 h-14 shadow-xl"
          onPress={handleDownloadInvoice}
          startContent={<Printer size={20} />}>
          Download Professional Invoice
        </Button>
        <Button
          variant="bordered"
          className="font-black px-12 h-14 border-2"
          onPress={() => (window.location.href = "/")}>
          Back to Home
        </Button>
      </div>
    </CardBody>
  );
};

export default AppointmentBookingPage;
