"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { XCircle, AlertCircle, Home, RefreshCw } from "lucide-react";
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
        if (appointmentId) {
            // Redirect back to appointment page or create a retry flow
            router.push("/appointment");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <Card className="max-w-md w-full">
                    <CardBody className="text-center py-12 space-y-6">
                        <Spinner size="lg" color="danger" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Loading...
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we load your appointment details...
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg">
                    <CardBody className="text-center py-12 space-y-6">
                        {/* Cancel Icon */}
                        <div className="bg-orange-100 p-6 rounded-full inline-block">
                            <XCircle className="h-16 w-16 text-orange-600" />
                        </div>

                        {/* Cancel Message */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Payment Cancelled
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Your payment was cancelled. Your appointment is still pending
                                and waiting for payment.
                            </p>
                        </div>

                        {/* Warning Message */}
                        <Card className="bg-yellow-50 border-2 border-yellow-200 max-w-md mx-auto">
                            <CardBody className="p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                    <div className="text-left">
                                        <p className="font-medium text-yellow-900 mb-1">
                                            Appointment Status: Pending Payment
                                        </p>
                                        <p className="text-sm text-yellow-800">
                                            Your appointment slot is reserved but not confirmed. Please
                                            complete the payment to confirm your booking.
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Appointment Details */}
                        {appointmentDetails && (
                            <div className="mt-6">
                                <Card className="bg-gray-50 border border-gray-200 max-w-md mx-auto">
                                    <CardBody className="p-6 text-left">
                                        <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                            Your Appointment
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-700">Date & Time</p>
                                                <p className="text-gray-900">
                                                    {new Date(
                                                        appointmentDetails.schedule?.date
                                                    ).toLocaleDateString()}{" "}
                                                    at {appointmentDetails.schedule?.time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700">Contact</p>
                                                <p className="text-gray-900">
                                                    {appointmentDetails.user?.firstName}{" "}
                                                    {appointmentDetails.user?.lastName}
                                                </p>
                                                <p className="text-gray-600">
                                                    {appointmentDetails.user?.email}
                                                </p>
                                            </div>
                                            {appointmentDetails.payment?.amount && (
                                                <div className="pt-3 border-t border-gray-200">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium text-gray-700">
                                                            Amount Due
                                                        </span>
                                                        <span className="text-xl font-bold text-red-600">
                                                            ${appointmentDetails.payment.amount.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* What to Do Next */}
                        <Card className="bg-blue-50 border border-blue-200 max-w-md mx-auto">
                            <CardBody className="p-6 text-left">
                                <h3 className="font-semibold mb-3 text-gray-900">
                                    What would you like to do?
                                </h3>
                                <ul className="text-sm space-y-2 text-gray-700">
                                    <li>• Retry payment to confirm your appointment</li>
                                    <li>• Contact us if you need assistance</li>
                                    <li>• Book a new appointment if you prefer different times</li>
                                </ul>
                            </CardBody>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Button
                                color="danger"
                                size="lg"
                                startContent={<RefreshCw className="h-4 w-4" />}
                                onPress={handleRetryPayment}
                            >
                                Retry Payment
                            </Button>
                            <Button
                                color="danger"
                                variant="bordered"
                                startContent={<Home className="h-4 w-4" />}
                                onPress={() => router.push("/")}
                            >
                                Back to Home
                            </Button>
                        </div>

                        {/* Help Text */}
                        <p className="text-sm text-gray-500 pt-4">
                            Need help? Contact us at support@tyredash.com or call
                            1-800-TYREDASH
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default PaymentCancelPage;
