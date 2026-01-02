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

export default function UpdateTirePage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<any[]>([
    { name: "", price: 0 },
  ]);

  const id = params.id;
  const { data: dataT, isPending, isError } = useGetSingleTire(id);
  const selectedTire = dataT?.data;

  const { mutate: handleUpdateTire, isPending: updateTirePending } =
    useUpdateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Tire Updated and Synchronized!");
      },
      id: id,
    });

  useEffect(() => {
    if (selectedTire?.addonServices?.length)
      setAddonServices(selectedTire.addonServices);
    if (selectedTire?.images?.length) {
      const previews = selectedTire.images.map((img: any) =>
        img.startsWith("/storage") ? `${envConfig.base_url}${img}` : img
      );
      setImagePreviews(previews);
    }
  }, [selectedTire]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // ✅ লজিক: খালি রাখলে null যাবে, যাতে ব্যাকএন্ডে ডাটা মুছে যায়
    const parseNumber = (value: any, fallback: any) => {
      if (value === "" || value === undefined) return null;
      return Number(value);
    };

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

      // ✅ ইস্যু ১ ফিক্স: ডিসকাউন্ট ফিল্ড খালি করলে null হবে
      price: parseNumber(data.price, selectedTire?.price),
      discountPrice: parseNumber(
        data.discountPrice,
        selectedTire?.discountPrice
      ),
      twoSetDiscountPrice: parseNumber(
        data.twoSetDiscountPrice,
        selectedTire?.twoSetDiscountPrice
      ),
      fourSetDiscountPrice: parseNumber(
        data.fourSetDiscountPrice,
        selectedTire?.fourSetDiscountPrice
      ),
      stockQuantity: parseNumber(
        data.stockQuantity,
        selectedTire?.stockQuantity
      ),

      // স্পেকস নাম্বারস
      sectionWidth: parseNumber(data.sectionWidth, selectedTire?.sectionWidth),
      overallDiameter: parseNumber(
        data.overallDiameter,
        selectedTire?.overallDiameter
      ),
      rimWidthRange: parseNumber(
        data.rimWidthRange,
        selectedTire?.rimWidthRange
      ),
      treadDepth: parseNumber(data.treadDepth, selectedTire?.treadDepth),
      loadIndex: parseNumber(data.loadIndex, selectedTire?.loadIndex),
      maxPSI: parseNumber(data.maxPSI, selectedTire?.maxPSI),
      loadCapacity: parseNumber(data.loadCapacity, selectedTire?.loadCapacity),
      installationPrice: parseNumber(
        data.installationPrice,
        selectedTire?.installationPrice
      ),

      // রেঞ্জ এবং অন্যান্য ফিল্ডস (সবগুলোই রাখা হয়েছে)
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
      addonServices: addonServices.filter(
        (s) => s.name?.trim() !== "" && (s.price || 0) > 0
      ),
    };

    // ✅ ইস্যু ২ ফিক্স: ইমেজ যাতে গায়েব না হয়
    if (imageFiles.length === 0 && selectedTire?.images) {
      tireData.images = selectedTire.images;
    }

    formData.append("updatedData", JSON.stringify(tireData));
    if (imageFiles.length > 0) {
      imageFiles.forEach((image) => formData.append("images", image));
    }

    handleUpdateTire(formData);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6 pb-20">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase">
              1. General Info & Pricing
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FXInput
                label="Name"
                name="name"
                defaultValue={selectedTire?.name}
              />
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
                label="2 Set Discount (Clear to disable)"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.twoSetDiscountPrice}
              />
              <FXInput
                label="4 Set Discount (Clear to disable)"
                name="fourSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.fourSetDiscountPrice}
              />
              <FXInput
                label="Stock"
                name="stockQuantity"
                type="number"
                defaultValue={selectedTire?.stockQuantity}
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
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase text-blue-600">
              2. Relational Selections
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-6 rounded-3xl">
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
              <TrimSelectForTyre
                defaultValue={selectedTire?.trim}
                register={methods.register}
              />
              <CategorySelectForTyre
                defaultValue={selectedTire?.category}
                register={methods.register}
              />
              <DrivingTypeSelectForTyre
                defaultValue={selectedTire?.drivingType}
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
              <VehicleSelectForTyre
                defaultValue={selectedTire?.vehicleType}
                register={methods.register}
              />
              <WidthSelectForTyre
                defaultValue={selectedTire?.width}
                register={methods.register}
              />
              <RatioSelectForTyre
                defaultValue={selectedTire?.ratio}
                register={methods.register}
              />
              <DiameterSelectForTyre
                defaultValue={selectedTire?.diameter}
                register={methods.register}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase text-orange-600">
              3. Technical Ranges & Measurement
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FXInput
                label="Gross Weight Range"
                name="grossWeightRange"
                defaultValue={selectedTire?.grossWeightRange}
              />
              <FXInput
                label="GTIN Range"
                name="gtinRange"
                defaultValue={selectedTire?.gtinRange}
              />
              <FXInput
                label="Load Index Range"
                name="loadIndexRange"
                defaultValue={selectedTire?.loadIndexRange}
              />
              <FXInput
                label="Mileage Warranty Range"
                name="mileageWarrantyRange"
                defaultValue={selectedTire?.mileageWarrantyRange}
              />
              <FXInput
                label="Max Air Pressure Range"
                name="maxAirPressureRange"
                defaultValue={selectedTire?.maxAirPressureRange}
              />
              <FXInput
                label="Speed Rating Range"
                name="speedRatingRange"
                defaultValue={selectedTire?.speedRatingRange}
              />
              <FXInput
                label="Sidewall Description"
                name="sidewallDescriptionRange"
                defaultValue={selectedTire?.sidewallDescriptionRange}
              />
              <FXInput
                label="Temperature Grade"
                name="temperatureGradeRange"
                defaultValue={selectedTire?.temperatureGradeRange}
              />
              <FXInput
                label="Section Width Range"
                name="sectionWidthRange"
                defaultValue={selectedTire?.sectionWidthRange}
              />
              <FXInput
                label="Rim Diameter Range"
                name="wheelRimDiameterRange"
                defaultValue={selectedTire?.wheelRimDiameterRange}
              />
              <FXInput
                label="Traction Grade"
                name="tractionGradeRange"
                defaultValue={selectedTire?.tractionGradeRange}
              />
              <FXInput
                label="Tread Depth Range"
                name="treadDepthRange"
                defaultValue={selectedTire?.treadDepthRange}
              />
              <FXInput
                label="Tread Width Range"
                name="treadWidthRange"
                defaultValue={selectedTire?.treadWidthRange}
              />
              <FXInput
                label="Overall Width Range"
                name="overallWidthRange"
                defaultValue={selectedTire?.overallWidthRange}
              />
              <FXInput
                label="Treadwear Grade"
                name="treadwearGradeRange"
                defaultValue={selectedTire?.treadwearGradeRange}
              />
              <FXInput
                label="Aspect Ratio Range"
                name="aspectRatioRange"
                defaultValue={selectedTire?.aspectRatioRange}
              />
              <FXInput
                label="Tread Pattern"
                name="treadPattern"
                defaultValue={selectedTire?.treadPattern}
              />
              <FXInput
                label="Construction Type"
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
                label="Section Width (Num)"
                name="sectionWidth"
                type="number"
                defaultValue={selectedTire?.sectionWidth}
              />
              <FXInput
                label="Overall Diameter (Num)"
                name="overallDiameter"
                type="number"
                defaultValue={selectedTire?.overallDiameter}
              />
              <FXInput
                label="Rim Width Range (Num)"
                name="rimWidthRange"
                type="number"
                defaultValue={selectedTire?.rimWidthRange}
              />
              <FXInput
                label="Tread Depth (Num)"
                name="treadDepth"
                type="number"
                defaultValue={selectedTire?.treadDepth}
              />
              <FXInput
                label="Load Index (Num)"
                name="loadIndex"
                type="number"
                defaultValue={selectedTire?.loadIndex}
              />
              <FXInput
                label="Max PSI"
                name="maxPSI"
                type="number"
                defaultValue={selectedTire?.maxPSI}
              />
              <FXInput
                label="Load Capacity"
                name="loadCapacity"
                type="number"
                defaultValue={selectedTire?.loadCapacity}
              />
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="text-2xl font-black italic uppercase">
              4. Asset Management
            </h2>
            <Divider />
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-3xl cursor-pointer bg-gray-50 border-gray-300">
              <UploadCloud className="text-gray-400 mb-2" />
              <span className="text-sm font-bold">
                Upload New Images to Replace or Add
              </span>
              <input
                multiple
                className="hidden"
                id="images"
                type="file"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-4 mt-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative size-28 rounded-2xl overflow-hidden border shadow-lg group">
                  <img
                    src={src}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-700 text-white font-black italic h-20 rounded-[24px] shadow-2xl uppercase tracking-widest"
            isLoading={updateTirePending}>
            Confirm and Sync Track Data
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

