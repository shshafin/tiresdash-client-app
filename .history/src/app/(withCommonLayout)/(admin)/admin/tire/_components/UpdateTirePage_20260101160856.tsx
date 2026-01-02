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
        toast.success("Tire updated successfully");
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
      (s) => s.name?.trim() !== "" && (s.price || 0) > 0
    );

    // ✅ মিশন: ইমেজ এবং ডিসকাউন্ট প্রোটেকশনসহ ফুল ডাটা অবজেক্ট
    const tireData: any = {
      ...data,
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

      // নাম্বার কনভার্সন ফিক্স
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

      // স্পেকস নাম্বারস
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

      addonServices: validAddonServices,
    };

    // ✅ ইমেজ হারিয়ে যাওয়া রোধ করার লজিক
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

  if (isPending) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="max-w-7xl mx-auto space-y-10 p-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">General Information</h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FXInput
                label="Name"
                name="name"
                defaultValue={selectedTire?.name}
              />
              <FXInput
                label="Description"
                name="description"
                defaultValue={selectedTire?.description}
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
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">
              Tire Specifications & Selects
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <h2 className="text-2xl font-semibold text-rose-600">
              Pricing & Bulk Discount
            </h2>
            <Divider />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                label="Two Set Price"
                name="twoSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.twoSetDiscountPrice}
              />
              <FXInput
                label="Four Set Price"
                name="fourSetDiscountPrice"
                type="number"
                defaultValue={selectedTire?.fourSetDiscountPrice}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Images</h2>
            <Divider />
            <label
              htmlFor="images"
              className="flex h-20 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all">
              <UploadCloud /> <span>Click to upload images</span>
              <input
                multiple
                className="hidden"
                id="images"
                type="file"
                onChange={handleImageChange}
              />
            </label>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={index}
                  className="relative size-24 border rounded-lg overflow-hidden group">
                  <img
                    src={src}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-rose-600 text-white h-14 font-bold"
            isLoading={updateTirePending}>
            UPDATE TIRE DATA
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

// ✅ ড্রপডাউন কম্পোনেন্টগুলো (সবগুলো এখানে রাখলাম যাতে কোনোটা মিস না হয়)

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
