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
  Plus,
  Trash2,
  Gauge,
  DollarSign,
  Package,
  Settings,
  Image as ImageIcon,
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
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);
  const [addonServices, setAddonServices] = useState<any[]>([
    { name: "", price: 0 },
  ]);

  const { data: dataT, isPending, isError } = useGetSingleTire(params.id);
  const selectedTire = dataT?.data;

  const { mutate: handleUpdateTire, isPending: updateTirePending } =
    useUpdateTire({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_TIRES"] });
        toast.success("Sync Complete! Data and Images are Safe.");
      },
      id: params.id,
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

    // ✅ টাইপ হ্যান্ডলিং লজিক: Number নিশ্চিত করা
    const toNum = (val: any) => {
      if (val === "" || val === undefined || val === null) return null;
      const parsed = Number(val);
      return isNaN(parsed) ? null : parsed;
    };

    const tireData: any = {
      ...data,
      // রিলেশনাল ড্রপডাউনস
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

      // ✅ টাইপ সেফটি ও ডিসকাউন্ট লজিক
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

    // ✅ IMAGE FIX: যদি নতুন ফাইল না থাকে, অরিজিনাল পাথ পাঠিয়ে দাও
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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6 bg-[#fcfcfc] dark:bg-black min-h-screen pb-24">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="max-w-7xl mx-auto space-y-12">
          {/* SECTION 1: GENERAL INFO */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Package className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                General Info
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FXInput
                label="Full Name"
                name="name"
                defaultValue={selectedTire?.name}
              />
              <FXInput
                label="Product Line"
                name="productLine"
                defaultValue={selectedTire?.productLine}
              />
              <FXInput
                label="Unit Name (e.g. Each)"
                name="unitName"
                defaultValue={selectedTire?.unitName}
              />
              <FXInput
                label="Condition (New/Used)"
                name="conditionInfo"
                defaultValue={selectedTire?.conditionInfo}
              />
              <FXInput
                label="Warranty Policy"
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

          {/* SECTION 2: PRICING & STOCK */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm border-l-8 border-l-rose-600">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-rose-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Pricing & Inventory
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <FXInput
                label="Retail Price"
                name="price"
                type="number"
                defaultValue={selectedTire?.price}
              />
              <FXInput
                label="Promo Price"
                name="discountPrice"
                type="number"
                defaultValue={selectedTire?.discountPrice}
              />
              <FXInput
                label="2-Set Deal"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.twoSetDiscountPrice}
              />
              <FXInput
                label="4-Set Deal"
                name="fourSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.fourSetDiscountPrice}
              />
              <FXInput
                label="Stock Count"
                name="stockQuantity"
                type="number"
                defaultValue={selectedTire?.stockQuantity}
              />
            </div>
          </div>

          {/* SECTION 3: PERFORMANCE DROPDOWNS */}
          <div className="bg-[#f8f9fb] dark:bg-[#1a1d23] p-8 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Performance Selectors
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

          {/* SECTION 4: TECHNICAL SPECS & RANGES */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="text-orange-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-orange-600">
                Track Specs & Ranges
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* String Ranges */}
              <FXInput
                label="Gross Weight Range"
                name="grossWeightRange"
                defaultValue={selectedTire?.grossWeightRange}
              />
              <FXInput
                label="GTIN"
                name="gtinRange"
                defaultValue={selectedTire?.gtinRange}
              />
              <FXInput
                label="Load Index Range"
                name="loadIndexRange"
                defaultValue={selectedTire?.loadIndexRange}
              />
              <FXInput
                label="Mileage Warranty"
                name="mileageWarrantyRange"
                defaultValue={selectedTire?.mileageWarrantyRange}
              />
              <FXInput
                label="Max PSI Range"
                name="maxAirPressureRange"
                defaultValue={selectedTire?.maxAirPressureRange}
              />
              <FXInput
                label="Speed Rating Range"
                name="speedRatingRange"
                defaultValue={selectedTire?.speedRatingRange}
              />
              <FXInput
                label="Traction Grade"
                name="tractionGradeRange"
                defaultValue={selectedTire?.tractionGradeRange}
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

              {/* Numeric Specs */}
              <FXInput
                label="Section Width (mm)"
                name="sectionWidth"
                type="number"
                defaultValue={selectedTire?.sectionWidth}
              />
              <FXInput
                label="Overall Diameter (in)"
                name="overallDiameter"
                type="number"
                defaultValue={selectedTire?.overallDiameter}
              />
              <FXInput
                label="Max PSI (Number)"
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
            </div>
          </div>

          {/* SECTION 5: VISUAL ASSETS */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-purple-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Product Images
              </h2>
            </div>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-[32px] cursor-pointer bg-gray-50 dark:bg-black/20 hover:bg-blue-50 transition-all border-gray-200">
              <UploadCloud
                size={40}
                className="text-gray-400 mb-2"
              />
              <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
                Add New Assets
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
                    onClick={() => {
                      setImagePreviews((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                      setImageFiles((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
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

// ✅ ড্রপডাউন সিলেক্ট কম্পোনেন্টগুলো (সবগুলোই রাখা হয়েছে)
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