// ✅ ড্রপডাউন সিলেক্ট কম্পোনেন্টগুলো (সবগুলোই এখানে দেওয়া হলো)
const DrivingTypeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: drivingType } = useGetDrivingTypes() as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("drivingType")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select driving types</option>
      {drivingType?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.title}
        </option>
      ))}
    </select>
  );
};

const MakeSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: makes } = useGetMakes({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("make")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Make</option>
      {makes?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.make}
        </option>
      ))}
    </select>
  );
};

const YearSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: year } = useGetYears({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("year")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Year</option>
      {year?.data?.map((y: any) => (
        <option
          key={y?._id}
          value={y?._id}>
          {y?.year}
        </option>
      ))}
    </select>
  );
};

const ModelSelectForTire = ({ defaultValue, register }: any) => {
  const { data: model } = useGetModels({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("model")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Model</option>
      {model?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.model}
        </option>
      ))}
    </select>
  );
};

const TrimSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: trim } = useGetTrims({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("trim")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Trim</option>
      {trim?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.trim}
        </option>
      ))}
    </select>
  );
};

const CategorySelectForTyre = ({ defaultValue, register }: any) => {
  const { data: category } = useGetCategories(undefined) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("category")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Category</option>
      {category?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.name}
        </option>
      ))}
    </select>
  );
};

