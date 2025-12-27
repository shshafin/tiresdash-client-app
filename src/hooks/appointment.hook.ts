import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAppointment,
  deleteAppointment,
  getAppointments,
  getSingleAppointment,
  updateAppointment,
  verifyStripePayment,
  verifyPaypalPayment,
} from "../services/Appointment";

export const useCreateAppointment = ({ onSuccess }: any) => {
  return useMutation<any, Error, any>({
    mutationKey: ["CREATE_APPOINTMENT"],
    mutationFn: async (appointmentData) =>
      await createAppointment(appointmentData),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useUpdateAppointment = ({ onSuccess }: any = {}) => {
  return useMutation<any, Error, { id: string; data: any }>({
    mutationKey: ["UPDATE_APPOINTMENT"],
    mutationFn: async ({ id, data }) => {
      return await updateAppointment(id, data);
    },
    onError: (error) => toast.error(error.message),
    onSuccess,
  });
};

export const useDeleteAppointment = ({ onSuccess }: any = {}) => {
  return useMutation<any, Error, string>({
    mutationKey: ["DELETE_APPOINTMENT"],
    mutationFn: async (id) => await deleteAppointment(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useGetAppointments = (params: any) => {
  return useQuery({
    queryKey: ["GET_APPOINTMENT"],
    queryFn: async () => await getAppointments(params),
  });
};

export const useGetSingleAppointment = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_APPOINTMENT", id],
    queryFn: async () => await getSingleAppointment(id),
    enabled: !!id, // Only run query when id exists
  });
};

export const useVerifyStripePayment = ({ onSuccess, onError }: any = {}) => {
  return useMutation<any, Error, { appointmentId: string; sessionId: string }>({
    mutationKey: ["VERIFY_STRIPE_PAYMENT"],
    mutationFn: async ({ appointmentId, sessionId }) => {
      return await verifyStripePayment(appointmentId, sessionId);
    },
    onError: (error) => {
      toast.error(error.message || "Payment verification failed");
      onError?.(error);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Payment verified successfully");
      } else {
        toast.error(data.message || "Payment verification failed");
      }
      onSuccess?.(data);
    },
  });
};

export const useVerifyPaypalPayment = ({ onSuccess, onError }: any = {}) => {
  return useMutation<any, Error, { appointmentId: string; orderId: string }>({
    mutationKey: ["VERIFY_PAYPAL_PAYMENT"],
    mutationFn: async ({ appointmentId, orderId }) => {
      return await verifyPaypalPayment(appointmentId, orderId);
    },
    onError: (error) => {
      toast.error(error.message || "Payment verification failed");
      onError?.(error);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Payment verified successfully");
      } else {
        toast.error(data.message || "Payment verification failed");
      }
      onSuccess?.(data);
    },
  });
};
