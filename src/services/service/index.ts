"use server";

import { axiosInstance } from "@/src/lib/AxiosInstance";

export const createService = async (serviceData: any): Promise<any> => {
  try {
    const { data } = await axiosInstance.post("/services/create", serviceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create service");
  }
};

export const updateService = async (
  id: string,
  serviceData: any
): Promise<any> => {
  try {
    const { data } = await axiosInstance.patch(`/services/${id}`, serviceData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update service");
  }
};

export const deleteService = async (id: string): Promise<any> => {
  try {
    const { data } = await axiosInstance.delete(`/services/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete service");
  }
};

export const getServices = async (params: any) => {
  try {
    const { data } = await axiosInstance.get("/services", { params });
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSingleService = async (serviceId: any) => {
  try {
    const { data } = await axiosInstance.get(`/services/${serviceId}`);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
