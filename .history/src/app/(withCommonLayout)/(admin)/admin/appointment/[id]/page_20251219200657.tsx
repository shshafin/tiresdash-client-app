"use client";

import { useGetSingleAppointment } from "@/src/hooks/appointment.hook";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Car,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Settings,
  Shield,
  Zap,
  Timer,
  Users,
  FileText,
  Star,
  Award,
  CreditCard,
} from "lucide-react";

const SingleAppointmentPage = () => {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const {
    data: appointmentData,
    isLoading,
    isError,
    refetch,
  } = useGetSingleAppointment(appointmentId);

  const appointment: any = appointmentData?.data;
  console.log(a)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-lg font-medium text-default-600">
            Loading appointment details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <AlertCircle className="w-20 h-20 text-danger mx-auto" />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Appointment Not Found</h2>
            <p className="text-default-500">
              We couldn't load the appointment details. Please try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = appointment.user || {};
  const services = Array.isArray(appointment.services)
    ? appointment.services
    : [];
  const schedule = appointment.schedule || {};
  const payment = appointment.payment || {};

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "payment_pending":
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <div className="bg-content1/80 backdrop-blur-xl border-b border-divider sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-default-100 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black">Appointment Details</h1>
                <p className="text-xs font-bold text-default-400 uppercase tracking-widest">
                  ID: {appointment._id || "N/A"}
                </p>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-xl text-sm font-black border uppercase tracking-tight ${getStatusColor(appointment.status)}`}>
              {appointment.status?.replace("_", " ") || "UNKNOWN"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-content1 rounded-3xl border border-divider p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl text-red-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black">Schedule Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-default-50 rounded-2xl border border-divider">
                  <p className="text-[10px] font-black text-default-400 uppercase tracking-widest mb-1">
                    Service Date
                  </p>
                  <p className="text-lg font-bold">
                    {schedule.date
                      ? new Date(schedule.date).toDateString()
                      : "N/A"}
                  </p>
                </div>
                <div className="p-5 bg-default-50 rounded-2xl border border-divider">
                  <p className="text-[10px] font-black text-default-400 uppercase tracking-widest mb-1">
                    Time Slot
                  </p>
                  <p className="text-lg font-bold">{schedule.time || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-content1 rounded-3xl border border-divider p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                  <Wrench className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black">Requested Services</h2>
              </div>

              <div className="space-y-4">
                {services.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {services.map((service: any) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-5 bg-content2 rounded-2xl border border-divider">
                        <div className="flex items-center gap-4">
                          <div className="bg-background p-2 rounded-xl border border-divider">
                            <Settings className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">
                              {service?.serviceName || "Unknown Service"}
                            </p>
                            <p className="text-xs text-default-500">
                              {service?.serviceTitle || ""}
                            </p>
                          </div>
                        </div>
                        {/* FIX: Safe checking for servicePrice inside map */}
                        <p className="font-black text-red-600">
                          ${(service?.servicePrice || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-default-50 rounded-2xl border border-dashed border-divider">
                    <p className="text-default-400">No services found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-content1 rounded-3xl border border-divider p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-primary">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black">Payment Summary</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-default-50 rounded-2xl">
                  <span className="text-sm font-bold text-default-500">
                    Method
                  </span>
                  <span className="font-black uppercase text-xs">
                    {payment.paymentMethod || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-danger-50 dark:bg-danger-900/10 rounded-2xl">
                  <span className="text-sm font-bold text-danger-600">
                    Total Paid
                  </span>
                  {/* FIX: Safe checking for payment amount */}
                  <span className="text-2xl font-black text-danger-600">
                    ${(payment?.amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-content1 rounded-3xl border border-divider p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-black">Customer Detail</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-default-100 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-default-100 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold truncate">
                    {user.email || "No Email"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-default-100 rounded-lg">
                    <Phone className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold">
                    {user.phoneNumber || "No Phone"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleAppointmentPage;
