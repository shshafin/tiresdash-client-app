"use client";

import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import FXInput from "@/src/components/form/FXInput";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { Divider } from "@heroui/divider";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useCreateWheel } from "@/src/hooks/wheel.hook";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetWheelWidths } from "@/src/hooks/wheelWidth.hook";
import { useGetWheelRatios } from "@/src/hooks/wheelRatio.hook";
import { useGetWheelDiameters } from "@/src/hooks/wheelDiameter.hook";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";

interface AddonService {
  name?: string;
  price?: number;
}

export default function AdminWheelPage() {
  const queryClient = useQueryClient();
  const { onClose } = useDisclosure();

  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<AddonService[]>([
    { name: "", price: 0 },
  ]);

  const { mutate: handleCreateWheel, isPending: createWheelPending } =
    useCreateWheel({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_WHEELS"] });
        toast.success("Wheel created successfully");
        methods.reset();
        setAddonServices([{ name: "", price: 0 }]);
        setImageFiles([]);
        setImagePreviews([]);
        onClose();
      },
    });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // Filter out empty addon services
    const validAddonServices = addonServices.filter(
      (service) => service.name?.trim() !== "" && (service.price || 0) > 0
    );

    const filteredAddonServices =
      validAddonServices.length > 0 ? validAddonServices : undefined;

    const wheelData = {
      ...data,
      year: data.year,
      make: data.make,
      model: data.model,
      trim: data.trim,
      tireSize: data.tireSize,
      drivingType: data.drivingType,
      brand: data.brand,
      width: data.width,
      ratio: data.ratio,
      diameter: data.diameter,
      vehicleType: data.vehicleType,
      widthType: data.widthType,
      category: data.category,
      installationService: data.installationService || undefined,
      installationPrice: data.installationPrice
        ? Number(data.installationPrice)
        : undefined,
      addonServices: filteredAddonServices,
      rimWidth: data.rimWidth ? Number(data.rimWidth) : 0,
      offset: data.offset ? Number(data.offset) : 0,
      hubBoreSize: data.hubBoreSize ? Number(data.hubBoreSize) : 0,
      numberOFBolts: data.numberOFBolts ? Number(data.numberOFBolts) : 0,
      loadCapacity: data.loadCapacity ? Number(data.loadCapacity) : 0,
      loadRating: data.loadRating ? Number(data.loadRating) : 0,
      price: data.price ? Number(data.price) : 0,
      discountPrice: data.discountPrice
        ? Number(data.discountPrice)
        : undefined,
      twoSetDiscountPrice: data.twoSetDiscountPrice
        ? Number(data.twoSetDiscountPrice)
        : undefined,
      fourSetDiscountPrice: data.fourSetDiscountPrice
        ? Number(data.fourSetDiscountPrice)
        : undefined,
      stockQuantity: data.stockQuantity ? Number(data.stockQuantity) : 0,
    };

    formData.append("data", JSON.stringify(wheelData));

    imageFiles.forEach((image) => {
      formData.append("images", image);
    });

    handleCreateWheel(formData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImageFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newImageFiles]);

    newImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddonServiceChange = (
    index: number,
    field: keyof AddonService,
    value: string | number
  ) => {
    setAddonServices((prev) =>
      prev.map((service, i) =>
        i === index ? { ...service, [field]: value } : service
      )
    );
  };

  const addNewAddonService = () => {
    setAddonServices((prev) => [...prev, { name: "", price: 0 }]);
  };

  const removeAddonService = (index: number) => {
    if (addonServices.length > 1) {
      setAddonServices((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-full">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-7xl mx-auto space-y-10 p-4"
            >
              {/* General Info Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  General Information
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Name"
                    name="name"
                    rules={{ required: "Name is required" }}
                  />
                  <FXInput label="Description" name="description" />
                  <FXInput label="Product Line" name="productLine" />
                  <FXInput label="Unit Name" name="unitName" />
                  <FXInput label="Condition Info" name="conditionInfo" />
                </div>
              </div>

              {/* Installation Service Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Installation Service
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Installation Service Name"
                    name="installationService"
                  />
                  <FXInput
                    label="Installation Price ($)"
                    name="installationPrice"
                    type="number"
                  />
                </div>
              </div>

              {/* Addon Services Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-default-900">
                    Addon Services
                  </h2>
                  <Button
                    type="button"
                    onClick={addNewAddonService}
                    className="bg-blue-600 text-white"
                    startContent={<Plus size={16} />}
                  >
                    Add Service
                  </Button>
                </div>
                <Divider />
                <div className="space-y-4">
                  {addonServices.map((service, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-default-600 font-medium">
                          Service {index + 1}
                        </span>
                        {addonServices.length > 1 && (
                          <Button
                            type="button"
                            onClick={() => removeAddonService(index)}
                            size="sm"
                            variant="flat"
                            color="danger"
                            className="min-w-8 h-8"
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={service.name || ""}
                          onChange={(e) =>
                            handleAddonServiceChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Service Name"
                          className="w-full px-3 py-2 border-2 border-[#71717ab3] bg-default-50 rounded-lg"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={service.price || 0}
                          onChange={(e) =>
                            handleAddonServiceChange(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder="Price ($)"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border-2 border-[#71717ab3] bg-default-50 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wheel Specification */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Wheel Specifications
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MakeSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <YearSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <ModelSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <TrimSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <CategorySelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <DrivingTypeSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <TyreSizeSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <BrandSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <VehicleSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <FXInput label="Construction Type" name="constructionType" />
                  <FXInput label="Warranty" name="warranty" />
                  <FXInput label="Wheel Type" name="wheelType" />
                </div>
              </div>

              {/* Wheel Dimensions */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Wheel Dimensions
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <WidthSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <RatioSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <DiameterSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <WidthTypeSelectForWheel
                    defaultValue=""
                    register={methods.register}
                  />
                  <FXInput label="Rim Width" name="rimWidth" type="number" />
                  <FXInput label="Offset" name="offset" type="number" />
                  <FXInput
                    label="Hub Bore Size"
                    name="hubBoreSize"
                    type="number"
                  />
                  <FXInput
                    label="Load Capacity"
                    name="loadCapacity"
                    type="number"
                  />
                  <FXInput
                    label="Load Rating"
                    name="loadRating"
                    type="number"
                  />
                </div>
              </div>

              {/* Wheel Details */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Wheel Details
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput label="Gross Weight" name="grossWeight" />
                  <FXInput label="GTIN" name="GTIN" />
                  <FXInput label="ATV Offset" name="ATVOffset" />
                  <FXInput label="Bolts Quantity" name="BoltsQuantity" />
                  <FXInput label="Wheel Color" name="wheelColor" />
                  <FXInput label="Hub Bore" name="hubBore" />
                  <FXInput label="Material Type" name="materialType" />
                  <FXInput label="Wheel Size" name="wheelSize" />
                  <FXInput label="Wheel Accent" name="wheelAccent" />
                  <FXInput label="Wheel Pieces" name="wheelPieces" />
                  <FXInput label="Bolt Pattern" name="boltPattern" />
                  <FXInput
                    label="Number of Bolts"
                    name="numberOFBolts"
                    type="number"
                  />
                  <FXInput label="Finish" name="finish" />
                </div>
              </div>

              {/* Pricing and Stock */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Pricing & Stock
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Price"
                    name="price"
                    type="number"
                    rules={{ required: "Price is required" }}
                  />
                  <FXInput
                    label="Discount Price"
                    name="discountPrice"
                    type="number"
                  />
                  <FXInput
                    label="Two Set Discount Price"
                    name="twoSetDiscountPrice"
                    type="number"
                  />
                  <FXInput
                    label="Four Set Discount Price"
                    name="fourSetDiscountPrice"
                    type="number"
                  />
                  <FXInput
                    label="Stock Quantity"
                    name="stockQuantity"
                    type="number"
                    rules={{ required: "Stock Quantity is required" }}
                  />
                </div>
              </div>

              {/* Upload Images */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Upload Images
                </h2>
                <Divider />
                <div className="space-y-4">
                  <label
                    htmlFor="images"
                    className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-gray-100"
                  >
                    <span className="text-md font-medium">Upload Images</span>
                    <UploadCloud className="size-6" />
                  </label>
                  <input
                    multiple
                    className="hidden"
                    id="images"
                    name="images"
                    type="file"
                    onChange={handleImageChange}
                  />
                  {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-4">
                      {imagePreviews.map(
                        (imageDataUrl: string, index: number) => (
                          <div
                            key={index}
                            className="relative size-32 rounded-xl border-2 border-dashed border-gray-300 p-2"
                          >
                            <img
                              alt={`Preview ${index}`}
                              className="h-full w-full object-cover rounded-md"
                              src={imageDataUrl}
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-10">
                <Button
                  type="submit"
                  className="w-full rounded bg-rose-600"
                  disabled={createWheelPending}
                >
                  {createWheelPending ? "Creating..." : "Create Wheel"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

// All select components remain the same as before...
// [Keep all existing select components exactly as they were]

const MakeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: makes, isLoading, isError } = useGetMakes({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("make", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Make</option>
        {isLoading && <option value="">Loading Makes...</option>}
        {isError && <option value="">Failed to load Makes</option>}
        {makes?.data?.length === 0 && <option value="">No Makes found</option>}
        {makes?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.make}
          </option>
        ))}
      </select>
    </div>
  );
};
const DrivingTypeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: drivingType, isLoading, isError } = useGetDrivingTypes();
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("drivingType", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select driving types</option>
        {isLoading && <option value="">Loading driving types...</option>}
        {isError && <option value="">Failed to load driving types</option>}
        {drivingType?.data?.length === 0 && (
          <option value="">No driving types found</option>
        )}
        {drivingType?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.title}
          </option>
        ))}
      </select>
    </div>
  );
};
const CategorySelectForWheel = ({ defaultValue, register }: any) => {
  const { data: category, isLoading, isError } = useGetCategories(undefined);
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("category", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Category</option>
        {isLoading && <option value="">Loading Categories...</option>}
        {isError && <option value="">Failed to load Categories</option>}
        {category?.data?.length === 0 && (
          <option value="">No Categories found</option>
        )}
        {category?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const YearSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: year, isLoading, isError } = useGetYears({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("year", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Year</option>
        {isLoading && <option value="">Loading Years...</option>}
        {isError && <option value="">Failed to load Years</option>}
        {year?.data?.length === 0 && <option value="">No Years found</option>}
        {year?.data?.map((y: any) => (
          <option key={y?._id} value={y?._id}>
            {y?.year}
          </option>
        ))}
      </select>
    </div>
  );
};

const BrandSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: brand, isLoading, isError } = useGetBrands({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("brand", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Brand</option>
        {isLoading && <option value="">Loading Brands...</option>}
        {isError && <option value="">Failed to load Brands</option>}
        {brand?.data?.length === 0 && <option value="">No Brands found</option>}
        {brand?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};
const ModelSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: model, isLoading, isError } = useGetModels({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("model", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Model</option>
        {isLoading && <option value="">Loading Models...</option>}
        {isError && <option value="">Failed to load Models</option>}
        {model?.data?.length === 0 && <option value="">No Models found</option>}
        {model?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.model}
          </option>
        ))}
      </select>
    </div>
  );
};

const TyreSizeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: tireSize, isLoading, isError } = useGetTyreSizes({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("tireSize", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Tyre Size</option>
        {isLoading && <option value="">Loading Tyre Sizes...</option>}
        {isError && <option value="">Failed to load Tyre Sizes</option>}
        {tireSize?.data?.length === 0 && (
          <option value="">No Tyre Sizes found</option>
        )}
        {tireSize?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.tireSize}
          </option>
        ))}
      </select>
    </div>
  );
};

const TrimSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: trim, isLoading, isError } = useGetTrims({});

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("trim", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Trim</option>
        {isLoading && <option value="">Loading Trims...</option>}
        {isError && <option value="">Failed to load Trims</option>}
        {trim?.data?.length === 0 && <option value="">No Trims found</option>}
        {trim?.data?.map((m: any) => (
          <option key={m?._id} value={m?._id}>
            {m?.trim}
          </option>
        ))}
      </select>
    </div>
  );
};

const VehicleSelectForWheel = ({ defaultValue, register }: any) => {
  const {
    data: vehicleType,
    isLoading,
    isError,
  } = useGetVehicleTypes({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("vehicleType", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Vehicle Type</option>
        {isLoading && <option value="">Loading Types...</option>}
        {isError && <option value="">Failed to load Types</option>}
        {vehicleType?.data?.length === 0 && (
          <option value="">No Types found</option>
        )}
        {vehicleType?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.vehicleType}
          </option>
        ))}
      </select>
    </div>
  );
};

const WidthSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: width, isLoading, isError } = useGetWheelWidths({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("width", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Width</option>
        {isLoading && <option value="">Loading Widths...</option>}
        {isError && <option value="">Failed to load Widths</option>}
        {width?.data?.length === 0 && <option value="">No Widths found</option>}
        {width?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.width}
          </option>
        ))}
      </select>
    </div>
  );
};
const RatioSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: ratio, isLoading, isError } = useGetWheelRatios({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("ratio", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Aspect Ratio</option>
        {isLoading && <option value="">Loading Ratios...</option>}
        {isError && <option value="">Failed to load Ratios</option>}
        {ratio?.data?.length === 0 && <option value="">No Ratios found</option>}
        {ratio?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.ratio}
          </option>
        ))}
      </select>
    </div>
  );
};
const DiameterSelectForWheel = ({ defaultValue, register }: any) => {
  const {
    data: diameter,
    isLoading,
    isError,
  } = useGetWheelDiameters({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("diameter", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Rim Diameter</option>
        {isLoading && <option value="">Loading Diameters...</option>}
        {isError && <option value="">Failed to load Diameters</option>}
        {diameter?.data?.length === 0 && (
          <option value="">No Diameters found</option>
        )}
        {diameter?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.diameter}
          </option>
        ))}
      </select>
    </div>
  );
};
const WidthTypeSelectForWheel = ({ defaultValue, register }: any) => {
  const {
    data: widthType,
    isLoading,
    isError,
  } = useGetWheelWidthTypes({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("widthType", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Width Type</option>
        {isLoading && <option value="">Loading Width Types...</option>}
        {isError && <option value="">Failed to load Width Types</option>}
        {widthType?.data?.length === 0 && (
          <option value="">No Width Types found</option>
        )}
        {widthType?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.widthType}
          </option>
        ))}
      </select>
    </div>
  );
};
