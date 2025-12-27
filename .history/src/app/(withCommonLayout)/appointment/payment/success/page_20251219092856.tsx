"use client";

import { useEffect, useState } from "react";
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
} from "lucide-react";
import {
    useVerifyStripePayment,
    useVerifyPaypalPayment,
    useGetSingleAppointment,
} from "@/src/hooks/appointment.hook";

const PaymentSuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [verificationStatus, setVerificationStatus] = useState<
        "loading" | "success" | "error"
    >("loading");
    const [appointmentDetails, setAppointmentDetails] = useState<any>(null);

    const appointmentId = searchParams.get("appointmentId");
    const sessionId = searchParams.get("session_id"); // Stripe
    const token = searchParams.get("token"); // PayPal

    // Determine payment method based on URL parameters
    const paymentMethod = sessionId ? "stripe" : token ? "paypal" : null;

    const { mutate: verifyStripe, isPending: verifyingStripe } =
        useVerifyStripePayment({
            onSuccess: (data: any) => {
                if (data.success) {
                    setVerificationStatus("success");
                    setAppointmentDetails(data.data);
                } else {
                    setVerificationStatus("error");
                }
            },
            onError: () => {
                setVerificationStatus("error");
            },
        });

    const { mutate: verifyPaypal, isPending: verifyingPaypal } =
        useVerifyPaypalPayment({
            onSuccess: (data: any) => {
                if (data.success) {
                    setVerificationStatus("success");
                    setAppointmentDetails(data.data);
                } else {
                    setVerificationStatus("error");
                }
            },
            onError: () => {
                setVerificationStatus("error");
            },
        });

    useEffect(() => {
        if (!appointmentId) {
            setVerificationStatus("error");
            return;
        }

        if (paymentMethod === "stripe" && sessionId) {
            verifyStripe({ appointmentId, sessionId });
        } else if (paymentMethod === "paypal" && token) {
            verifyPaypal({ appointmentId, orderId: token });
        } else {
            setVerificationStatus("error");
        }
    }, [appointmentId, sessionId, token, paymentMethod]);

    if (verificationStatus === "loading" || verifyingStripe || verifyingPaypal) {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <Card className="max-w-md w-full">
                    <CardBody className="text-center py-12 space-y-6">
                        <Spinner size="lg" color="danger" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Verifying Payment
                            </h2>
                            <p className="text-gray-600">
                                Please wait while we verify your payment...
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    if (verificationStatus === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center py-8 px-4">
                <Card className="max-w-md w-full">
                    <CardBody className="text-center py-12 space-y-6">
                        <div className="bg-red-100 p-6 rounded-full inline-block">
                            <XCircle className="h-16 w-16 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Payment Verification Failed
                            </h2>
                            <p className="text-gray-600">
                                We couldn't verify your payment. Please contact support or try
                                again.
                            </p>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Button
                                color="danger"
                                variant="bordered"
                                onPress={() => router.push("/appointment")}
                            >
                                Try Again
                            </Button>
                            <Button color="danger" onPress={() => router.push("/")}>
                                Go to Home
                            </Button>
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
                        {/* Success Icon */}
                        <div className="bg-green-100 p-6 rounded-full inline-block">
                            <CheckCircle className="h-16 w-16 text-green-600" />
                        </div>

                        {/* Success Message */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Payment Successful!
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Your appointment has been confirmed and payment received.
                            </p>
                        </div>

                        {/* Appointment Details */}
                        {appointmentDetails && (
                            <div className="mt-8">
                                <Card className="bg-gray-50 border border-gray-200 max-w-2xl mx-auto">
                                    <CardBody className="p-6 text-left">
                                        <h3 className="text-xl font-semibold mb-4 text-gray-900">
                                            Appointment Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <Calendar className="h-5 w-5 text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Date</p>
                                                    <p className="text-gray-900">
                                                        {new Date(
                                                            appointmentDetails.schedule?.date
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Clock className="h-5 w-5 text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Time</p>
                                                    <p className="text-gray-900">
                                                        {appointmentDetails.schedule?.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Mail className="h-5 w-5 text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Email</p>
                                                    <p className="text-gray-900">
                                                        {appointmentDetails.user?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone className="h-5 w-5 text-red-600 mt-1" />
                                                <div>
                                                    <p className="font-medium text-gray-700">Phone</p>
                                                    <p className="text-gray-900">
                                                        {appointmentDetails.user?.phoneNumber}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Amount */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">
                                                    Amount Paid
                                                </span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    ${appointmentDetails.payment?.amount?.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        )}

                        {/* What's Next */}
                        <Card className="bg-blue-50 border border-blue-200 max-w-md mx-auto mt-6">
                            <CardBody className="p-6 text-left">
                                <h3 className="font-semibold mb-3 text-gray-900">
                                    What's Next?
                                </h3>
                                <ul className="text-sm space-y-2 text-gray-700">
                                    <li>• You'll receive a confirmation email within 5 minutes</li>
                                    <li>• We'll call you 24 hours before your appointment</li>
                                    <li>• Bring your vehicle and any relevant documentation</li>
                                    <li>• Our team will be ready to serve you!</li>
                                </ul>
                            </CardBody>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-4 justify-center pt-6">
                            <Button
                                color="danger"
                                variant="bordered"
                                startContent={<Home className="h-4 w-4" />}
                                onPress={() => router.push("/")}
                            >
                                Back to Home
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => router.push("/appointment")}
                            >
                                Book Another Appointment
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
