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
  Settings,
  Image as ImageIcon,
  Ruler,
  Layers,
} from "lucide-react";
import { Divider } from "@heroui/divider";
import { useGetYears } from "@/src/hooks/years.hook";
import { useGetTrims } from "@/src/hooks/trim.hook";
import { useGetModels } from "@/src/hooks/model.hook";
import { useGetMakes } from "@/src/hooks/makes.hook";
import { useGetTyreSizes } from "@/src/hooks/tyreSize.hook";
import { useGetCategories } from "@/src/hooks/categories.hook";
import { useGetBrands } from "@/src/hooks/brand.hook";
import { useGetSingleWheel, useUpdateWheel } from "@/src/hooks/wheel.hook";
import { useGetDrivingTypes } from "@/src/hooks/drivingTypes.hook";
import { DataError, DataLoading } from "../../_components/DataFetchingStates";
import { useGetWheelWidthTypes } from "@/src/hooks/wheelWhidthType";
import { useGetWheelDiameters } from "@/src/hooks/wheelDiameter.hook";
import { useGetWheelRatios } from "@/src/hooks/wheelRatio.hook";
import { useGetWheelWidths } from "@/src/hooks/wheelWidth.hook";
import { useGetVehicleTypes } from "@/src/hooks/vehicleType.hook";
import { envConfig } from "@/src/config/envConfig";

