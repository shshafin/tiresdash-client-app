import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createService, deleteService, getServices, getSingleService, updateService } from "../services/service";


export const useCreateService = ({ onSuccess }: any) => {
  return useMutation<any, Error, any>({
    mutationKey: ["CREATE_SERVICE"],
    mutationFn: async (serviceData) => await createService(serviceData),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useUpdateService = ({ onSuccess, id }: any = {}) => {
  return useMutation<any, Error, any>({
    mutationKey: ["UPDATE_SERVICE", id],
    mutationFn: async (serviceData) => {
      return await updateService(id, serviceData);
    },
    onError: (error) => toast.error(error.message),
    onSuccess,
  });
};

export const useDeleteService = ({ onSuccess, id }: any = {}) => {
  return useMutation<any, Error, void>({
    mutationKey: ["DELETE_SERVICE", id],
    mutationFn: async () => await deleteService(id),
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess,
  });
};

export const useGetServices = (params: any) => {
  return useQuery({
    queryKey: ["GET_SERVICES", params],
    queryFn: async () => await getServices(params),
  });
};

export const useGetSingleService = (id: string) => {
  return useQuery({
    queryKey: ["GET_SINGLE_SERVICE", id],
    queryFn: async () => await getSingleService(id),
    enabled: !!id, // Only run query when id exists
  });
};
