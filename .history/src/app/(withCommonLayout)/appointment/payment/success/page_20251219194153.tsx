"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Mail,
  Phone,
  Home,
  ShieldCheck,
  ArrowRight,
  Download,
} from "lucide-react";
import { useVerifyStripePayment } from "@/src/hooks/appointment.hook";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasCalledVerify = useRef(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  const appointmentId = searchParams.get("appointmentId");
  const sessionId = searchParams.get("session_id");

  const { mutate: verifyStripe, isPending: verifyingStripe } =
    useVerifyStripePayment({
      onSuccess: (data: any) => {
        if (data?.success || data?.data?.status === "confirmed") {
          setVerificationStatus("success");
          setAppointmentDetails(data.data);
        } else {
          setVerificationStatus("error");
        }
      },
      onError: (error: any) => {
        console.error("Verification error:", error);
        setVerificationStatus("error");
      },
    });

  useEffect(() => {
    if (appointmentId && sessionId && !hasCalledVerify.current) {
      hasCalledVerify.current = true;
      verifyStripe({ appointmentId, sessionId });
    } else if (!appointmentId || !sessionId) {
      setVerificationStatus("error");
    }
  }, [appointmentId, sessionId, verifyStripe]);

  // --- NATIVE PDF GENERATION LOGIC (PROFESSIONAL) ---
  const generateInvoicePDF = () => {
    if (!appointmentDetails) return;

    const doc = new jsPDF();
    const primaryRed = "#DC2626";

    // 1. Header & Brand
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(primaryRed);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("TYRE DASH", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("OFFICIAL SERVICE RECEIPT", 20, 33);

    // 2. Meta Data (Top Right)
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text(
      `RECEIPT: #TD-${appointmentDetails._id.slice(-6).toUpperCase()}`,
      140,
      20
    );
    doc.text(`DATE: ${new Date().toLocaleDateString()}`, 140, 26);
    doc.text(`STATUS: PAID via STRIPE`, 140, 32);

    // 3. Section Dividers & Labels
    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 20, 55);
    doc.text("APPOINTMENT INFO", 110, 55);

    // 4. Content Logic
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);

    // Customer Side
    const user = appointmentDetails.user;
    doc.text(`${user.firstName} ${user.lastName}`, 20, 63);
    doc.text(`${user.email}`, 20, 69);
    doc.text(`${user.phoneNumber}`, 20, 75);
    doc.text(`${user.addressLine1}`, 20, 81);
    doc.text(`${user.city}, ${user.state} ${user.zipCode}`, 20, 87);

    // Appointment Side
    doc.text(
      `Date: ${new Date(appointmentDetails.schedule.date).toDateString()}`,
      110,
      63
    );
    doc.text(`Time: ${appointmentDetails.schedule.time}`, 110, 69);
    doc.text(`Location: Tyre Dash Service Center`, 110, 75);

    // 5. Services Table
    const tableBody = appointmentDetails.services.map((s: any) => [
      s.serviceName,
      `$${s.servicePrice.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 95,
      head: [["Service Description", "Price"]],
      body: tableBody,
      theme: "striped",
      headStyles: {
        fillColor: [220, 38, 38],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: { 1: { halign: "right" } },
      margin: { left: 20, right: 20 },
    });

    // 6. Total Box
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("TOTAL AMOUNT PAID:", 110, finalY + 5);
    doc.setTextColor(primaryRed);
    doc.text(
      `$${appointmentDetails.payment.amount.toFixed(2)}`,
      190,
      finalY + 5,
      {
        align: "right",
      }
    );

    // 7. Footer
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      "This is a digitally generated invoice. No signature required.",
      105,
      280,
      { align: "center" }
    );

    doc.save(`TyreDash_Invoice_${user.lastName}.pdf`);
  };

  // --- UI RENDERING ---

  if (verificationStatus === "loading" || verifyingStripe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
        <Card className="max-w-md w-full shadow-2xl rounded-3xl bg-content1 border border-divider">
          <CardBody className="text-center py-16 space-y-6">
            <Spinner
              size="lg"
              color="danger"
            />
            <div>
              <h2 className="text-2xl font-black text-foreground mb-2">
                Verifying Payment
              </h2>
              <p className="text-default-500 font-medium">
                Syncing with Stripe... Please don't refresh.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
        <Card className="max-w-md w-full shadow-2xl rounded-3xl bg-content1 border border-divider">
          <CardBody className="text-center py-12 space-y-6">
            <div className="bg-danger-50 p-6 rounded-full inline-block">
              <XCircle className="h-16 w-16 text-danger" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-foreground mb-2">
                Verification Failed
              </h2>
              <p className="text-default-500 text-sm">
                We couldn't confirm your transaction. If money was deducted, our
                support team will reach out via email.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4 w-full">
              <Button
                color="danger"
                className="font-bold py-6 rounded-2xl"
                onPress={() => router.push("/appointment")}>
                Try Again
              </Button>
              <Button
                variant="light"
                className="font-bold rounded-2xl"
                onPress={() => router.push("/")}>
                Go to Home
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl rounded-[2.5rem] bg-content1 border border-divider overflow-hidden">
          <CardBody className="text-center p-8 md:p-16 space-y-8">
            <div className="relative inline-block">
              <div className="bg-success-50 p-8 rounded-full animate-pulse">
                <CheckCircle className="h-16 w-16 text-success" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-content1 p-2 rounded-full shadow-lg border border-divider">
                <ShieldCheck className="text-primary h-6 w-6" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
                PAYMENT <span className="text-success uppercase">Success</span>
              </h1>
              <p className="text-default-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                Your professional service slot has been secured. Download your
                receipt below.
              </p>
            </div>

            {appointmentDetails && (
              <div className="mt-8">
                <Card className="bg-content2 border border-divider shadow-sm rounded-[2rem] overflow-hidden">
                  <div className="bg-default-100 px-6 py-4 border-b border-divider flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-default-400">
                      Booking Summary
                    </span>
                    <div className="flex items-center gap-1 bg-success-100 text-success-700 px-3 py-1 rounded-full">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-bold uppercase">
                        Verified
                      </span>
                    </div>
                  </div>
                  <CardBody className="p-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-danger-50 p-3 rounded-2xl">
                            <Calendar className="h-5 w-5 text-danger" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                              Date
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {new Date(
                                appointmentDetails.schedule?.date
                              ).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-danger-50 p-3 rounded-2xl">
                            <Clock className="h-5 w-5 text-danger" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                              Time
                            </p>
                            <p className="text-lg font-bold text-foreground">
                              {appointmentDetails.schedule?.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6 border-l border-divider pl-0 md:pl-8 border-none md:border-solid">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary-50 p-3 rounded-2xl">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                              Account
                            </p>
                            <p className="text-base font-bold text-foreground truncate">
                              {appointmentDetails.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-success-50 p-3 rounded-2xl">
                            <Phone className="h-5 w-5 text-success" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                              Contact
                            </p>
                            <p className="text-base font-bold text-foreground">
                              {appointmentDetails.user?.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-dashed border-divider flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-default-400 uppercase tracking-widest">
                          Total Deducted
                        </span>
                        <span className="text-3xl font-black text-danger">
                          ${appointmentDetails.payment?.amount?.toFixed(2)}
                        </span>
                      </div>
                      <Button
                        color="danger"
                        variant="flat"
                        size="lg"
                        className="font-bold rounded-2xl px-8"
                        onPress={generateInvoicePDF}
                        startContent={<Download size={18} />}>
                        Save Invoice
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="bordered"
                size="lg"
                className="font-black border-2 px-12 rounded-2xl border-divider text-foreground"
                startContent={<Home className="h-5 w-5" />}
                onPress={() => router.push("/")}>
                RETURN HOME
              </Button>
              <Button
                color="danger"
                size="lg"
                className="font-black px-12 rounded-2xl shadow-xl shadow-danger/20"
                endContent={<ArrowRight className="h-5 w-5" />}
                onPress={() => router.push("/appointment")}>
                NEW BOOKING
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
