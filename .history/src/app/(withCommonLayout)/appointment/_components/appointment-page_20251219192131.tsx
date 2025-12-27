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
import autoTable from "jspdf-autotable"; // Make sure to npm install jspdf-autotable
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
    <div className="min-h-screen bg-background text-foreground py-6 md:py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight uppercase">
            Book <span className="text-danger">Service</span>
          </h1>
          <p className="text-default-500 max-w-md mx-auto text-sm">
            Schedule expert maintenance in just a few clicks.
          </p>
        </div>

        {currentStep <= totalSteps && (
          <div className="mb-10">
            <div className="flex justify-between items-end mb-3 px-2">
              <span className="text-sm font-black uppercase text-danger">
                Step {currentStep}
              </span>
              <span className="text-sm font-bold text-default-400">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress
              value={progress}
              className="h-2"
              color="danger"
            />
          </div>
        )}

        <Card className="shadow-2xl rounded-3xl bg-content1 border border-divider">
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

/* --- STEPS (Simplified for Cleanliness) --- */

const ServicesStep = ({ appointmentData, setAppointmentData, onNext }: any) => {
  const { data: servicesData, isLoading } = useGetServices({});
  const services = servicesData?.data || [];
  if (isLoading)
    return (
      <div className="p-20 flex justify-center">
        <Spinner color="danger" />
      </div>
    );

  return (
    <CardBody className="p-6 md:p-10 space-y-6">
      <h2 className="text-2xl font-black flex items-center gap-2">
        <Wrench className="text-danger" /> Select Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s: any) => {
          const isSelected = appointmentData.services.includes(s._id);
          return (
            <div
              key={s._id}
              onClick={() => {
                const next = isSelected
                  ? appointmentData.services.filter(
                      (id: string) => id !== s._id
                    )
                  : [...appointmentData.services, s._id];
                setAppointmentData({ ...appointmentData, services: next });
              }}
              className={`cursor-pointer p-5 rounded-2xl border-2 transition-all ${isSelected ? "border-danger bg-danger-50" : "border-divider bg-content2"}`}>
              <div className="flex justify-between font-bold mb-1">
                <span>{s.serviceName}</span>
                <Checkbox
                  isSelected={isSelected}
                  color="danger"
                />
              </div>
              <p className="text-xl font-black text-danger">
                ${s.servicePrice}
              </p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end pt-4">
        <Button
          color="danger"
          size="lg"
          className="font-bold px-12"
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
  const slots = [
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
      <h2 className="text-2xl font-black flex items-center gap-2">
        <Calendar className="text-danger" /> Choose Time
      </h2>
      <Input
        type="date"
        label="Date"
        variant="bordered"
        value={appointmentData.schedule.date}
        onValueChange={(v) =>
          setAppointmentData({
            ...appointmentData,
            schedule: { ...appointmentData.schedule, date: v },
          })
        }
        min={new Date().toISOString().split("T")[0]}
      />
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {slots.map((t) => (
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
            className="font-bold">
            {t}
          </Button>
        ))}
      </div>
      <div className="flex justify-between">
        <Button
          variant="light"
          onPress={onPrevious}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          onPress={onNext}
          disabled={
            !appointmentData.schedule.date || !appointmentData.schedule.time
          }>
          Next
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
  return (
    <CardBody className="p-6 md:p-10 space-y-6">
      <h2 className="text-2xl font-black flex items-center gap-2">
        <User className="text-danger" /> Contact Info
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name"
          variant="bordered"
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
          variant="bordered"
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
          variant="bordered"
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
        label="Street Address"
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
      />
      <div className="grid grid-cols-3 gap-4">
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
          label="Zip"
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
      <div className="flex justify-between">
        <Button
          variant="light"
          onPress={onPrevious}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          onPress={onNext}>
          Review
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
    <CardBody className="p-6 md:p-10 space-y-6">
      <h2 className="text-2xl font-black flex items-center gap-2">
        <CreditCard className="text-danger" /> Review & Pay
      </h2>
      <div className="bg-default-50 p-6 rounded-2xl border-2 border-dashed border-divider">
        {selected.map((s: any) => (
          <div
            key={s._id}
            className="flex justify-between py-2 border-b border-divider last:border-0">
            <span className="font-bold">{s.serviceName}</span>
            <span>${s.servicePrice}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 font-black text-xl text-danger">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="light"
          onPress={onPrevious}>
          Back
        </Button>
        <Button
          color="danger"
          size="lg"
          className="font-bold px-10"
          onPress={onSubmit}
          isLoading={createAppointmentPending}>
          Pay via Stripe
        </Button>
      </div>
    </CardBody>
  );
};

/* --- SUCCESS STEP WITH PROFESSIONAL NATIVE PDF LOGIC --- */
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

    // 1. Header & Branding
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(primaryColor);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("TYRE DASH", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("PROFESSIONAL SERVICE INVOICE", 20, 32);

    // 2. Invoice Meta Info
    doc.setTextColor(0);
    doc.setFont("helvetica", "bold");
    doc.text(
      `INVOICE NO: #TD-${Math.floor(100000 + Math.random() * 900000)}`,
      140,
      20
    );
    doc.setFont("helvetica", "normal");
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 140, 26);
    doc.text(`STATUS: PAID (STRIPE)`, 140, 32);

    // 3. Customer & Schedule Sections
    doc.setDrawColor(230);
    doc.line(20, 50, 190, 50);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 60);
    doc.text("APPOINTMENT SCHEDULE", 110, 60);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50);
    // Customer Info
    doc.text(
      `${appointmentData.user.firstName} ${appointmentData.user.lastName}`,
      20,
      68
    );
    doc.text(`${appointmentData.user.email}`, 20, 74);
    doc.text(`${appointmentData.user.phoneNumber}`, 20, 80);
    doc.text(`${appointmentData.user.addressLine1}`, 20, 86);
    doc.text(
      `${appointmentData.user.city}, ${appointmentData.user.state} ${appointmentData.user.zipCode}`,
      20,
      92
    );

    // Schedule Info
    doc.text(`DATE: ${appointmentData.schedule.date}`, 110, 68);
    doc.text(`TIME SLOT: ${appointmentData.schedule.time}`, 110, 74);
    doc.text(`LOCATION: Main Service Center`, 110, 80);

    // 4. Services Table
    const tableRows = selectedServices.map((s) => [
      s.serviceName,
      `$${s.servicePrice.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 105,
      head: [["Service Name", "Price"]],
      body: tableRows,
      theme: "striped",
      headStyles: {
        fillStyle: "F",
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 20, right: 20 },
    });

    // 5. Total Section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setDrawColor(200);
    doc.line(130, finalY, 190, finalY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TOTAL AMOUNT:", 130, finalY + 10);
    doc.setTextColor(primaryColor);
    doc.text(`$${totalAmount.toFixed(2)}`, 190, finalY + 10, {
      align: "right",
    });

    // 6. Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      "Thank you for choosing Tyre Dash. Please bring a copy of this invoice to your appointment.",
      105,
      280,
      { align: "center" }
    );

    doc.save(`TyreDash_Invoice_${appointmentData.user.lastName}.pdf`);
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
        <h2 className="text-4xl font-black text-foreground">
          BOOKING CONFIRMED!
        </h2>
        <p className="text-default-500 max-w-sm mx-auto">
          Your payment was successful. We are excited to see you on{" "}
          <span className="text-danger font-bold">
            {appointmentData.schedule.date}
          </span>
          .
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button
          color="danger"
          size="lg"
          className="font-black px-12 h-16 shadow-2xl"
          onPress={generateProfessionalInvoice}
          startContent={<FileText size={24} />}>
          DOWNLOAD INVOICE
        </Button>
        <Button
          variant="bordered"
          size="lg"
          className="font-bold px-12 h-16 border-2"
          onPress={() => (window.location.href = "/")}>
          RETURN HOME
        </Button>
      </div>
    </CardBody>
  );
};

export default AppointmentBookingPage;
