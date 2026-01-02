"use client";
import { useUser } from "@/src/context/user.provider";
import {
  useGetCartByUserId,
  useRemoveItemFromCart,
  useUpdateCartItem,
  useUpdateCartItemServices,
} from "@/src/hooks/cart.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Loader2,
  ShoppingBag,
  Wrench,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Tags,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";

// --- Types ---
interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: any;
  availableStock: number;
  installationService?: string;
  installationFee?: number;
  addonServices?: Array<{ name: string; price: number; _id: string }>;
  addonPrice?: number;
}

interface SelectedServices {
  [productId: string]: {
    installation: boolean;
    addonServices: string[];
  };
}

const CartPage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { data, isLoading } = useGetCartByUserId(user?._id);
  const router = useRouter();

  const {
    items: cartItems = [],
    totalItems = 0,
    totalPrice = 0,
  } = data?.data || {};

  const [selectedServices, setSelectedServices] = useState<SelectedServices>(
    {}
  );
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null);

  const { mutate: updateServices } = useUpdateCartItemServices({
    userId: user?._id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["GET_CART"] }),
  });

  const { mutate: handleRemoveItemFromCart } = useRemoveItemFromCart({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
      toast.success("Successfully removed from cart");
    },
    userId: user?._id,
  });

  const { mutate: handleUpdateCartItem } = useUpdateCartItem({
    userId: user?._id,
    onSuccess: () => {
      setActiveUpdateId(null);
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
    },
  });

  const syncServicesToBackend = useCallback(
    (productId: string, productType: string, currentSelections: any) => {
      const item = cartItems.find((i: CartItem) => i.product === productId);
      if (!item) return;

      const selectedAddonIds = currentSelections.addonServices
        .map((idxStr: string) => {
          const index = parseInt(idxStr);
          return item.productDetails?.addonServices?.[index]?._id;
        })
        .filter(Boolean);

      updateServices({
        productId,
        productType,
        selectedServices: {
          installation: currentSelections.installation,
          addonServices: selectedAddonIds,
        },
      });
    },
    [cartItems, updateServices]
  );

  useEffect(() => {
    if (cartItems?.length > 0) {
      const initialServices: SelectedServices = {};
      cartItems.forEach((item: CartItem) => {
        const hasInstallation = (item.installationFee || 0) > 0;
        const backendAddons = item.addonServices || [];
        const indices: string[] = [];

        item.productDetails?.addonServices?.forEach(
          (service: any, index: number) => {
            if (backendAddons.some((ba: any) => ba._id === service._id)) {
              indices.push(index.toString());
            }
          }
        );

        initialServices[item.product] = {
          installation: hasInstallation,
          addonServices: indices,
        };
      });
      setSelectedServices(initialServices);
    }
  }, [cartItems]);
  useEffect(() => {
    // যেহেতু তোর ব্যাকএন্ড অলরেডি (price * quantity) + (services * quantity) ক্যালকুলেট করে totalPrice পাঠায়,
    // তাই ফ্রন্টএন্ডে আলাদা করে লুপ চালানোর দরকার নেই।
    if (totalPrice !== undefined) {
      setCalculatedTotal(totalPrice);
    }
  }, [totalPrice]); // শুধু totalPrice চেঞ্জ হলেই এটা আপডেট হবে

  if (isLoading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner
          size="lg"
          color="secondary"
          label="Joyfully building your cart..."
        />
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="p-8 bg-pink-50 rounded-full">
          <ShoppingBag
            size={48}
            className="text-pink-300"
          />
        </div>
        <h2 className="text-2xl font-black">YOUR CART IS EMPTY</h2>
        <Button
          color="secondary"
          variant="shadow"
          radius="full"
          size="lg"
          onClick={() => router.push("/")}>
          Start Shopping
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-12 border-b-2 border-gray-100 pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">
            Shopping Bag
          </h1>
          <p className="text-gray-400 font-bold tracking-widest text-sm mt-2">
            {totalItems} PREMIUM ITEMS IN YOUR COLLECTION
          </p>
        </div>
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full">
          <CheckCircle2 size={16} />{" "}
          <span>Your items are eligible for free shipping</span>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          {cartItems.map((item: CartItem, idx: number) => (
            <div
              key={idx}
              className="group relative flex flex-col md:flex-row gap-8 p-6 bg-white rounded-3xl border border-gray-100 transition-all hover:shadow-xl hover:border-pink-100">
              <div className="relative w-full md:w-52 h-52 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                  alt={item.name}
                  fill
                  className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-grow space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-2xl text-gray-800 uppercase leading-none tracking-tight">
                      {item.name}
                    </h3>

                    {/* ✅ BULK DISCOUNT INDICATORS */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded">
                        Unit: ${item.price.toFixed(2)}
                      </span>
                      {item.quantity >= 4 &&
                        item.productDetails?.fourSetDiscountPrice && (
                          <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <Tags size={10} /> 4-Set Offer Active
                          </span>
                        )}
                      {item.quantity >= 2 &&
                        item.quantity < 4 &&
                        item.productDetails?.twoSetDiscountPrice && (
                          <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <Tags size={10} /> 2-Set Offer Active
                          </span>
                        )}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleRemoveItemFromCart({
                        productId: item.product,
                        productType: item.productType,
                      })
                    }
                    className="text-gray-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 w-fit">
                    <button
                      className="disabled:opacity-20"
                      onClick={() => {
                        setActiveUpdateId(item.product);
                        handleUpdateCartItem({
                          productId: item.product,
                          productType: item.productType,
                          quantity: Math.max(1, item.quantity - 1),
                        });
                      }}
                      disabled={
                        item.quantity <= 1 || activeUpdateId === item.product
                      }>
                      <Minus size={16} />
                    </button>
                    <span className="font-black text-xl w-6 text-center">
                      {activeUpdateId === item.product ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
                      className="disabled:opacity-20"
                      onClick={() => {
                        setActiveUpdateId(item.product);
                        handleUpdateCartItem({
                          productId: item.product,
                          productType: item.productType,
                          quantity: item.quantity + 1,
                        });
                      }}
                      disabled={
                        item.quantity >= item.availableStock ||
                        activeUpdateId === item.product
                      }>
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* ✅ BULK ACTION SHORTCUTS */}
                  <div className="flex items-center gap-2">
                    {item.productDetails?.twoSetDiscountPrice &&
                      item.quantity !== 2 && (
                        <button
                          onClick={() => {
                            setActiveUpdateId(item.product);
                            handleUpdateCartItem({
                              productId: item.product,
                              productType: item.productType,
                              quantity: 2,
                            });
                          }}
                          className="text-[9px] font-black border-2 border-orange-100 text-orange-500 px-3 py-1.5 rounded-xl hover:bg-orange-50 transition-colors uppercase">
                          Get Pair (2)
                        </button>
                      )}
                    {item.productDetails?.fourSetDiscountPrice &&
                      item.quantity !== 4 && (
                        <button
                          onClick={() => {
                            setActiveUpdateId(item.product);
                            handleUpdateCartItem({
                              productId: item.product,
                              productType: item.productType,
                              quantity: 4,
                            });
                          }}
                          className="text-[9px] font-black border-2 border-emerald-100 text-emerald-500 px-3 py-1.5 rounded-xl hover:bg-emerald-50 transition-colors uppercase">
                          Get Set (4)
                        </button>
                      )}
                  </div>

                  <p className="text-2xl font-black tracking-tighter">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.productDetails?.installationPrice > 0 && (
                    <div
                      className={`p-4 rounded-2xl border-2 transition-all ${selectedServices[item.product]?.installation ? "border-secondary bg-pink-50/30" : "border-gray-50 bg-gray-50/50"}`}>
                      <div className="flex items-center gap-2 mb-3 text-secondary font-black text-[10px] uppercase tracking-widest">
                        <Wrench size={12} /> Installation
                      </div>
                      <Checkbox
                        color="secondary"
                        isSelected={
                          selectedServices[item.product]?.installation
                        }
                        onValueChange={() => {
                          const current = selectedServices[item.product] || {
                            installation: false,
                            addonServices: [],
                          };
                          const updatedItem = {
                            ...current,
                            installation: !current.installation,
                          };
                          setSelectedServices((prev) => ({
                            ...prev,
                            [item.product]: updatedItem,
                          }));
                          syncServicesToBackend(
                            item.product,
                            item.productType,
                            updatedItem
                          );
                        }}>
                        <span className="text-xs font-bold">
                          Add Expert Fitment (+$
                          {item.productDetails.installationPrice})
                        </span>
                      </Checkbox>
                    </div>
                  )}
                  {item.productDetails?.addonServices?.length > 0 && (
                    <div className="p-4 rounded-2xl border-2 border-gray-50 bg-gray-50/50">
                      <div className="flex items-center gap-2 mb-3 text-gray-400 font-black text-[10px] uppercase tracking-widest">
                        <PlusCircle size={12} /> Extra Services
                      </div>
                      <div className="space-y-2">
                        {item.productDetails.addonServices.map(
                          (service: any, sIdx: number) => (
                            <Checkbox
                              key={sIdx}
                              color="secondary"
                              size="sm"
                              isSelected={selectedServices[
                                item.product
                              ]?.addonServices?.includes(sIdx.toString())}
                              onValueChange={() => {
                                const current = selectedServices[
                                  item.product
                                ] || { installation: false, addonServices: [] };
                                const idxStr = sIdx.toString();
                                const newAddons =
                                  current.addonServices.includes(idxStr)
                                    ? current.addonServices.filter(
                                        (i) => i !== idxStr
                                      )
                                    : [...current.addonServices, idxStr];
                                const updatedItem = {
                                  ...current,
                                  addonServices: newAddons,
                                };
                                setSelectedServices((prev) => ({
                                  ...prev,
                                  [item.product]: updatedItem,
                                }));
                                syncServicesToBackend(
                                  item.product,
                                  item.productType,
                                  updatedItem
                                );
                              }}>
                              <span className="text-[10px] font-bold uppercase">
                                {service.name} (+${service.price})
                              </span>
                            </Checkbox>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <Card className="p-8 border-none shadow-2xl shadow-gray-200 bg-white rounded-[40px] sticky top-10">
            <CardHeader className="p-0 mb-8 flex flex-col items-center text-center">
              <div className="h-1 w-12 bg-gray-100 rounded-full mb-6"></div>
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">
                Summary
              </h2>
            </CardHeader>
            <CardBody className="p-0 space-y-6">
              <div className="space-y-4">
                {/* Base Products: Price * Quantity */}
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-tight">
                  <span>Base Products</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (s: number, i: CartItem) => s + i.price * i.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                {/* Service Breakdown: (Installation Fee * Quantity) */}
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-tight">
                  <span>Expert Fitment</span>
                  <span className="text-secondary">
                    +$
                    {cartItems
                      .reduce(
                        (acc: number, i: any) =>
                          acc + (i.installationFee || 0) * i.quantity, // ✅ Added * i.quantity
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                {/* Premium Add-ons: (Addon Price * Quantity) */}
                <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-tight">
                  <span>Premium Add-ons</span>
                  <span className="text-secondary">
                    +$
                    {cartItems
                      .reduce(
                        (acc: number, i: any) =>
                          acc + (i.addonPrice || 0) * i.quantity, // ✅ Added * i.quantity
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Total Amount Section */}
              <div className="pt-8 border-t-2 border-dashed border-gray-100">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                    Total Amount Due
                  </span>
                  <span className="text-6xl font-black text-gray-900 tracking-tighter">
                    ${calculatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Icons & Footer remains same... */}
            </CardBody>
            <CardFooter className="p-0 mt-4">
              <button
                onClick={() =>
                  router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`)
                }
                className="group relative w-full h-20 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 rounded-3xl flex items-center justify-center gap-4 text-white font-black uppercase tracking-widest shadow-[0_20px_40px_-15px_rgba(225,29,72,0.4)] active:scale-95">
                <span>Proceed to Checkout</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </CardFooter>
            <div className="mt-8 flex items-center justify-center gap-2 text-gray-300">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase font-black tracking-[0.2em]">
                100% Secure Transaction
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
