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
  Package,
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
  installationFee?: number;
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
      toast.success("Item removed from cart");
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
        const backendAddons = item.addonService || [];
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

  // ✅ Calculation Fix: Logic to update local state prices correctly
  useEffect(() => {
    let total = 0;
    cartItems.forEach((item: CartItem) => {
      total += item.price * item.quantity;
      const selections = selectedServices[item.product];
      if (selections?.installation) {
        total += (item.productDetails?.installationPrice || 0) * item.quantity;
      }
      selections?.addonServices?.forEach((idx) => {
        const price =
          item.productDetails?.addonServices?.[parseInt(idx)]?.price || 0;
        total += price * item.quantity;
      });
    });
    setCalculatedTotal(total || totalPrice);
  }, [cartItems, selectedServices, totalPrice]);

  if (isLoading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center px-4">
        <div className="p-6 bg-pink-50 rounded-full">
          <ShoppingBag
            size={40}
            className="text-pink-300"
          />
        </div>
        <h2 className="text-xl font-black uppercase">Your Bag is Empty</h2>
        <Button
          color="secondary"
          radius="full"
          onPress={() => router.push("/")}>
          Start Shopping
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16 max-w-7xl">
      <div className="flex flex-col gap-4 mb-8 sm:mb-12 border-b border-gray-100 pb-6 sm:pb-8">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-gray-900 uppercase">
          Cart
        </h1>
        <div className="flex items-center gap-2 text-blue-500 font-bold text-xs sm:text-sm bg-blue-50 w-fit px-4 py-1.5 rounded-full">
          <Package size={16} />{" "}
          <span>Your items are eligible for shipping</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Side: Items */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          {cartItems.map((item: CartItem, idx: number) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row gap-6 p-4 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative w-full sm:w-40 h-40 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div className="flex-grow space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-black text-lg sm:text-xl text-gray-800 uppercase leading-tight tracking-tight">
                    {item.name}
                  </h3>
                  <button
                    onClick={() =>
                      handleRemoveItemFromCart({
                        productId: item.product,
                        productType: item.productType,
                      })
                    }
                    className="text-rose-500 hover:text-rose-700 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:gap-10">
                  <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                    <button
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
                      <Minus size={14} />
                    </button>
                    <span className="font-black text-base w-4 text-center">
                      {activeUpdateId === item.product ? (
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                      ) : (
                        item.quantity
                      )}
                    </span>
                    <button
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
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="text-xl font-black tracking-tighter">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                  {item.productDetails?.installationPrice > 0 && (
                    <div
                      className={`p-3 rounded-xl border-2 transition-all ${selectedServices[item.product]?.installation ? "border-secondary bg-pink-50/20" : "border-gray-50 bg-gray-50/30"}`}>
                      <Checkbox
                        color="secondary"
                        size="sm"
                        isSelected={
                          selectedServices[item.product]?.installation
                        }
                        onValueChange={() =>
                          handleInstallationToggle(
                            item.product,
                            item.productType
                          )
                        }>
                        <span className="text-[11px] font-bold uppercase">
                          Installation (+$
                          {item.productDetails.installationPrice})
                        </span>
                      </Checkbox>
                    </div>
                  )}
                  {item.productDetails?.addonServices?.length > 0 && (
                    <div className="p-3 rounded-xl border border-gray-100 bg-gray-50/30 space-y-2">
                      {item.productDetails.addonServices.map(
                        (service: any, sIdx: number) => (
                          <Checkbox
                            key={sIdx}
                            color="secondary"
                            size="sm"
                            isSelected={selectedServices[
                              item.product
                            ]?.addonServices?.includes(sIdx.toString())}
                            onValueChange={() =>
                              handleAddonServiceToggle(
                                item.product,
                                item.productType,
                                sIdx
                              )
                            }>
                            <span className="text-[10px] font-bold uppercase">
                              {service.name} (+${service.price})
                            </span>
                          </Checkbox>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Summary Card */}
        <div className="lg:col-span-4 w-full">
          <Card className="p-6 sm:p-8 border-none shadow-2xl shadow-gray-200 bg-white rounded-3xl sm:rounded-[40px] sticky top-6">
            <CardHeader className="p-0 mb-6 flex flex-col items-center">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-widest">
                Summary
              </h2>
            </CardHeader>
            <CardBody className="p-0 space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                  <span>Products</span>
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

                {/* Fixed Fee Calculation Logic */}
                <div className="flex justify-between text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                  <span>Expert Fitment</span>
                  <span className="text-secondary">
                    +$
                    {cartItems
                      .reduce(
                        (acc, item) =>
                          acc +
                          (selectedServices[item.product]?.installation
                            ? (item.productDetails?.installationPrice || 0) *
                              item.quantity
                            : 0),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-400 text-[11px] sm:text-xs font-black uppercase tracking-widest">
                  <span>Premium Add-ons</span>
                  <span className="text-secondary">
                    +$
                    {cartItems
                      .reduce((acc, item) => {
                        const itemAddons =
                          selectedServices[item.product]?.addonServices || [];
                        const addonSum = itemAddons.reduce(
                          (sum, idx) =>
                            sum +
                            (item.productDetails?.addonServices?.[parseInt(idx)]
                              ?.price || 0),
                          0
                        );
                        return acc + addonSum * item.quantity;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-dashed border-gray-100 flex flex-col items-center gap-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-300">
                  Total Price
                </span>
                <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter">
                  ${calculatedTotal.toFixed(2)}
                </span>
              </div>
            </CardBody>
            <CardFooter className="p-0 mt-6">
              <button
                onClick={() =>
                  router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`)
                }
                className="w-full h-14 sm:h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl sm:rounded-3xl flex items-center justify-center gap-3 text-white font-black uppercase tracking-widest text-sm sm:text-base shadow-[0_15px_30px_-10px_rgba(225,29,72,0.4)] active:scale-95 transition-all">
                Checkout Now <ArrowRight size={18} />
              </button>
            </CardFooter>
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-300">
              <ShieldCheck size={14} />
              <span className="text-[9px] uppercase font-black tracking-widest">
                Secure Checkout
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
