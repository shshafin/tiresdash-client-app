"use client";

import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
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
import { useCreateTire } from "@/src/hooks/tire.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { useGetTireWidths } from "@/src/hooks/tireWidth.hook";
import { useGetTireRatios } from "@/src/hooks/tireRatio.hook";
import { useGetTireDiameters } from "@/src/hooks/tireDiameter.hook";

interface AddonService {
  name?: string;
  price?: number;
}

export default function AdminTirePage() {
  const queryClient = useQueryClient();
  const { onClose } = useDisclosure();

  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<AddonService[]>([
    { name: '', price: 0 }
  ]);

  const { mutate: handleCreateTire, isPending: createTirePending } =
    useCreateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire created successfully");
        methods.reset();
        setAddonServices([{ name: '', price: 0 }]);
        setImageFiles([]);
        setImagePreviews([]);
        onClose();
      },
    });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    
    // Filter out empty addon services
    const validAddonServices = addonServices.filter(service => 
      service.name?.trim() !== '' && (service.price || 0) > 0
    );

    // Remove empty addon services
    const filteredAddonServices = validAddonServices.length > 0 ? validAddonServices : undefined;

    const tireData = {
      ...data,
      year: data.year, // Already ObjectId from select
      make: data.make, // Already ObjectId from select
      model: data.model, // Already ObjectId from select
      trim: data.trim, // Already ObjectId from select
      tireSize: data.tyreSize, // Already ObjectId from select
      drivingType: data.drivingType, // Already ObjectId from select
      brand: data.brand, // Already ObjectId from select
      category: data.category, // Already ObjectId from select
      width: data.width, // Already ObjectId from select (not number!)
      ratio: data.ratio, // Already ObjectId from select (not number!)
      diameter: data.diameter, // Already ObjectId from select (not number!)
      vehicleType: data.vehicleType, // Already ObjectId from select
      installationService: data.installationService || undefined,
      installationPrice: data.installationPrice ? Number(data.installationPrice) : undefined,
      addonServices: filteredAddonServices,
      description: data.description || '',
      productLine: data.productLine || '',
      unitName: data.unitName || '',
      conditionInfo: data.conditionInfo || '',
      grossWeightRange: data.grossWeightRange || '',
      gtinRange: data.gtinRange || '',
      loadIndexRange: data.loadIndexRange || '',
      mileageWarrantyRange: data.mileageWarrantyRange || '',
      maxAirPressureRange: data.maxAirPressureRange || '',
      speedRatingRange: data.speedRatingRange || '',
      sidewallDescriptionRange: data.sidewallDescriptionRange || '',
      temperatureGradeRange: data.temperatureGradeRange || '',
      sectionWidthRange: data.sectionWidthRange || '',
      wheelRimDiameterRange: data.wheelRimDiameterRange || '',
      tractionGradeRange: data.tractionGradeRange || '',
      treadDepthRange: data.treadDepthRange || '',
      treadWidthRange: data.treadWidthRange || '',
      overallWidthRange: data.overallWidthRange || '',
      treadwearGradeRange: data.treadwearGradeRange || '',
      sectionWidth: Number(data.sectionWidth),
      overallDiameter: Number(data.overallDiameter),
      rimWidthRange: Number(data.rimWidthRange),
      treadDepth: Number(data.treadDepth),
      loadIndex: Number(data.loadIndex),
      loadRange: data.loadRange || '',
      maxPSI: Number(data.maxPSI),
      warranty: data.warranty || '',
      aspectRatioRange: data.aspectRatioRange || '',
      treadPattern: data.treadPattern || '',
      loadCapacity: Number(data.loadCapacity),
      constructionType: data.constructionType || '',
      tireType: data.tireType || '',
      price: Number(data.price),
      discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
      twoSetDiscountPrice: data.twoSetDiscountPrice ? Number(data.twoSetDiscountPrice) : undefined,
      fourSetDiscountPrice: data.fourSetDiscountPrice ? Number(data.fourSetDiscountPrice) : undefined,
      stockQuantity: Number(data.stockQuantity),
      images: [] // Will be populated by backend after upload
    };

    formData.append("data", JSON.stringify(tireData));

    imageFiles.forEach((image) => {
      formData.append("images", image);
    });

    handleCreateTire(formData);
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

  const handleAddonServiceChange = (index: number, field: keyof AddonService, value: string | number) => {
    setAddonServices(prev => 
      prev.map((service, i) => 
        i === index 
          ? { ...service, [field]: value }
          : service
      )
    );
  };

  const addNewAddonService = () => {
    setAddonServices(prev => [...prev, { name: '', price: 0 }]);
  };

  const removeAddonService = (index: number) => {
    if (addonServices.length > 1) {
      setAddonServices(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-full">
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-7xl mx-auto space-y-10 p-4">
              
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
                  <FXInput
                    label="Description"
                    name="description"
                  />
                  <FXInput
                    label="Product Line"
                    name="productLine"
                  />
                  <FXInput
                    label="Unit Name"
                    name="unitName"
                  />
                  <FXInput
                    label="Condition Info"
                    name="conditionInfo"
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-default-600 font-medium">Service {index + 1}</span>
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
                          value={service.name || ''}
                          onChange={(e) => handleAddonServiceChange(index, 'name', e.target.value)}
                          placeholder="Service Name"
                          className="w-full px-3 py-2 border-2 border-[#71717ab3] bg-default-50 rounded-lg"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          value={service.price || 0}
                          onChange={(e) => handleAddonServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
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

              {/* Tire Specification */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Tire Specifications
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <MakeSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <YearSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <ModelSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <TrimSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <CategorySelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <DrivingTypeSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <TyreSizeSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <BrandSelectForTire
                    defaultValue=""
                    register={methods.register}
                  />
                  <VehicleSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <WidthSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <RatioSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <DiameterSelectForTyre
                    defaultValue=""
                    register={methods.register}
                  />
                  <FXInput
                    label="Tread Pattern"
                    name="treadPattern"
                    rules={{ required: "Tread pattern is required" }}
                  />
                  <FXInput
                    label="Tire Type"
                    name="tireType"
                    rules={{ required: "Tire type is required" }}
                  />
                  <FXInput
                    label="Construction Type"
                    name="constructionType"
                    rules={{ required: "Construction type is required" }}
                  />
                  <FXInput
                    label="Load Range"
                    name="loadRange"
                    rules={{ required: "Load range is required" }}
                  />
                  <FXInput
                    label="Warranty"
                    name="warranty"
                    rules={{ required: "Warranty is required" }}
                  />
                </div>
              </div>

              {/* Dimensions & Measurements */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Dimensions & Measurements
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Section Width"
                    name="sectionWidth"
                    type="number"
                    rules={{
                      required: "Section Width is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Overall Diameter"
                    name="overallDiameter"
                    type="number"
                    rules={{
                      required: "Overall Diameter is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Rim Width Range"
                    name="rimWidthRange"
                    type="number"
                    rules={{
                      required: "Rim Width Range is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Tread Depth"
                    name="treadDepth"
                    type="number"
                    rules={{
                      required: "Tread Depth is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Load Index"
                    name="loadIndex"
                    type="number"
                    rules={{
                      required: "Load Index is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Max PSI"
                    name="maxPSI"
                    type="number"
                    rules={{
                      required: "Max PSI is required",
                      valueAsNumber: true,
                    }}
                  />
                  <FXInput
                    label="Load Capacity"
                    name="loadCapacity"
                    type="number"
                    rules={{
                      required: "Load Capacity is required",
                      valueAsNumber: true,
                    }}
                  />
                </div>
              </div>

              {/* Range Values */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-default-900">
                  Range Values
                </h2>
                <Divider />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FXInput
                    label="Gross Weight Range"
                    name="grossWeightRange"
                  />
                  <FXInput
                    label="GTIN Range"
                    name="gtinRange"
                  />
                  <FXInput
                    label="Load Index Range"
                    name="loadIndexRange"
                  />
                  <FXInput
                    label="Mileage Warranty Range"
                    name="mileageWarrantyRange"
                  />
                  <FXInput
                    label="Max Air Pressure Range"
                    name="maxAirPressureRange"
                  />
                  <FXInput
                    label="Speed Rating Range"
                    name="speedRatingRange"
                  />
                  <FXInput
                    label="Sidewall Description Range"
                    name="sidewallDescriptionRange"
                  />
                  <FXInput
                    label="Temperature Grade Range"
                    name="temperatureGradeRange"
                  />
                  <FXInput
                    label="Section Width Range"
                    name="sectionWidthRange"
                  />
                  <FXInput
                    label="Wheel Rim Diameter Range"
                    name="wheelRimDiameterRange"
                  />
                  <FXInput
                    label="Traction Grade Range"
                    name="tractionGradeRange"
                  />
                  <FXInput
                    label="Tread Depth Range"
                    name="treadDepthRange"
                  />
                  <FXInput
                    label="Tread Width Range"
                    name="treadWidthRange"
                  />
                  <FXInput
                    label="Overall Width Range"
                    name="overallWidthRange"
                  />
                  <FXInput
                    label="Treadwear Grade Range"
                    name="treadwearGradeRange"
                  />
                  <FXInput
                    label="Aspect Ratio Range"
                    name="aspectRatioRange"
                    rules={{ required: "Aspect ratio range is required" }}
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
                    rules={{
                      required: "Price is required",
                      valueAsNumber: true,
                    }}
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
                    rules={{
                      required: "Stock Quantity is required",
                      valueAsNumber: true,
                    }}
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
                    className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-gray-100">
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
                            className="relative size-32 rounded-xl border-2 border-dashed border-gray-300 p-2">
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
                  disabled={createTirePending}>
                  {createTirePending ? "Creating..." : "Create Tire"}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}

// IMPORTANT: All select components need to pass ObjectId values, not the actual numeric/text values
// Update all select components to use _id as value

const MakeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: makes, isLoading, isError } = useGetMakes({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("make", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Make</option>
        {isLoading && <option value="">Loading Makes...</option>}
        {isError && <option value="">Failed to load Makes</option>}
        {makes?.data?.length === 0 && <option value="">No Makes found</option>}
        {makes?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.make}
          </option>
        ))}
      </select>
    </div>
  );
};

const CategorySelectForTyre = ({ defaultValue, register }: any) => {
  const {
    data: category,
    isLoading,
    isError,
  } = useGetCategories(undefined) as any;
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("category", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Category</option>
        {isLoading && <option value="">Loading Categories...</option>}
        {isError && <option value="">Failed to load Categories</option>}
        {category?.data?.length === 0 && (
          <option value="">No Categories found</option>
        )}
        {category?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const DrivingTypeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: drivingType, isLoading, isError } = useGetDrivingTypes() as any;
  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("drivingType", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select driving types</option>
        {isLoading && <option value="">Loading driving types...</option>}
        {isError && <option value="">Failed to load driving types</option>}
        {drivingType?.data?.length === 0 && (
          <option value="">No driving types found</option>
        )}
        {drivingType?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.title}
          </option>
        ))}
      </select>
    </div>
  );
};

const YearSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: year, isLoading, isError } = useGetYears({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("year", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Year</option>
        {isLoading && <option value="">Loading Years...</option>}
        {isError && <option value="">Failed to load Years</option>}
        {year?.data?.length === 0 && <option value="">No Years found</option>}
        {year?.data?.map((y: any, index: number) => (
          <option
            key={index}
            value={y?._id}>  {/* Send ObjectId */}
            {y?.year}
          </option>
        ))}
      </select>
    </div>
  );
};

const BrandSelectForTire = ({ defaultValue, register }: any) => {
  const { data: brand, isLoading, isError } = useGetBrands({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("brand", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Brand</option>
        {isLoading && <option value="">Loading Brands...</option>}
        {isError && <option value="">Failed to load Brands</option>}
        {brand?.data?.length === 0 && <option value="">No Brands found</option>}
        {brand?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const ModelSelectForTire = ({ defaultValue, register }: any) => {
  const { data: model, isLoading, isError } = useGetModels({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("model", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Model</option>
        {isLoading && <option value="">Loading Models...</option>}
        {isError && <option value="">Failed to load Models</option>}
        {model?.data?.length === 0 && <option value="">No Models found</option>}
        {model?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.model}
          </option>
        ))}
      </select>
    </div>
  );
};

const TyreSizeSelectForTire = ({ defaultValue, register }: any) => {
  const { data: tireSize, isLoading, isError } = useGetTyreSizes({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("tyreSize", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Tyre Size</option>
        {isLoading && <option value="">Loading Tyre Sizes...</option>}
        {isError && <option value="">Failed to load Tyre Sizes</option>}
        {tireSize?.data?.length === 0 && (
          <option value="">No Tyre Sizes found</option>
        )}
        {tireSize?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.tireSize}
          </option>
        ))}
      </select>
    </div>
  );
};

const TrimSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: trim, isLoading, isError } = useGetTrims({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("trim", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Trim</option>
        {isLoading && <option value="">Loading Trims...</option>}
        {isError && <option value="">Failed to load Trims</option>}
        {trim?.data?.length === 0 && <option value="">No Trims found</option>}
        {trim?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.trim}
          </option>
        ))}
      </select>
    </div>
  );
};

const VehicleSelectForTyre = ({ defaultValue, register }: any) => {
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
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Vehicle Type</option>
        {isLoading && <option value="">Loading Types...</option>}
        {isError && <option value="">Failed to load Types</option>}
        {vehicleType?.data?.length === 0 && (
          <option value="">No Types found</option>
        )}
        {vehicleType?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.vehicleType}
          </option>
        ))}
      </select>
    </div>
  );
};

const WidthSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: width, isLoading, isError } = useGetTireWidths({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("width", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Width</option>
        {isLoading && <option value="">Loading Widths...</option>}
        {isError && <option value="">Failed to load Widths</option>}
        {width?.data?.length === 0 && <option value="">No Widths found</option>}
        {width?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.width}
          </option>
        ))}
      </select>
    </div>
  );
};

const RatioSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: ratio, isLoading, isError } = useGetTireRatios({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("ratio", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Aspect Ratio</option>
        {isLoading && <option value="">Loading Ratios...</option>}
        {isError && <option value="">Failed to load Ratios</option>}
        {ratio?.data?.length === 0 && <option value="">No Ratios found</option>}
        {ratio?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.ratio}
          </option>
        ))}
      </select>
    </div>
  );
};

const DiameterSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: diameter, isLoading, isError } = useGetTireDiameters({}) as any;

  return (
    <div className="flex-1 min-w-[150px]">
      <select
        {...register("diameter", { required: true })}
        defaultValue={defaultValue ? defaultValue?._id : ""}
        className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
        <option value="">Select Rim Diameter</option>
        {isLoading && <option value="">Loading Diameters...</option>}
        {isError && <option value="">Failed to load Diameters</option>}
        {diameter?.data?.length === 0 && (
          <option value="">No Diameters found</option>
        )}
        {diameter?.data?.map((m: any, index: number) => (
          <option
            key={index}
            value={m?._id}>  {/* Send ObjectId */}
            {m?.diameter}
          </option>
        ))}
      </select>
    </div>
  );
};