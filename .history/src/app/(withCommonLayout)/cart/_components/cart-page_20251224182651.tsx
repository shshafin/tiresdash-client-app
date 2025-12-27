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

interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: ITire | IWheel;
  availableStock: number;
  installationService?: string;
  installationFee?: number;
  addonServices?: Array<{ name: string; price: number; _id: string }>;
  addonPrice?: number;
}

interface SelectedServices {
  [productId: string]: {
    installation: boolean;
    addonServices: string[]; // Store indices for UI checkboxes
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

  // Sync with Backend
  // ✅ Improved Sync Logic
  const syncServicesToBackend = useCallback(
    (productId: string, productType: string, selections: any) => {
      // 1. Find the specific item in the cartItems array
      const item = cartItems.find((i: CartItem) => i.product === productId);
      if (!item || !item.productDetails?.addonServices) return;

      // 2. Map the selected indices back to actual Database IDs
      const selectedAddonIds = selections.addonServices
        .map((idxStr: string) => {
          const index = parseInt(idxStr);
          const service = item.productDetails.addonServices?.[index];
          return service?._id; // This is the MongoDB ID (e.g., '694593fce...')
        })
        .filter(Boolean); // Remove any undefined values

      console.log("📡 Syncing to backend:", {
        productId,
        hasInstallation: selections.installation,
        addons: selectedAddonIds,
      });

      // 3. Send to API
      updateServices({
        productId,
        productType,
        selectedServices: {
          installation: selections.installation,
          addonServices: selectedAddonIds, // Now passing REAL IDs
        },
      });
    },
    [cartItems, updateServices]
  );

  // Initial load from backend data
  useEffect(() => {
    if (cartItems?.length > 0) {
      const initialServices: SelectedServices = {};
      cartItems.forEach((item: CartItem) => {
        const hasInstallation = (item.installationFee || 0) > 0;
        const backendAddons = item.addonServices || [];
        const indices: string[] = [];

        item.productDetails.addonServices?.forEach(
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

  // Local Total Calculation
  useEffect(() => {
    let total = 0;
    cartItems.forEach((item: CartItem) => {
      total += item.price * item.quantity;
      const selections = selectedServices[item.product];
      if (selections?.installation) {
        total += (item.productDetails.installationPrice || 0) * item.quantity;
      }
      selections?.addonServices.forEach((idx) => {
        const price =
          item.productDetails.addonServices?.[parseInt(idx)]?.price || 0;
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

  const handleProceedToCheckout = () => {
    router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`);
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5 rounded">
            <CardHeader className="font-bold">
              Items ({cartItems.length})
            </CardHeader>
            <CardBody className="grid gap-6">
              {cartItems.map((item: CartItem, idx: number) => (
                <div
                  key={idx}
                  className="border-b pb-6 last:border-0">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                    <div className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <Button
                          size="sm"
                          isIconOnly
                          onClick={() =>
                            handleUpdateCartItem({
                              productId: item.product,
                              productType: item.productType,
                              quantity: Math.max(1, item.quantity - 1),
                            })
                          }
                          disabled={item.quantity <= 1}>
                          <Minus size={16} />
                        </Button>
                        <span className="font-bold">{item.quantity}</span>
                        <Button
                          size="sm"
                          isIconOnly
                          onClick={() =>
                            handleUpdateCartItem({
                              productId: item.product,
                              productType: item.productType,
                              quantity: item.quantity + 1,
                            })
                          }
                          disabled={item.quantity >= item.availableStock}>
                          <Plus size={16} />
                        </Button>
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

                      {/* Service Selections */}
                      <div className="mt-4 space-y-3">
                        {item.productDetails.installationPrice && (
                          <Checkbox
                            isSelected={
                              selectedServices[item.product]?.installation
                            }
                            onValueChange={() =>
                              handleInstallationToggle(
                                item.product,
                                item.productType
                              )
                            }>
                            Installation Service (+$
                            {item.productDetails.installationPrice}/ea)
                          </Checkbox>
                        )}
                        {item.productDetails.addonServices?.map(
                          (service, sIdx) => (
                            <Checkbox
                              key={sIdx}
                              isSelected={selectedServices[
                                item.product
                              ]?.addonServices.includes(sIdx.toString())}
                              onValueChange={() =>
                                handleAddonServiceToggle(
                                  item.product,
                                  item.productType,
                                  sIdx
                                )
                              }>
                              {service.name} (+${service.price}/ea)
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

        {/* Summary Sidebar */}
        <div>
          <Card className="p-5 border-2 border-rose-500/20">
            <CardHeader className="font-bold text-xl">Order Summary</CardHeader>
            <CardBody className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-black text-2xl text-rose-600">
                <span>Total</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                color="secondary"
                size="lg"
                className="w-full font-bold"
                onClick={handleProceedToCheckout}>
                Proceed to Checkout <ArrowRight className="ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