const TyreSizeSelectForTire = ({ defaultValue, register }: any) => {
  const { data: tireSize } = useGetTyreSizes({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("tyreSize")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Tyre Size</option>
      {tireSize?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.tireSize}
        </option>
      ))}
    </select>
  );
};

const BrandSelectForTire = ({ defaultValue, register }: any) => {
  const { data: brand } = useGetBrands({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("brand")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Brand</option>
      {brand?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.name}
        </option>
      ))}
    </select>
  );
};

const VehicleSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: vehicleType } = useGetVehicleTypes({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("vehicleType")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Vehicle Type</option>
      {vehicleType?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.vehicleType}
        </option>
      ))}
    </select>
  );
};

const WidthSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: width } = useGetTireWidths({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("width")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Width</option>
      {width?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.width}
        </option>
      ))}
    </select>
  );
};

const RatioSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: ratio } = useGetTireRatios({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("ratio")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Aspect Ratio</option>
      {ratio?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.ratio}
        </option>
      ))}
    </select>
  );
};

const DiameterSelectForTyre = ({ defaultValue, register }: any) => {
  const { data: diameter } = useGetTireDiameters({}) as any;
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("diameter")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5">
      <option value="">Select Rim Diameter</option>
      {diameter?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.diameter}
        </option>
      ))}
    </select>
  );
};
