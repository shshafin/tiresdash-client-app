"use server";

import { axiosInstance } from "@/src/lib/AxiosInstance";

export const createAppointment = async (appointmentData: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/appointments/create",
      appointmentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create appointment");
  }
};

export const updateAppointment = async (
  id: string,
  appointmentData: any
): Promise<any> => {
  try {
    const { data } = await axiosInstance.patch(
      `/appointments/${id}`,
      appointmentData,
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update appointment");
  }
};

export const deleteAppointment = async (id: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(`/appointments/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete appointment");
  }
};

export const getAppointments = async (params: any) => {
  try {
    const { data } = await axiosInstance.get("/appointments", { params });

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSingleAppointment = async (appointmentId: any) => {
  try {
    const { data } = await axiosInstance.get(`/appointments/${appointmentId}`);

    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const verifyStripePayment = async (
  appointmentId: string,
  sessionId: string
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/appointments/verify-stripe-payment",
      { appointmentId, sessionId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.message || "Failed to verify Stripe payment");
  }
};

export const verifyPaypalPayment = async (
  appointmentId: string,
  orderId: string
): Promise<any> => {
  try {
    const { data } = await axiosInstance.post(
      "/appointments/verify-paypal-payment",
      { appointmentId, orderId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.response?.data?.message || "Failed to verify PayPal payment");
  }
};
