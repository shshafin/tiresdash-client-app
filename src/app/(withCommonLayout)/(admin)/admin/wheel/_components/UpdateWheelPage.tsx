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
import { ChangeEvent, useEffect, useState } from "react";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { Divider } from "@heroui/divider";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import {
  useCreateWheel,
  useGetSingleWheel,
  useUpdateWheel,
} from "@/src/hooks/wheel.hook";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";
import { DataError, DataLoading } from "../../_components/DataFetchingStates";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";
import { useGetWheelDiameters } from "@/src/hooks/wheelDiameter.hook";
import { useGetWheelRatios } from "@/src/hooks/wheelRatio.hook";
import { useGetWheelWidths } from "@/src/hooks/wheelWidth.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { envConfig } from "@/src/config/envConfig";

interface AddonService {
  name?: string;
  price?: number;
}

export default function UpdateWheelPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = useQueryClient();
  const id = params.id;
  const { data: dataW, isPending, isError, refetch } = useGetSingleWheel(id);
  const selectedWheel = dataW?.data;
  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<AddonService[]>([
    { name: "", price: 0 },
  ]);

  const { mutate: handleUpdateWheel, isPending: createWheelPending } =
    useUpdateWheel({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_WHEELS"] });
        toast.success("Wheel updated successfully");
      },
      id,
    });

  // Initialize addon services from selectedWheel
  useEffect(() => {
    if (selectedWheel?.addonServices?.length) {
      setAddonServices(selectedWheel.addonServices);
    }
  }, [selectedWheel]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // Filter out empty addon services
    const validAddonServices = addonServices.filter(
      (service) => service.name?.trim() !== "" && (service.price || 0) > 0
    );

    const filteredAddonServices =
      validAddonServices.length > 0 ? validAddonServices : undefined;

    const wheelData = {
      ...data,
      year: data.year || selectedWheel?.year?._id,
      make: data.make || selectedWheel?.make?._id,
      model: data.model || selectedWheel?.model?._id,
      trim: data.trim || selectedWheel?.trim?._id,
      tireSize: data.tireSize || selectedWheel?.tireSize?._id,
      category: data.category || selectedWheel?.category?._id,
      drivingType: data.drivingType || selectedWheel?.drivingType?._id,
      brand: data.brand || selectedWheel?.brand?._id,
      vehicleType: data.vehicleType || selectedWheel?.vehicleType?._id,
      ratio: data.ratio || selectedWheel?.ratio?._id,
      width: data.width || selectedWheel?.width?._id,
      diameter: data.diameter || selectedWheel?.diameter?._id,
      widthType: data.widthType || selectedWheel?.widthType?._id,
      installationService:
        data.installationService ||
        selectedWheel?.installationService ||
        undefined,
      installationPrice: data.installationPrice
        ? Number(data.installationPrice)
        : selectedWheel?.installationPrice || undefined,
      addonServices: filteredAddonServices,
      rimWidth: data.rimWidth
        ? Number(data.rimWidth)
        : selectedWheel?.rimWidth || 0,
      offset: data.offset ? Number(data.offset) : selectedWheel?.offset || 0,
      hubBoreSize: data.hubBoreSize
        ? Number(data.hubBoreSize)
        : selectedWheel?.hubBoreSize || 0,
      numberOFBolts: data.numberOFBolts
        ? Number(data.numberOFBolts)
        : selectedWheel?.numberOFBolts || 0,
      loadCapacity: data.loadCapacity
        ? Number(data.loadCapacity)
        : selectedWheel?.loadCapacity || 0,
      loadRating: data.loadRating
        ? Number(data.loadRating)
        : selectedWheel?.loadRating || 0,
      price: data.price ? Number(data.price) : selectedWheel?.price || 0,
      discountPrice: data.discountPrice
        ? Number(data.discountPrice)
        : selectedWheel?.discountPrice || undefined,
      twoSetDiscountPrice: data.twoSetDiscountPrice
        ? Number(data.twoSetDiscountPrice)
        : selectedWheel?.twoSetDiscountPrice || undefined,
      fourSetDiscountPrice: data.fourSetDiscountPrice
        ? Number(data.fourSetDiscountPrice)
        : selectedWheel?.fourSetDiscountPrice || undefined,
      stockQuantity: data.stockQuantity
        ? Number(data.stockQuantity)
        : selectedWheel?.stockQuantity || 0,
    };

    formData.append("data", JSON.stringify(wheelData));

    if (imageFiles.length > 0) {
      imageFiles.forEach((image) => {
        formData.append("images", image);
      });
    }

    handleUpdateWheel(formData);
  };

  useEffect(() => {
    if (selectedWheel?.images?.length) {
      const previews = selectedWheel.images.map((img: any) =>
        img.startsWith("/storage") ? `${envConfig.base_url}${img}` : img
      );
      setImagePreviews(previews);
    }
  }, [selectedWheel]);

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-full">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onEditSubmit)}
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
                    defaultValue={selectedWheel?.name}
                  />
                  <FXInput
                    label="Description"
                    name="description"
                    defaultValue={selectedWheel?.description}
                  />
                  <FXInput
                    label="Product Line"
                    name="productLine"
                    defaultValue={selectedWheel?.productLine?.[0]}
                  />
                  <FXInput
                    label="Unit Name"
                    name="unitName"
                    defaultValue={selectedWheel?.unitName}
                  />
                  <FXInput
                    label="Condition Info"
                    name="conditionInfo"
                    defaultValue={selectedWheel?.conditionInfo}
                  />
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
                    defaultValue={selectedWheel?.installationService}
                  />
                  <FXInput
                    label="Installation Price ($)"
                    name="installationPrice"
                    type="number"
                    defaultValue={selectedWheel?.installationPrice}
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
                    defaultValue={selectedWheel?.make}
                    register={methods.register}
                  />
                  <YearSelectForWheel
                    defaultValue={selectedWheel?.year}
                    register={methods.register}
                  />
                  <ModelSelectForWheel
                    defaultValue={selectedWheel?.model}
                    register={methods.register}
                  />
                  <TrimSelectForWheel
                    defaultValue={selectedWheel?.trim}
                    register={methods.register}
                  />
                  <CategorySelectForWheel
                    defaultValue={selectedWheel?.category}
                    register={methods.register}
                  />
                  <DrivingTypeSelectForWheel
                    defaultValue={selectedWheel?.drivingType}
                    register={methods.register}
                  />
                  <TyreSizeSelectForWheel
                    defaultValue={selectedWheel?.tireSize}
                    register={methods.register}
                  />
                  <BrandSelectForWheel
                    defaultValue={selectedWheel?.brand}
                    register={methods.register}
                  />
                  <VehicleSelectForWheel
                    defaultValue={selectedWheel?.vehicleType}
                    register={methods.register}
                  />
                  <FXInput
                    label="Construction Type"
                    name="constructionType"
                    defaultValue={selectedWheel?.constructionType}
                  />
                  <FXInput
                    label="Warranty"
                    name="warranty"
                    defaultValue={selectedWheel?.warranty}
                  />
                  <FXInput
                    label="Wheel Type"
                    name="wheelType"
                    defaultValue={selectedWheel?.wheelType}
                  />
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
                    defaultValue={selectedWheel?.width}
                    register={methods.register}
                  />
                  <RatioSelectForWheel
                    defaultValue={selectedWheel?.ratio}
                    register={methods.register}
                  />
                  <DiameterSelectForWheel
                    defaultValue={selectedWheel?.diameter}
                    register={methods.register}
                  />
                  <WidthTypeSelectForWheel
                    defaultValue={selectedWheel?.widthType}
                    register={methods.register}
                  />
                  <FXInput
                    label="Rim Width"
                    name="rimWidth"
                    type="number"
                    defaultValue={selectedWheel?.rimWidth}
                  />
                  <FXInput
                    label="Offset"
                    name="offset"
                    type="number"
                    defaultValue={selectedWheel?.offset}
                  />
                  <FXInput
                    label="Hub Bore Size"
                    name="hubBoreSize"
                    type="number"
                    defaultValue={selectedWheel?.hubBoreSize}
                  />
                  <FXInput
                    label="Load Capacity"
                    name="loadCapacity"
                    type="number"
                    defaultValue={selectedWheel?.loadCapacity}
                  />
                  <FXInput
                    label="Load Rating"
                    name="loadRating"
                    type="number"
                    defaultValue={selectedWheel?.loadRating}
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
                  <FXInput
                    label="Gross Weight"
                    name="grossWeight"
                    defaultValue={selectedWheel?.grossWeight}
                  />
                  <FXInput
                    label="GTIN"
                    name="GTIN"
                    defaultValue={selectedWheel?.GTIN}
                  />
                  <FXInput
                    label="ATV Offset"
                    name="ATVOffset"
                    defaultValue={selectedWheel?.ATVOffset}
                  />
                  <FXInput
                    label="Bolts Quantity"
                    name="BoltsQuantity"
                    defaultValue={selectedWheel?.BoltsQuantity}
                  />
                  <FXInput
                    label="Wheel Color"
                    name="wheelColor"
                    defaultValue={selectedWheel?.wheelColor}
                  />
                  <FXInput
                    label="Hub Bore"
                    name="hubBore"
                    defaultValue={selectedWheel?.hubBore}
                  />
                  <FXInput
                    label="Material Type"
                    name="materialType"
                    defaultValue={selectedWheel?.materialType}
                  />
                  <FXInput
                    label="Wheel Size"
                    name="wheelSize"
                    defaultValue={selectedWheel?.wheelSize}
                  />
                  <FXInput
                    label="Wheel Accent"
                    name="wheelAccent"
                    defaultValue={selectedWheel?.wheelAccent}
                  />
                  <FXInput
                    label="Wheel Pieces"
                    name="wheelPieces"
                    defaultValue={selectedWheel?.wheelPieces}
                  />
                  <FXInput
                    label="Bolt Pattern"
                    name="boltPattern"
                    defaultValue={selectedWheel?.boltPattern}
                  />
                  <FXInput
                    label="Number of Bolts"
                    name="numberOFBolts"
                    type="number"
                    defaultValue={selectedWheel?.numberOFBolts}
                  />
                  <FXInput
                    label="Finish"
                    name="finish"
                    defaultValue={selectedWheel?.finish}
                  />
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
                    defaultValue={selectedWheel?.price}
                  />
                  <FXInput
                    label="Discount Price"
                    name="discountPrice"
                    type="number"
                    defaultValue={selectedWheel?.discountPrice}
                  />
                  <FXInput
                    label="Two Set Discount Price"
                    name="twoSetDiscountPrice"
                    type="number"
                    defaultValue={selectedWheel?.twoSetDiscountPrice}
                  />
                  <FXInput
                    label="Four Set Discount Price"
                    name="fourSetDiscountPrice"
                    type="number"
                    defaultValue={selectedWheel?.fourSetDiscountPrice}
                  />
                  <FXInput
                    label="Stock Quantity"
                    name="stockQuantity"
                    type="number"
                    defaultValue={selectedWheel?.stockQuantity}
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
                            {/* Remove Button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              ✕
                            </button>
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
                  {createWheelPending ? "Updating..." : "Update Wheel"}
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
  const [selectedMake, setSelectedMake] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedMake(defaultValue._id);
    }
  }, [defaultValue]);
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("make")}
        value={selectedMake}
        onChange={(e) => setSelectedMake(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Make</option>
        {isLoading && <option value="">Loading Makes...</option>}
        {isError && <option value="">Failed to load Makes</option>}
        {makes?.data?.length === 0 && <option value="">No Makes found</option>}
        {makes?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.make}
          </option>
        ))}
      </select>
    </div>
  );
};
const DrivingTypeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: drivingType, isLoading, isError } = useGetDrivingTypes();
  const [selectedDrivingType, setSelectedDrivingType] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedDrivingType(defaultValue._id);
    }
  }, [defaultValue]);
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("drivingType")}
        value={selectedDrivingType}
        onChange={(e) => setSelectedDrivingType(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select driving types</option>
        {isLoading && <option value="">Loading driving types...</option>}
        {isError && <option value="">Failed to load driving types</option>}
        {drivingType?.data?.length === 0 && (
          <option value="">No driving types found</option>
        )}
        {drivingType?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.title}
          </option>
        ))}
      </select>
    </div>
  );
};
const CategorySelectForWheel = ({ defaultValue, register }: any) => {
  const { data: category, isLoading, isError } = useGetCategories(undefined);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedCategory(defaultValue._id);
    }
  }, [defaultValue]);
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("category")}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Category</option>
        {isLoading && <option value="">Loading Categories...</option>}
        {isError && <option value="">Failed to load Categories</option>}
        {category?.data?.length === 0 && (
          <option value="">No Categories found</option>
        )}
        {category?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const YearSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: year, isLoading, isError } = useGetYears({});
  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedYear(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("year")}
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Year</option>
        {isLoading && <option value="">Loading Years...</option>}
        {isError && <option value="">Failed to load Years</option>}
        {year?.data?.length === 0 && <option value="">No Years found</option>}
        {year?.data?.map((y: any, index: number) => (
          <option key={index} value={y?._id}>
            {y?.year}
          </option>
        ))}
      </select>
    </div>
  );
};

const BrandSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: brand, isLoading, isError } = useGetBrands({});
  const [selectedBrand, setSelectedBrand] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedBrand(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("brand")}
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Brand</option>
        {isLoading && <option value="">Loading Brands...</option>}
        {isError && <option value="">Failed to load Brands</option>}
        {brand?.data?.length === 0 && <option value="">No Brands found</option>}
        {brand?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};
const ModelSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: model, isLoading, isError } = useGetModels({});
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedModel(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("model")}
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Model</option>
        {isLoading && <option value="">Loading Models...</option>}
        {isError && <option value="">Failed to load Models</option>}
        {model?.data?.length === 0 && <option value="">No Models found</option>}
        {model?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.model}
          </option>
        ))}
      </select>
    </div>
  );
};

const TyreSizeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: tireSize, isLoading, isError } = useGetTyreSizes({});
  const [selectedTireSize, setSelectedTireSize] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedTireSize(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("tyreSize")}
        value={selectedTireSize}
        onChange={(e) => setSelectedTireSize(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Tyre Size</option>
        {isLoading && <option value="">Loading Tyre Sizes...</option>}
        {isError && <option value="">Failed to load Tyre Sizes</option>}
        {tireSize?.data?.length === 0 && (
          <option value="">No Tyre Sizes found</option>
        )}
        {tireSize?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
            {m?.tireSize}
          </option>
        ))}
      </select>
    </div>
  );
};

const TrimSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: trim, isLoading, isError } = useGetTrims({});
  const [selectedTrim, setSelectedTrim] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedTrim(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("trim")}
        value={selectedTrim}
        onChange={(e) => setSelectedTrim(e.target.value)}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5"
      >
        <option value="">Select Trim</option>
        {isLoading && <option value="">Loading Trims...</option>}
        {isError && <option value="">Failed to load Trims</option>}
        {trim?.data?.length === 0 && <option value="">No Trims found</option>}
        {trim?.data?.map((m: any, index: number) => (
          <option key={index} value={m?._id}>
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
  const [selectedVehicle, setSelectedVehicle] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedVehicle(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("vehicleType")}
        value={selectedVehicle}
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
  const [selectedWidth, setSelectedWidth] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedWidth(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("width")}
        value={selectedWidth}
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
  const [selectedRatio, setSelectedRatio] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedRatio(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("ratio")}
        value={selectedRatio}
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
  const [selectedDiameter, setSelectedDiameter] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedDiameter(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("diameter")}
        value={selectedDiameter}
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
  const [selectedWidthType, setSelectedWidthType] = useState("");

  useEffect(() => {
    if (defaultValue?._id) {
      setSelectedWidthType(defaultValue._id);
    }
  }, [defaultValue]);

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("widthType")}
        value={selectedWidthType}
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