export default function UpdateWheelPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = useQueryClient();
  const methods = useForm();
  const { handleSubmit } = methods;
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [addonServices, setAddonServices] = useState<any[]>([]);

  const { data: dataW, isPending, isError } = useGetSingleWheel(params.id);
  const selectedWheel = dataW?.data;

  const { mutate: handleUpdateWheel, isPending: updatePending } =
    useUpdateWheel({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_WHEELS"] });
        toast.success("Sync Complete: Data & Assets Updated!");
      },
      id: params.id,
    });

  useEffect(() => {
    if (selectedWheel) {
      if (selectedWheel.addonServices)
        setAddonServices(selectedWheel.addonServices);
      if (selectedWheel.images) {
        const previews = selectedWheel.images.map((img: string) =>
          img.startsWith("/storage") ? `${envConfig.base_url}${img}` : img
        );
        setImagePreviews(previews);
      }
    }
  }, [selectedWheel]);

  const onEditSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();

    // ✅ IMAGE SYNC FIX: ডিলিট করা ইমেজগুলো বাদ দিয়ে অরিজিনাল পাথ নাও
    const remainingOldImages = imagePreviews
      .filter((src) => src.includes("/storage"))
      .map((src) => src.replace(envConfig.base_url as string, ""));

    // ✅ NULL HANDLING FIX: ফিল্ড খালি করলে null যাবে যাতে ডাটাবেস আপডেট হয়
    const toNum = (val: any) =>
      val === "" || val === undefined || val === null ? null : Number(val);

    const wheelData: any = {
      ...data,
      // ড্রপডাউন রিলেশনস
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

      images: remainingOldImages, // ডিলিটেড বাদে বাকিগুলো

      // সব নাম্বার ফিল্ডস (Interface mapping)
      price: toNum(data.price),
      discountPrice: toNum(data.discountPrice),
      twoSetDiscountPrice: toNum(data.twoSetDiscountPrice),
      fourSetDiscountPrice: toNum(data.fourSetDiscountPrice),
      stockQuantity: toNum(data.stockQuantity),
      rimWidth: toNum(data.rimWidth),
      offset: toNum(data.offset),
      hubBoreSize: toNum(data.hubBoreSize),
      numberOFBolts: toNum(data.numberOFBolts),
      loadCapacity: toNum(data.loadCapacity),
      loadRating: toNum(data.loadRating),
      installationPrice: toNum(data.installationPrice),

      productLine: data.productLine
        ? [data.productLine]
        : selectedWheel?.productLine,
      addonServices: addonServices.filter((s) => s.name?.trim() !== ""),
    };

    formData.append("data", JSON.stringify(wheelData));
    if (imageFiles.length > 0) {
      imageFiles.forEach((image) => formData.append("images", image));
    }
    handleUpdateWheel(formData);
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
          {/* SECTION 1: PRICE & STOCK (Critical Fixes) */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm border-l-8 border-l-rose-600">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="text-rose-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Pricing & Inventory
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FXInput
                label="Name"
                name="name"
                defaultValue={selectedWheel?.name}
              />
              <FXInput
                label="Retail Price"
                name="price"
                type="number"
                defaultValue={selectedWheel?.price}
              />
              <FXInput
                label="Promo Price"
                name="discountPrice"
                type="number"
                defaultValue={selectedWheel?.discountPrice}
              />
              <FXInput
                label="2 Set Deal (Clear to Disable)"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedWheel?.twoSetDiscountPrice}
              />
              <FXInput
                label="4 Set Deal (Clear to Disable)"
                name="fourSetDiscountPrice"
                type="number"
                defaultValue={selectedWheel?.fourSetDiscountPrice}
              />
              <FXInput
                label="Current Stock"
                name="stockQuantity"
                type="number"
                defaultValue={selectedWheel?.stockQuantity}
              />
            </div>
          </div>

          {/* SECTION 2: GLOBAL CONFIGURATORS */}
          <div className="bg-[#f8f9fb] dark:bg-[#1a1d23] p-8 rounded-[40px] border border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Base Selectors
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            </div>
          </div>

          {/* SECTION 3: TECHNICAL PERFORMANCE ATTRIBUTES (All Fields) */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Gauge className="text-orange-600" />
              <h2 className="text-2xl font-black uppercase italic text-orange-600">
                Performance Specs
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FXInput
                label="GTIN"
                name="GTIN"
                defaultValue={selectedWheel?.GTIN}
              />
              <FXInput
                label="Bolt Pattern"
                name="boltPattern"
                defaultValue={selectedWheel?.boltPattern}
              />
              <FXInput
                label="No. of Bolts (Number)"
                name="numberOFBolts"
                type="number"
                defaultValue={selectedWheel?.numberOFBolts}
              />
              <FXInput
                label="Hub Bore Size (Num)"
                name="hubBoreSize"
                type="number"
                defaultValue={selectedWheel?.hubBoreSize}
              />
              <FXInput
                label="Rim Width (Number)"
                name="rimWidth"
                type="number"
                defaultValue={selectedWheel?.rimWidth}
              />
              <FXInput
                label="Offset (Number)"
                name="offset"
                type="number"
                defaultValue={selectedWheel?.offset}
              />
              <FXInput
                label="Load Rating (Num)"
                name="loadRating"
                type="number"
                defaultValue={selectedWheel?.loadRating}
              />
              <FXInput
                label="Load Capacity (Num)"
                name="loadCapacity"
                type="number"
                defaultValue={selectedWheel?.loadCapacity}
              />
              <FXInput
                label="Finish Description"
                name="finish"
                defaultValue={selectedWheel?.finish}
              />
              <FXInput
                label="Material Type"
                name="materialType"
                defaultValue={selectedWheel?.materialType}
              />
              <FXInput
                label="Construction Type"
                name="constructionType"
                defaultValue={selectedWheel?.constructionType}
              />
              <FXInput
                label="Wheel Type"
                name="wheelType"
                defaultValue={selectedWheel?.wheelType}
              />
            </div>
          </div>

          {/* SECTION 4: PHYSICAL DIMENSIONS & ADDITIONAL INFO */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm border-l-8 border-l-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <Layers className="text-blue-600" />
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                Design Details
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FXInput
                label="Wheel Color"
                name="wheelColor"
                defaultValue={selectedWheel?.wheelColor}
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
                label="Hub Bore (Str)"
                name="hubBore"
                defaultValue={selectedWheel?.hubBore}
              />
              <FXInput
                label="ATV Offset (Str)"
                name="ATVOffset"
                defaultValue={selectedWheel?.ATVOffset}
              />
              <FXInput
                label="Bolts Quantity (Str)"
                name="BoltsQuantity"
                defaultValue={selectedWheel?.BoltsQuantity}
              />
              <FXInput
                label="Gross Weight"
                name="grossWeight"
                defaultValue={selectedWheel?.grossWeight}
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
              <FXInput
                label="Product Line"
                name="productLine"
                defaultValue={selectedWheel?.productLine?.[0]}
              />
              <FXInput
                label="Warranty"
                name="warranty"
                defaultValue={selectedWheel?.warranty}
              />
              <FXInput
                label="Description"
                name="description"
                defaultValue={selectedWheel?.description}
              />
            </div>
          </div>

          {/* SECTION 5: VISUAL ASSETS */}
          <div className="bg-white dark:bg-[#0f1115] p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-purple-600" />
              <h2 className="text-2xl font-black uppercase italic">
                Visual Gallery
              </h2>
            </div>
            <label
              htmlFor="images"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-[32px] cursor-pointer bg-gray-50 dark:bg-black/20 hover:bg-blue-50 transition-all border-gray-200">
              <UploadCloud
                size={30}
                className="text-gray-400 mb-1"
              />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center px-4">
                Click to add assets
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
            isLoading={updatePending}>
            Confirm and Sync Wheel Records
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

// ✅ ড্রপডাউন সিলেক্ট কম্পোনেন্টগুলো (নিচে কমপ্লিট দেওয়া হলো)

const MakeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: makes } = useGetMakes({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("make")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const DrivingTypeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: drivingType } = useGetDrivingTypes();
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("drivingType")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
      <option value="">Driving Types</option>
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

const CategorySelectForWheel = ({ defaultValue, register }: any) => {
  const { data: category } = useGetCategories(undefined);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("category")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const YearSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: year } = useGetYears({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("year")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const BrandSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: brand } = useGetBrands({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("brand")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const ModelSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: model } = useGetModels({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("model")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const TyreSizeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: tireSize } = useGetTyreSizes({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("tireSize")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const TrimSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: trim } = useGetTrims({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("trim")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const VehicleSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: vehicleType } = useGetVehicleTypes({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("vehicleType")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const WidthSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: width } = useGetWheelWidths({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("width")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
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

const RatioSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: ratio } = useGetWheelRatios({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("ratio")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
      <option value="">Ratio</option>
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

const DiameterSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: diameter } = useGetWheelDiameters({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("diameter")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
      <option value="">Diameter</option>
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

const WidthTypeSelectForWheel = ({ defaultValue, register }: any) => {
  const { data: widthType } = useGetWheelWidthTypes({});
  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (defaultValue?._id) setSelected(defaultValue._id);
  }, [defaultValue]);
  return (
    <select
      {...register("widthType")}
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="w-full border-2 border-[#71717ab3] bg-default-50 rounded-lg px-2 py-3.5 text-xs font-bold uppercase">
      <option value="">Width Type</option>
      {widthType?.data?.map((m: any) => (
        <option
          key={m?._id}
          value={m?._id}>
          {m?.widthType}
        </option>
      ))}
    </select>
  );
};
