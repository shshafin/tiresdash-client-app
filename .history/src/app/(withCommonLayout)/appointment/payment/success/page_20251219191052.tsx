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
} from "lucide-react";
import { useVerifyStripePayment } from "@/src/hooks/appointment.hook";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasCalledVerify = useRef(false); // Prevent double-calling in StrictMode
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  const appointmentId = searchParams.get("appointmentId");
  const sessionId = searchParams.get("session_id"); // This is the {CHECKOUT_SESSION_ID} from backend

  const { mutate: verifyStripe, isPending: verifyingStripe } =
    useVerifyStripePayment({
      onSuccess: (data: any) => {
        // Adjust this based on your API response structure
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
    // Only run if we have both IDs and haven't called it yet
    if (appointmentId && sessionId && !hasCalledVerify.current) {
      hasCalledVerify.current = true;
      verifyStripe({ appointmentId, sessionId });
    } else if (!appointmentId || !sessionId) {
      // If the URL is missing params, it's an immediate error
      setVerificationStatus("error");
    }
  }, [appointmentId, sessionId, verifyStripe]);

  // --- Loading State ---
  if (verificationStatus === "loading" || verifyingStripe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-8 px-4">
        <Card className="max-w-md w-full shadow-xl rounded-3xl border-none">
          <CardBody className="text-center py-16 space-y-6">
            <Spinner
              size="lg"
              color="danger"
            />
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Verifying Payment
              </h2>
              <p className="text-gray-500 font-medium">
                We are confirming your transaction with Stripe. Please do not
                close this window.
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-8 px-4">
        <Card className="max-w-md w-full shadow-xl rounded-3xl border-none">
          <CardBody className="text-center py-12 space-y-6">
            <div className="bg-red-100 p-6 rounded-full inline-block">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-500 text-sm">
                We couldn't verify your appointment status. If your card was
                charged, don't worry—our team will contact you shortly.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button
                color="danger"
                className="font-bold py-6"
                onPress={() => router.push("/appointment")}>
                Try Again
              </Button>
              <Button
                variant="light"
                className="font-bold"
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
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-2xl rounded-[2.5rem] border-none overflow-hidden">
          <CardBody className="text-center p-8 md:p-16 space-y-8">
            {/* Success Icon */}
            <div className="relative inline-block">
              <div className="bg-green-100 p-8 rounded-full animate-pulse">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                <ShieldCheck className="text-blue-500 h-6 w-6" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                PAYMENT{" "}
                <span className="text-green-600 uppercase">Success</span>
              </h1>
              <p className="text-gray-500 font-medium text-lg">
                Your appointment is now confirmed and added to our schedule.
              </p>
            </div>

            {/* Appointment Details Box */}
            {appointmentDetails && (
              <div className="mt-8">
                <Card className="bg-white border-2 border-gray-100 shadow-sm rounded-3xl overflow-hidden">
                  <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Appointment Receipt
                    </span>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                      Paid In Full
                    </span>
                  </div>
                  <CardBody className="p-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-red-50 p-3 rounded-2xl">
                            <Calendar className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              Date
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {new Date(
                                appointmentDetails.schedule?.date
                              ).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-red-50 p-3 rounded-2xl">
                            <Clock className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              Time Slot
                            </p>
                            <p className="text-lg font-black text-gray-900">
                              {appointmentDetails.schedule?.time}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-blue-50 p-3 rounded-2xl">
                            <Mail className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              Confirmation Sent
                            </p>
                            <p className="text-base font-bold text-gray-900 truncate">
                              {appointmentDetails.user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-green-50 p-3 rounded-2xl">
                            <Phone className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                              Contact Number
                            </p>
                            <p className="text-base font-bold text-gray-900">
                              {appointmentDetails.user?.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-dashed border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-500">
                          Total Payment
                        </span>
                        <span className="text-3xl font-black text-red-600">
                          ${appointmentDetails.payment?.amount?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                color="danger"
                variant="bordered"
                size="lg"
                className="font-black border-2 px-10 rounded-2xl"
                startContent={<Home className="h-5 w-5" />}
                onPress={() => router.push("/")}>
                BACK TO HOME
              </Button>
              <Button
                color="danger"
                size="lg"
                className="font-black px-10 rounded-2xl shadow-xl shadow-red-200"
                onPress={() => router.push("/appointment")}>
                NEW APPOINTMENT
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
