"use client";

import { Button } from "@heroui/button";
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
import { useGetSingleTire, useUpdateTire } from "@/src/hooks/tire.hook";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { DataError, DataLoading } from "../../_components/DataFetchingStates";
import { useGetTireDiameters } from "@/src/hooks/tireDiameter.hook";
import { useGetTireRatios } from "@/src/hooks/tireRatio.hook";
import { useGetTireWidths } from "@/src/hooks/tireWidth.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { envConfig } from "@/src/config/envConfig";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";

interface AddonService {
  name?: string;
  price?: number;
}

export default function UpdateTirePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<AddonService[]>([
    { name: "", price: 0 },
  ]);

  const id = params.id;
  const { data: dataT, isPending, isError } = useGetSingleTire(id);
  const selectedTire = dataT?.data;

  const { mutate: handleUpdateTire, isPending: updateTirePending } =
    useUpdateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire updated successfully!");
      },
      id: id,
    });

  useEffect(() => {
    if (selectedTire?.addonServices?.length) {
      setAddonServices(selectedTire.addonServices);
    }
    if (selectedTire?.images?.length) {
      const previews = selectedTire.images.map((img: any) =>
        img.startsWith("/storage") ? `${envConfig.base_url}${img}` : img
      );
      setImagePreviews(previews);
    }
  }, [selectedTire]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    const validAddonServices = addonServices.filter(
      (service) => service.name?.trim() !== "" && (service.price || 0) > 0
    );

    // ✅ মিশন: ইমেজ এবং ডিসকাউন্ট প্রোটেকশন লজিক
    const tireData: any = {
      ...data,
      // রিলেশনাল আইডি ফিল্ডস
      year: data.year || selectedTire?.year?._id,
      make: data.make || selectedTire?.make?._id,
      model: data.model || selectedTire?.model?._id,
      trim: data.trim || selectedTire?.trim?._id,
      tireSize: data.tyreSize || selectedTire?.tireSize?._id,
      category: data.category || selectedTire?.category?._id,
      drivingType: data.drivingType || selectedTire?.drivingType?._id,
      brand: data.brand || selectedTire?.brand?._id,
      vehicleType: data.vehicleType || selectedTire?.vehicleType?._id,
      ratio: data.ratio || selectedTire?.ratio?._id,
      width: data.width || selectedTire?.width?._id,
      diameter: data.diameter || selectedTire?.diameter?._id,

      // ✅ ডিসকাউন্ট এবং নাম্বার ফিল্ড ফিক্স
      price: data.price ? Number(data.price) : selectedTire?.price,
      discountPrice: data.discountPrice
        ? Number(data.discountPrice)
        : selectedTire?.discountPrice,
      twoSetDiscountPrice: data.twoSetDiscountPrice
        ? Number(data.twoSetDiscountPrice)
        : selectedTire?.twoSetDiscountPrice,
      fourSetDiscountPrice: data.fourSetDiscountPrice
        ? Number(data.fourSetDiscountPrice)
        : selectedTire?.fourSetDiscountPrice,
      stockQuantity: data.stockQuantity
        ? Number(data.stockQuantity)
        : selectedTire?.stockQuantity,

      // স্পেসিফিকেশন নাম্বারস
      sectionWidth: data.sectionWidth
        ? Number(data.sectionWidth)
        : selectedTire?.sectionWidth,
      overallDiameter: data.overallDiameter
        ? Number(data.overallDiameter)
        : selectedTire?.overallDiameter,
      rimWidthRange: data.rimWidthRange
        ? Number(data.rimWidthRange)
        : selectedTire?.rimWidthRange,
      treadDepth: data.treadDepth
        ? Number(data.treadDepth)
        : selectedTire?.treadDepth,
      loadIndex: data.loadIndex
        ? Number(data.loadIndex)
        : selectedTire?.loadIndex,
      maxPSI: data.maxPSI ? Number(data.maxPSI) : selectedTire?.maxPSI,
      loadCapacity: data.loadCapacity
        ? Number(data.loadCapacity)
        : selectedTire?.loadCapacity,
      installationPrice: data.installationPrice
        ? Number(data.installationPrice)
        : selectedTire?.installationPrice,

      // সব রেঞ্জ এবং স্ট্রিং ফিল্ডস (ইন্টারফেস অনুযায়ী)
      addonServices: validAddonServices.length > 0 ? validAddonServices : [],
      productLine: data.productLine || selectedTire?.productLine,
      unitName: data.unitName || selectedTire?.unitName,
      conditionInfo: data.conditionInfo || selectedTire?.conditionInfo,
      grossWeightRange: data.grossWeightRange || selectedTire?.grossWeightRange,
      gtinRange: data.gtinRange || selectedTire?.gtinRange,
      loadIndexRange: data.loadIndexRange || selectedTire?.loadIndexRange,
      mileageWarrantyRange:
        data.mileageWarrantyRange || selectedTire?.mileageWarrantyRange,
      maxAirPressureRange:
        data.maxAirPressureRange || selectedTire?.maxAirPressureRange,
      speedRatingRange: data.speedRatingRange || selectedTire?.speedRatingRange,
      sidewallDescriptionRange:
        data.sidewallDescriptionRange || selectedTire?.sidewallDescriptionRange,
      temperatureGradeRange:
        data.temperatureGradeRange || selectedTire?.temperatureGradeRange,
      sectionWidthRange:
        data.sectionWidthRange || selectedTire?.sectionWidthRange,
      wheelRimDiameterRange:
        data.wheelRimDiameterRange || selectedTire?.wheelRimDiameterRange,
      tractionGradeRange:
        data.tractionGradeRange || selectedTire?.tractionGradeRange,
      treadDepthRange: data.treadDepthRange || selectedTire?.treadDepthRange,
      treadWidthRange: data.treadWidthRange || selectedTire?.treadWidthRange,
      overallWidthRange:
        data.overallWidthRange || selectedTire?.overallWidthRange,
      treadwearGradeRange:
        data.treadwearGradeRange || selectedTire?.treadwearGradeRange,
      aspectRatioRange: data.aspectRatioRange || selectedTire?.aspectRatioRange,
      loadRange: data.loadRange || selectedTire?.loadRange,
      warranty: data.warranty || selectedTire?.warranty,
      treadPattern: data.treadPattern || selectedTire?.treadPattern,
      constructionType: data.constructionType || selectedTire?.constructionType,
      tireType: data.tireType || selectedTire?.tireType,
    };

    // ✅ ইমেজ প্রোটেকশন: নতুন ইমেজ না থাকলে পুরনো পাথ পাঠিয়ে দাও
    if (imageFiles.length === 0 && selectedTire?.images) {
      tireData.images = selectedTire.images;
    }

    formData.append("updatedData", JSON.stringify(tireData));

    if (imageFiles.length > 0) {
      imageFiles.forEach((image) => {
        formData.append("images", image);
      });
    }

    handleUpdateTire(formData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImageFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newImageFiles]);
    newImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="max-w-7xl mx-auto space-y-10 p-4">
          {/* General Information */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">General Information</h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FXInput
                label="Name"
                name="name"
                defaultValue={selectedTire?.name}
              />
              <FXInput
                label="Product Line"
                name="productLine"
                defaultValue={selectedTire?.productLine}
              />
              <FXInput
                label="Unit Name"
                name="unitName"
                defaultValue={selectedTire?.unitName}
              />
              <FXInput
                label="Condition Info"
                name="conditionInfo"
                defaultValue={selectedTire?.conditionInfo}
              />
              <FXInput
                label="Warranty"
                name="warranty"
                defaultValue={selectedTire?.warranty}
              />
              <FXInput
                label="Description"
                name="description"
                defaultValue={selectedTire?.description}
              />
            </div>
          </section>

          {/* Pricing & Stock (Fixed Fields) */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-600">
              Pricing & Stock Updates
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <FXInput
                label="Base Price"
                name="price"
                type="number"
                defaultValue={selectedTire?.price}
              />
              <FXInput
                label="Discount Price"
                name="discountPrice"
                type="number"
                defaultValue={selectedTire?.discountPrice}
              />
              <FXInput
                label="2-Set Price"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.twoSetDiscountPrice}
              />
              <FXInput
                label="4-Set Price"
                name="fourSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.fourSetDiscountPrice}
              />
              <FXInput
                label="Stock Qty"
                name="stockQuantity"
                type="number"
                defaultValue={selectedTire?.stockQuantity}
              />
            </div>
          </section>

          {/* Dynamic Addon Services */}
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Addon Services</h2>
              <Button
                type="button"
                onClick={() =>
                  setAddonServices([...addonServices, { name: "", price: 0 }])
                }
                color="primary"
                startContent={<Plus size={16} />}>
                Add Service
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {addonServices.map((service, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center border p-4 rounded-xl">
                  <input
                    className="flex-1 p-2 border rounded-lg"
                    placeholder="Service Name"
                    value={service.name}
                    onChange={(e) =>
                      handleAddonServiceChange(index, "name", e.target.value)
                    }
                  />
                  <input
                    className="w-32 p-2 border rounded-lg"
                    type="number"
                    placeholder="Price"
                    value={service.price}
                    onChange={(e) =>
                      handleAddonServiceChange(index, "price", e.target.value)
                    }
                  />
                  <Button
                    isIconOnly
                    color="danger"
                    variant="flat"
                    onClick={() =>
                      setAddonServices(
                        addonServices.filter((_, i) => i !== index)
                      )
                    }>
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Specifications */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Technical Specifications</h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MakeSelectForTyre
                defaultValue={selectedTire?.make}
                register={methods.register}
              />
              <YearSelectForTyre
                defaultValue={selectedTire?.year}
                register={methods.register}
              />
              <ModelSelectForTire
                defaultValue={selectedTire?.model}
                register={methods.register}
              />
              <TyreSizeSelectForTire
                defaultValue={selectedTire?.tireSize}
                register={methods.register}
              />
              <BrandSelectForTire
                defaultValue={selectedTire?.brand}
                register={methods.register}
              />
              <FXInput
                label="Construction"
                name="constructionType"
                defaultValue={selectedTire?.constructionType}
              />
              <FXInput
                label="Tire Type"
                name="tireType"
                defaultValue={selectedTire?.tireType}
              />
              <FXInput
                label="Load Range"
                name="loadRange"
                defaultValue={selectedTire?.loadRange}
              />
              <FXInput
                label="Max PSI"
                name="maxPSI"
                type="number"
                defaultValue={selectedTire?.maxPSI}
              />
            </div>
          </section>

          {/* Image Upload Area */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold">Product Images</h2>
            <Divider />
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
              <UploadCloud
                size={32}
                className="text-gray-400 mb-2"
              />
              <span className="text-sm font-medium">
                Click to upload new images
              </span>
              <input
                type="file"
                id="images"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative group">
                  <img
                    src={src}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-700 text-white font-bold h-16 rounded-2xl shadow-xl"
            isLoading={updateTirePending}>
            UPDATE PERFORMANCE RECORD
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

// ... (Select Components like MakeSelectForTyre, BrandSelectForTire etc. same as before)
