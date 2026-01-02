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
import {
  UploadCloud,
  Trash2,
  Gauge,
  DollarSign,
  Package,
  Settings,
  Image as ImageIcon,
  Ruler,
  ShieldCheck,
} from "lucide-react";
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addonServices, setAddonServices] = useState<any[]>([]);

  const { data: dataT, isPending, isError } = useGetSingleTire(params.id);
  const selectedTire = dataT?.data;

  const { mutate: handleUpdateTire, isPending: updateTirePending } =
    useUpdateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Track Data & Assets Synchronized!");
      },
      id: params.id,
    });

  useEffect(() => {
    if (selectedTire) {
      if (selectedTire.addonServices)
        setAddonServices(selectedTire.addonServices);
      if (selectedTire.images) {
        const previews = selectedTire.images.map((img: string) =>
          img.startsWith("/storage") ? `${envConfig.base_url}${img}` : img
        );
        setImagePreviews(previews);
      }
    }
  }, [selectedTire]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // ইমেজ ফিল্টার: শুধুমাত্র যেগুলো এখনো স্টোরেজে আছে (ডিলিট করা হয়নি)
    const remainingOldImages = imagePreviews
      .filter((src) => src.includes("/storage"))
      .map((src) => src.replace(envConfig.base_url as string, ""));

    const toNum = (val: any) =>
      val === "" || val === undefined ? null : Number(val);

    const tireData: any = {
      ...data,
      // রিলেশনাল
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

      images: remainingOldImages, // ডিলিট করা ইমেজ বাদে বাকিগুলো

      // অল নাম্বার ফিল্ডস (Interface mapping)
      price: toNum(data.price),
      discountPrice: toNum(data.discountPrice),
      twoSetDiscountPrice: toNum(data.twoSetDiscountPrice),
      fourSetDiscountPrice: toNum(data.fourSetDiscountPrice),
      stockQuantity: toNum(data.stockQuantity),
      sectionWidth: toNum(data.sectionWidth),
      overallDiameter: toNum(data.overallDiameter),
      rimWidthRange: toNum(data.rimWidthRange),
      treadDepth: toNum(data.treadDepth),
      loadIndex: toNum(data.loadIndex),
      maxPSI: toNum(data.maxPSI),
      loadCapacity: toNum(data.loadCapacity),
      installationPrice: toNum(data.installationPrice),

      addonServices: addonServices.filter((s) => s.name?.trim() !== ""),
    };

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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6 bg-[#fcfcfc] dark:bg-black min-h-screen pb-24">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="max-w-7xl mx-auto space-y-12">
          {/* SECTION 1: CORE INFO & PRICING */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm border-l-8 border-l-rose-600">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-rose-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Pricing & Inventory
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FXInput
                label="Name"
                name="name"
                defaultValue={selectedTire?.name}
              />
              <FXInput
                label="Price"
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
                label="2-Set Price (Clear to delete)"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.twoSetDiscountPrice}
              />
              <FXInput
                label="4-Set Price (Clear to delete)"
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
            </div>
          </div>

          {/* SECTION 2: RELATIONAL SELECTS */}
          <div className="bg-[#f8f9fb] dark:bg-[#1a1d23] p-8 rounded-[40px] border border-dashed">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Base Selectors
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* SECTION 3: ALL TECHNICAL RANGE FIELDS (THE HUGE LIST) */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="text-orange-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Technical Ranges
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                label="Wheel Rim Diameter Range"
                name="wheelRimDiameterRange"
                defaultValue={selectedTire?.wheelRimDiameterRange}
              />
              <FXInput
                label="Traction Grade Range"
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
                label="Treadwear Grade Range"
                name="treadwearGradeRange"
                defaultValue={selectedTire?.treadwearGradeRange}
              />
              <FXInput
                label="Aspect Ratio Range"
                name="aspectRatioRange"
                defaultValue={selectedTire?.aspectRatioRange}
              />
            </div>
          </div>

          {/* SECTION 4: NUMERIC SPECS & CONSTRUCTION */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm border-l-8 border-l-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Numeric Specs & Build
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                label="Load Capacity (lbs)"
                name="loadCapacity"
                type="number"
                defaultValue={selectedTire?.loadCapacity}
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
                label="Warranty Policy"
                name="warranty"
                defaultValue={selectedTire?.warranty}
              />
            </div>
          </div>

          {/* SECTION 5: ASSETS */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-purple-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Visual Performance Assets
              </h2>
            </div>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[32px] cursor-pointer bg-gray-50 dark:bg-black/20 hover:bg-blue-50 transition-all border-gray-200">
              <UploadCloud
                size={30}
                className="text-gray-400 mb-1"
              />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Add Assets
              </span>
              <input
                multiple
                className="hidden"
                id="images"
                type="file"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-4 mt-8">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative size-32 rounded-3xl overflow-hidden border shadow-lg group">
                  <img
                    src={src}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImagePreviews((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-blue-700 text-white font-black italic h-20 rounded-[30px] shadow-2xl uppercase tracking-[0.2em] active:scale-95 transition-all"
            isLoading={updateTirePending}>
            Update Specification Record
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

// ✅ ড্রপডাউন সিলেক্ট কম্পোনেন্টগুলো (তোর অরিজিনাল কোড থেকে নেওয়া)
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Driving types</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Make</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Year</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Model</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Trim</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Category</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Tyre Size</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Brand</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Vehicle Type</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Width</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Aspect Ratio</option>
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
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-sm">
      <option value="">Rim Diameter</option>
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
