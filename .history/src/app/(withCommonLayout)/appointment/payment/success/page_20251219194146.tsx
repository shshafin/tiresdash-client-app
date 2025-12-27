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
} from "lucide-react";
import { useVerifyStripePayment } from "@/src/hooks/appointment.hook";

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

  // --- Loading State ---
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

  // --- Error State ---
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

  // --- Success State ---
  return (
    <div className="min-h-screen bg-background py-12 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl rounded-[2.5rem] bg-content1 border border-divider overflow-hidden">
          <CardBody className="text-center p-8 md:p-16 space-y-8">
            {/* Success Icon */}
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
                Your professional service slot has been secured. Check your
                inbox for the receipt.
              </p>
            </div>

            {/* Appointment Details Box */}
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

                    <div className="mt-10 pt-6 border-t border-dashed border-divider">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-default-400 uppercase">
                            Amount Deducted
                          </span>
                          <span className="text-3xl font-black text-danger">
                            ${appointmentDetails.payment?.amount?.toFixed(2)}
                          </span>
                        </div>
                        <Button
                          variant="flat"
                          size="sm"
                          className="font-bold text-default-600 rounded-xl"
                          onPress={() => window.print()}>
                          Save Invoice
                        </Button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                variant="bordered"
                size="lg"
                className="font-black border-2 px-12 rounded-2xl border-divider text-foreground hover:bg-default-100"
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
