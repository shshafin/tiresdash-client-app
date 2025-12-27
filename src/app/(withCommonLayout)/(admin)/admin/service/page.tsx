"use client";

import FXInput from "@/src/components/form/FXInput";
import {
  useCreateService,
  useDeleteService,
  useGetServices,
  useUpdateService,
} from "@/src/hooks/service.hook";
import { IService } from "@/src/types";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { DataEmpty, DataError, DataLoading } from "../_components/DataFetchingStates";
import ServicesTable from "./_component/ServicesTable";


export default function AdminServicePage() {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onOpenChange: onEditOpenChange,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
    onClose: onDeleteClose,
  } = useDisclosure();

  const methods = useForm();
  const { handleSubmit } = methods;
  const [selectedService, setSelectedService] = useState<IService | null>(null);

  const { mutate: handleCreateService, isPending: createServicePending } =
    useCreateService({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_SERVICES"] });
        toast.success("Service created successfully");
        methods.reset();
        onClose();
      },
    });

  const { mutate: handleUpdateService, isPending: updateServicePending } =
    useUpdateService({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_SERVICES"] });
        toast.success("Service updated successfully");
        methods.reset();
        setSelectedService(null);
        onEditClose();
      },
      id: selectedService?._id,
    });

  const { mutate: handleDeleteService, isPending: deleteServicePending } =
    useDeleteService({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_SERVICES"] });
        toast.success("Service deleted successfully");
        setSelectedService(null);
        onDeleteClose();
      },
      id: selectedService?._id,
    });

  const { data: services, isLoading, isError } = useGetServices({}) as any;

  console.log(services);

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  // Compute paginated data
  const paginated: {
    data: any[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  } = (() => {
    if (!services?.data)
      return {
        data: [],
        meta: { page: 1, limit: pageSize, total: 0, totalPages: 1 },
      };
    const total = services.data.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(Math.max(1, currentPage), totalPages);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = services.data.slice(start, end);
    return { data, meta: { page, limit: pageSize, total, totalPages } };
  })();

  // Handle form submission for create
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const serviceData = {
      serviceName: data.serviceName,
      serviceTitle: data.serviceTitle,
      servicePrice: Number(data.servicePrice),
    };

    handleCreateService(serviceData);
  };

  // Handle form submission for edit
  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const serviceData = {
      serviceName: data.serviceName,
      serviceTitle: data.serviceTitle,
      servicePrice: Number(data.servicePrice),
    };

    handleUpdateService(serviceData);
  };

  return (
    <div className="p-6">
      {/* Header section with title and button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-md md:text-3xl font-semibold text-gray-900 dark:text-white">
          Service Management
        </h1>
        <Button
          color="primary"
          className="px-7 py-2 rounded-full text-sm font-medium transition-all transform bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          onPress={onOpen}
        >
          + Add Service
        </Button>
      </div>

      {/* Error handling */}
      {isLoading && <DataLoading />}
      {isError && <DataError />}
      {services?.data?.length === 0 && <DataEmpty />}

      {/* Service table */}
      {!isLoading && services?.data?.length > 0 && (
        <>
          <div className="w-full overflow-x-auto">
            <ServicesTable
              services={paginated}
              onEditOpen={onEditOpen}
              onDeleteOpen={onDeleteOpen}
              setSelectedService={setSelectedService}
            />
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-default-500">
              Showing {paginated.data.length} of {services.data.length} services
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded border"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={paginated.meta.page <= 1}
              >
                Prev
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: paginated.meta.totalPages }).map(
                  (_, idx) => {
                    const page = idx + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          page === paginated.meta.page
                            ? "bg-default-800 text-white"
                            : "border"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}
              </div>

              <button
                className="px-3 py-1 rounded border"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(paginated.meta.totalPages, p + 1)
                  )
                }
                disabled={paginated.meta.page >= paginated.meta.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Service Modal */}
      <AddServiceModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        methods={methods}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        createServicePending={createServicePending}
      />

      {/* Edit Service Modal */}
      <EditServiceModal
        isOpen={isEditOpen}
        onOpenChange={onEditOpenChange}
        methods={methods}
        handleSubmit={handleSubmit}
        onSubmit={onEditSubmit}
        updateServicePending={updateServicePending}
        defaultValues={selectedService}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal
        isOpen={isDeleteOpen}
        onOpenChange={onDeleteOpenChange}
        handleDeleteService={handleDeleteService}
        deleteServicePending={deleteServicePending}
      />
    </div>
  );
}

