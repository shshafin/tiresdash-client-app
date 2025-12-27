"use client";
import { useUser } from "@/src/context/user.provider";
import {
  useClearCart,
  useGetCartByUserId,
  useRemoveItemFromCart,
  useUpdateCartItem,
  useUpdateCartItemServices,
} from "@/src/hooks/cart.hook";
import { ITire, IWheel } from "@/src/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { useQueryClient } from "@tanstack/react-query";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// --- Types ---
interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: any; // Using any to handle varying tire/wheel structures
  availableStock: number;
  installationService?: string;
  installationFee?: number;
  addonServices?: Array<{ name: string; price: number; _id: string }>;
  addonPrice?: number;
}

interface SelectedServices {
  [productId: string]: {
    installation: boolean;
    addonServices: string[]; // Stores indices for UI checkbox state
  };
}

const CartPage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { data, isLoading, isError } = useGetCartByUserId(user?._id);
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

  const { mutate: updateServices } = useUpdateCartItemServices({
    userId: user?._id,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
    },
  });

  const { mutate: handleRemoveItemFromCart, isPending: removeFromCartPending } =
    useRemoveItemFromCart({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
        toast.success("Item removed");
      },
      userId: user?._id,
    });

  const { mutate: handleUpdateCartItem, isPending: updateCartItemPending } =
    useUpdateCartItem({ userId: user?._id });

  const { mutate: handleClearCart, isPending: clearCartPending } = useClearCart(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
        toast.success("Cart cleared");
      },
      userId: user?._id,
    }
  );

  // ✅ FIXED: Robust Sync Logic to ensure IDs are sent
  const syncServicesToBackend = useCallback(
    (productId: string, productType: string, currentSelections: any) => {
      const item = cartItems.find((i: CartItem) => i.product === productId);
      if (!item) return;

      // Map UI indices to actual DB _ids
      const selectedAddonIds = currentSelections.addonServices
        .map((idxStr: string) => {
          const index = parseInt(idxStr);
          return item.productDetails?.addonServices?.[index]?._id;
        })
        .filter(Boolean);

      console.log("📡 SYNCING TO BACKEND:", {
        productId,
        installation: currentSelections.installation,
        addonIds: selectedAddonIds,
      });

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

  // Initialize state from backend data
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

  // Calculate local total for immediate UI feedback
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

  const handleInstallationToggle = (productId: string, productType: string) => {
    const current = selectedServices[productId] || {
      installation: false,
      addonServices: [],
    };
    const updatedItem = { ...current, installation: !current.installation };

    setSelectedServices((prev) => ({ ...prev, [productId]: updatedItem }));
    syncServicesToBackend(productId, productType, updatedItem);
  };

  const handleAddonServiceToggle = (
    productId: string,
    productType: string,
    index: number
  ) => {
    const current = selectedServices[productId] || {
      installation: false,
      addonServices: [],
    };
    const idxStr = index.toString();
    const newAddons = current.addonServices.includes(idxStr)
      ? current.addonServices.filter((i) => i !== idxStr)
      : [...current.addonServices, idxStr];

    const updatedItem = { ...current, addonServices: newAddons };

    setSelectedServices((prev) => ({ ...prev, [productId]: updatedItem }));
    syncServicesToBackend(productId, productType, updatedItem);
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin h-10 w-10 text-rose-500" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Your Shopping Cart
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-gray-100 dark:border-gray-800">
            <CardBody className="p-0 divide-y divide-gray-100 dark:divide-gray-800">
              {cartItems.map((item: CartItem, idx: number) => (
                <div
                  key={idx}
                  className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="relative w-full sm:w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border dark:border-gray-700">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                          {item.name}
                        </h3>
                        <p className="font-bold text-rose-600 dark:text-rose-400">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border dark:border-gray-700">
                          <Button
                            size="sm"
                            variant="flat"
                            isIconOnly
                            onClick={() =>
                              handleUpdateCartItem({
                                productId: item.product,
                                productType: item.productType,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            disabled={item.quantity <= 1}>
                            <Minus size={14} />
                          </Button>
                          <span className="w-6 text-center font-bold">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="flat"
                            isIconOnly
                            onClick={() =>
                              handleUpdateCartItem({
                                productId: item.product,
                                productType: item.productType,
                                quantity: item.quantity + 1,
                              })
                            }
                            disabled={item.quantity >= item.availableStock}>
                            <Plus size={14} />
                          </Button>
                        </div>
                        <Button
                          variant="light"
                          color="danger"
                          size="sm"
                          onClick={() =>
                            handleRemoveItemFromCart({
                              productId: item.product,
                              productType: item.productType,
                            })
                          }>
                          <Trash2 size={16} /> Remove
                        </Button>
                      </div>

                      {/* Services Selection Section */}
                      <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3 border dark:border-gray-800">
                        {item.productDetails?.installationPrice > 0 && (
                          <Checkbox
                            color="secondary"
                            isSelected={
                              selectedServices[item.product]?.installation
                            }
                            onValueChange={() =>
                              handleInstallationToggle(
                                item.product,
                                item.productType
                              )
                            }>
                            <span className="text-sm">
                              Standard Installation (+$
                              {item.productDetails.installationPrice}/unit)
                            </span>
                          </Checkbox>
                        )}
                        {item.productDetails?.addonServices?.map(
                          (service: any, sIdx: number) => (
                            <Checkbox
                              key={sIdx}
                              color="secondary"
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
                              <span className="text-sm">
                                {service.name} (+${service.price}/unit)
                              </span>
                            </Checkbox>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 border-2 border-rose-500/10 dark:bg-zinc-900">
            <CardHeader className="p-0 mb-4 font-bold text-xl">
              Order Summary
            </CardHeader>
            <CardBody className="p-0 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>Base Total ({totalItems} items)</span>
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
              <div className="flex justify-between font-bold text-xl pt-4 border-t dark:border-gray-800">
                <span>Final Total</span>
                <span className="text-rose-600 dark:text-rose-400">
                  ${calculatedTotal.toFixed(2)}
                </span>
              </div>
            </CardBody>
            <CardFooter className="p-0 mt-6">
              <Button
                color="secondary"
                size="lg"
                className="w-full font-bold shadow-lg shadow-rose-500/20"
                onClick={() =>
                  router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`)
                }>
                Checkout Now <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
