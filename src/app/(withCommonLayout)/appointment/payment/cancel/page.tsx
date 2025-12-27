"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import {
  XCircle,
  AlertCircle,
  Home,
  RefreshCw,
  Calendar,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { useGetSingleAppointment } from "@/src/hooks/appointment.hook";

const PaymentCancelPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

  const appointmentId = searchParams.get("appointmentId");

  const { data: appointmentData, isLoading } = useGetSingleAppointment(
    appointmentId || ""
  );

  useEffect(() => {
    if (appointmentData?.data) {
      setAppointmentDetails(appointmentData.data);
    }
  }, [appointmentData]);

  const handleRetryPayment = () => {
    // Redirect back to appointment booking to let them try again
    router.push("/appointment");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-8 px-4">
        <Card className="max-w-md w-full shadow-2xl rounded-3xl bg-content1 border border-divider">
          <CardBody className="text-center py-16 space-y-6">
            <Spinner
              size="lg"
              color="warning"
            />
            <div>
              <h2 className="text-2xl font-black text-foreground mb-2 tracking-tight uppercase">
                Syncing Details
              </h2>
              <p className="text-default-500 font-medium">
                Please wait while we load your appointment info...
              </p>
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
            {/* Cancel Icon */}
            <div className="relative inline-block">
              <div className="bg-warning-50 p-8 rounded-full animate-pulse">
                <XCircle className="h-16 w-16 text-warning" />
              </div>
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
                PAYMENT{" "}
                <span className="text-warning uppercase">Cancelled</span>
              </h1>
              <p className="text-default-500 font-medium text-lg max-w-md mx-auto leading-relaxed">
                Your transaction was not completed. No funds were captured, and
                your booking is currently on hold.
              </p>
            </div>

            {/* Status Alert Box */}
            <div className="max-w-md mx-auto">
              <Card className="bg-warning-50 border border-warning-200 shadow-none rounded-2xl">
                <CardBody className="p-5 flex flex-row items-start gap-4">
                  <AlertCircle className="h-6 w-6 text-warning mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-bold text-warning-900 mb-1">
                      Status: Pending Payment
                    </p>
                    <p className="text-xs text-warning-800 leading-tight">
                      Your selected time slot is temporarily reserved but will
                      be released soon if payment is not confirmed.
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Appointment Details */}
            {appointmentDetails && (
              <div className="mt-8">
                <Card className="bg-content2 border border-divider shadow-sm rounded-[2rem] overflow-hidden">
                  <div className="bg-default-100 px-6 py-4 border-b border-divider text-left">
                    <span className="text-[10px] font-black uppercase tracking-widest text-default-400">
                      Booking Summary
                    </span>
                  </div>
                  <CardBody className="p-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-background p-3 rounded-2xl border border-divider shadow-sm">
                          <Calendar className="h-5 w-5 text-danger" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                            Service Date
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {new Date(
                              appointmentDetails.schedule?.date
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-background p-3 rounded-2xl border border-divider shadow-sm">
                          <Clock className="h-5 w-5 text-danger" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                            Time Slot
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {appointmentDetails.schedule?.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:col-span-2">
                        <div className="bg-background p-3 rounded-2xl border border-divider shadow-sm">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-default-400 uppercase tracking-widest">
                            Customer
                          </p>
                          <p className="text-base font-bold text-foreground">
                            {appointmentDetails.user?.firstName}{" "}
                            {appointmentDetails.user?.lastName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {appointmentDetails.payment?.amount && (
                      <div className="mt-8 pt-6 border-t border-dashed border-divider flex justify-between items-center">
                        <span className="font-bold text-default-500 uppercase text-xs tracking-widest">
                          Amount Due
                        </span>
                        <span className="text-2xl font-black text-danger">
                          ${appointmentDetails.payment.amount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                color="danger"
                size="lg"
                className="font-black px-12 rounded-2xl shadow-xl shadow-danger/20"
                startContent={<RefreshCw className="h-5 w-5" />}
                onPress={handleRetryPayment}>
                RETRY PAYMENT
              </Button>
              <Button
                variant="bordered"
                size="lg"
                className="font-black border-2 px-12 rounded-2xl border-divider text-foreground hover:bg-default-100"
                startContent={<Home className="h-5 w-5" />}
                onPress={() => router.push("/")}>
                BACK TO HOME
              </Button>
            </div>

            {/* Help Text */}
            <div className="pt-6 border-t border-divider">
              <p className="text-xs font-medium text-default-400 uppercase tracking-tighter">
                Having issues? Contact our tech team at
                <span className="text-danger ml-1">support@tyredash.com</span>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