const AddServiceModal = ({
  isOpen,
  onOpenChange,
  methods,
  handleSubmit,
  onSubmit,
  createServicePending,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add Service
            </ModalHeader>
            <ModalBody className="mb-5">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="max-w-xl mx-auto space-y-6"
                >
                  <div className="flex flex-wrap gap-4 py-2">
                    {/* Service Name & Service Title Inputs */}
                    <div className="flex flex-wrap gap-2 w-full">
                      <div className="flex-1 min-w-[150px]">
                        <FXInput
                          label="Service Name"
                          name="serviceName"
                          required
                        />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <FXInput
                          label="Service Title"
                          name="serviceTitle"
                          required
                        />
                      </div>
                    </div>

                    {/* Service Price Input */}
                    <div className="w-full">
                      <FXInput
                        label="Service Price ($)"
                        name="servicePrice"
                        type="number"
                        required
                      />
                    </div>
                  </div>

                  <Divider className="my-6" />

                  <Button
                    color="primary"
                    type="submit"
                    className="w-full rounded"
                    disabled={createServicePending}
                  >
                    {createServicePending ? "Creating..." : "Create Service"}
                  </Button>
                </form>
              </FormProvider>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const EditServiceModal = ({
  defaultValues,
  isOpen,
  onOpenChange,
  methods,
  handleSubmit,
  onSubmit,
  updateServicePending,
}: any) => {
  if (!defaultValues) return null;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => {
        onOpenChange();
        methods.reset();
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Service
            </ModalHeader>
            <ModalBody className="mb-5">
              <FormProvider {...methods}>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="max-w-xl mx-auto space-y-6"
                >
                  <div className="flex flex-wrap gap-4 py-2">
                    {/* Service Name & Service Title Inputs */}
                    <div className="flex flex-wrap gap-2 w-full">
                      <div className="flex-1 min-w-[150px]">
                        <FXInput
                          label="Service Name"
                          name="serviceName"
                          defaultValue={defaultValues.serviceName}
                          required
                        />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <FXInput
                          label="Service Title"
                          name="serviceTitle"
                          defaultValue={defaultValues.serviceTitle}
                          required
                        />
                      </div>
                    </div>

                    {/* Service Price Input */}
                    <div className="w-full">
                      <FXInput
                        label="Service Price ($)"
                        name="servicePrice"
                        type="number"
                        defaultValue={defaultValues.servicePrice}
                        required
                      />
                    </div>
                  </div>

                  <Divider className="my-6" />

                  <Button
                    color="primary"
                    type="submit"
                    className="w-full rounded"
                    disabled={updateServicePending}
                  >
                    {updateServicePending ? "Updating..." : "Update Service"}
                  </Button>
                </form>
              </FormProvider>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const DeleteServiceModal = ({
  isOpen,
  onOpenChange,
  handleDeleteService,
  deleteServicePending,
}: any) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Confirm Delete
            </ModalHeader>

            <ModalBody>
              <p className="text-sm text-red-500">
                ⚠️ Are you sure you want to delete this service? This action
                cannot be undone.
              </p>
            </ModalBody>

            <ModalFooter className="flex justify-end gap-2">
              <Button
                variant="bordered"
                className="rounded"
                onPress={onOpenChange}
              >
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteService}
                disabled={deleteServicePending}
                className="rounded"
              >
                {deleteServicePending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
