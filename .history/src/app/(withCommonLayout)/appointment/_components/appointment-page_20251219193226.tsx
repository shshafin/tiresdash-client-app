"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  FileText,
  Download,
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
            Professional tire and wheel maintenance at your convenience. Secure
            your slot in seconds.
          </p>
        </div>

        {currentStep <= totalSteps && (
          <div className="mb-10 px-2">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-danger uppercase tracking-widest">
                  Progress
                </span>
                <span className="text-lg font-black text-gray-900">
                  Step {currentStep} of {totalSteps}
                </span>
              </div>
              <span className="text-sm font-bold text-default-400">
                {Math.round(progress)}% Complete
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

/* --- STEP COMPONENTS --- */

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
            Pick the maintenance tasks you need
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
              className={`group cursor-pointer p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${isSelected ? "border-danger bg-danger-50 shadow-md" : "border-divider bg-content2"}`}>
              <div className="flex justify-between items-start mb-2">
                <h4
                  className={`font-bold ${isSelected ? "text-danger" : "text-foreground"}`}>
                  {service.serviceName}
                </h4>
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
        {timeSlots.map((t) => (
          <Button
            key={t}
            variant={appointmentData.schedule.time === t ? "solid" : "bordered"}
            color={appointmentData.schedule.time === t ? "danger" : "default"}
            onPress={() =>
              setAppointmentData({
                ...appointmentData,
                schedule: { ...appointmentData.schedule, time: t },
              })
            }
            className="font-bold py-6">
            {t}
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
          disabled={
            !appointmentData.schedule.date || !appointmentData.schedule.time
          }>
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
    appointmentData.user.state &&
    appointmentData.user.zipCode;
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
      <AddressAutocomplete
        label="Full Address"
        value={appointmentData.user.addressLine1}
        onValueChange={(v) =>
          setAppointmentData({
            ...appointmentData,
            user: { ...appointmentData.user, addressLine1: v },
          })
        }
        onAddressSelect={(c) =>
          setAppointmentData({
            ...appointmentData,
            user: {
              ...appointmentData.user,
              addressLine1: c.addressLine1,
              city: c.city,
              state: c.state,
              zipCode: c.zipCode,
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
          isRequired
        />
        <Input
          label="State"
          variant="bordered"
          value={appointmentData.user.state}
          isRequired
        />
        <Input
          label="Zip Code"
          variant="bordered"
          value={appointmentData.user.zipCode}
          isRequired
        />
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
          Finalize Booking
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
            className="flex justify-between py-2 border-b border-divider last:border-0 font-bold">
            <span>{s.serviceName}</span>
            <span>${s.servicePrice}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 mt-2 font-black text-2xl text-danger">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
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

/* --- SUCCESS STEP WITH CLEAN NATIVE PDF LOGIC --- */
const SuccessStep = ({
  appointmentData,
}: {
  appointmentData: AppointmentData;
}) => {
  const { data: servicesData } = useGetServices({});
  const selectedServices = appointmentData.services
    .map((id: string) => servicesData?.data?.find((s: any) => s._id === id))
    .filter(Boolean);

  const totalAmount = selectedServices.reduce(
    (acc: number, curr: any) => acc + curr.servicePrice,
    0
  );

  const generateProfessionalInvoice = () => {
    const doc = new jsPDF();
    const primaryColor = "#DC2626"; // Red-600

    // 1. Header Area
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 45, "F");
    doc.setTextColor(primaryColor);
    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text("TYRE DASH", 20, 30);

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.setFont("helvetica", "normal");
    doc.text("PROFESSIONAL TIRE & WHEEL SERVICES", 20, 38);

    doc.setTextColor(0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 160, 25);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`#TD-${Math.floor(100000 + Math.random() * 900000)}`, 160, 32);
    doc.text(new Date().toLocaleDateString(), 160, 38);

    // 2. Info Grid
    doc.setDrawColor(230);
    doc.line(20, 55, 190, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 65);
    doc.text("APPOINTMENT INFO", 120, 65);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    // Left: Customer
    doc.text(
      `${appointmentData.user.firstName} ${appointmentData.user.lastName}`,
      20,
      72
    );
    doc.text(appointmentData.user.email, 20, 78);
    doc.text(appointmentData.user.phoneNumber, 20, 84);
    doc.text(`${appointmentData.user.addressLine1}`, 20, 90);
    doc.text(
      `${appointmentData.user.city}, ${appointmentData.user.state} ${appointmentData.user.zipCode}`,
      20,
      96
    );

    // Right: Schedule
    doc.text(`Date: ${appointmentData.schedule.date}`, 120, 72);
    doc.text(`Time: ${appointmentData.schedule.time}`, 120, 78);
    doc.text(`Status: PAID via Stripe`, 120, 84);

    // 3. Table
    const tableRows = selectedServices.map((s) => [
      s.serviceName,
      `$${s.servicePrice.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 110,
      head: [["Service Description", "Amount"]],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 20, right: 20 },
    });

    // 4. Total Area
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setDrawColor(200);
    doc.line(120, finalY, 190, finalY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("TOTAL PAID:", 120, finalY + 15);
    doc.text(`$${totalAmount.toFixed(2)}`, 190, finalY + 15, {
      align: "right",
    });

    // 5. Terms Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is a digitally generated invoice. No signature required.",
      105,
      275,
      { align: "center" }
    );
    doc.text(
      "Thank you for your business! Please show this PDF at the service center.",
      105,
      282,
      { align: "center" }
    );

    doc.save(`Invoice_TyreDash_${appointmentData.user.lastName}.pdf`);
  };

  return (
    <CardBody className="p-10 text-center space-y-8">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-success-50 p-8 rounded-full animate-bounce">
          <CheckCircle
            size={80}
            className="text-success"
          />
        </div>
        <h2 className="text-4xl font-black text-foreground tracking-tight">
          BOOKING SECURED!
        </h2>
        <p className="text-default-500 max-w-sm mx-auto">
          Payment confirmed. We look forward to seeing you on{" "}
          <span className="text-danger font-bold">
            {appointmentData.schedule.date}
          </span>
          .
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
        <Button
          color="danger"
          size="lg"
          className="font-black px-12 h-16 shadow-2xl"
          onPress={generateProfessionalInvoice}
          startContent={<Download size={24} />}>
          DOWNLOAD INVOICE
        </Button>
        <Button
          variant="bordered"
          size="lg"
          className="font-black px-12 h-16 border-2"
          onPress={() => (window.location.href = "/")}>
          RETURN HOME
        </Button>
      </div>
    </CardBody>
  );
};

export default AppointmentBookingPage;
