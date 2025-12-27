"use client";
import { useUser } from "@/src/context/user.provider";
import {
  useClearCart,
  useGetCartByUserId,
  useRemoveItemFromCart,
  useUpdateCartItem,
} from "@/src/hooks/cart.hook";
import { ITire, IWheel } from "@/src/types";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUpdateCartItemServices } from "@/src/hooks/cart.hook";
import { useRouter } from "next/navigation";

// Types for our cart data
interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: ITire | IWheel;
  availableStock: number;
}

interface SelectedServices {
  [productId: string]: {
    installation: boolean;
    addonServices: string[]; // array of addon service IDs/indexes
  };
}

const CartPage = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { data, isLoading, isError } = useGetCartByUserId(user?._id);

  const router = useRouter();
  const [isSyncingServices, setIsSyncingServices] = useState(false);

  const { mutate: updateServices } = useUpdateCartItemServices({
    userId: user?._id,
    onSuccess: () => {
      console.log("✅ Services synced successfully");
    },
  });

  console.log(data, "cart_data");

  const handleProceedToCheckout = async () => {
    setIsSyncingServices(true);

    try {
      // Sync each item's services to backend
      const syncPromises = cartItems.map((item: CartItem) => {
        return new Promise((resolve, reject) => {
          updateServices(
            {
              productId: item.product,
              productType: item.productType,
              selectedServices: {
                installation:
                  selectedServices[item.product]?.installation || false,
                addonServices:
                  selectedServices[item.product]?.addonServices?.map(
                    (idx: string) => parseInt(idx)
                  ) || [],
              },
            },
            {
              onSuccess: resolve,
              onError: reject,
            }
          );
        });
      });

      await Promise.all(syncPromises);

      toast.success("Cart updated! Proceeding to checkout...");

      // Wait a bit for backend to process
      setTimeout(() => {
        router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`);
      }, 500);
    } catch (error) {
      console.error("Failed to sync services:", error);
      toast.error("Failed to update cart. Please try again.");
    } finally {
      setIsSyncingServices(false);
    }
  };

  const {
    items: cartItems = [],
    totalItems = 0,
    totalPrice = 0,
  } = data?.data || {};

  // State for selected services
  const [selectedServices, setSelectedServices] = useState<SelectedServices>(
    {}
  );
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  const { mutate: handleRemoveItemFromCart, isPending: removeFromCartPending } =
    useRemoveItemFromCart({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
        toast.success("Item removed from cart successfully");
      },
      userId: user?._id,
    });

  const { mutate: handleUpdateCartItem, isPending: updateCartItemPending } =
    useUpdateCartItem({
      userId: user?._id,
    });

  const { mutate: handleClearCart, isPending: clearCartPending } = useClearCart(
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
        toast.success("Cart cleared successfully");
      },
      userId: user?._id,
    }
  );

  // Initialize selected services from cart items
  useEffect(() => {
    if (cartItems?.length > 0) {
      const initialServices: SelectedServices = {};
      cartItems.forEach((item: CartItem) => {
        initialServices[item.product] = {
          installation: false,
          addonServices: [],
        };
      });
      setSelectedServices(initialServices);
    }
  }, [cartItems]);

  // Calculate total with services and discounts
  useEffect(() => {
    if (cartItems?.length > 0) {
      let total = 0;

      cartItems.forEach((item: CartItem) => {
        // 1. Start with the BASE ITEM TOTAL (The discounted price like 800)
        // We add it to the total immediately to avoid confusion
        const baseItemTotal = item.price * item.quantity;
        total += baseItemTotal;

        // 2. ADD LIVE SERVICES (Installation)
        // Only add if toggled ON in the UI
        if (
          selectedServices[item.product]?.installation &&
          item.productDetails.installationPrice
        ) {
          total += item.productDetails.installationPrice * item.quantity;
        }

        // 3. ADD LIVE SERVICES (Addons)
        if (
          selectedServices[item.product]?.addonServices.length > 0 &&
          item.productDetails.addonServices?.length
        ) {
          selectedServices[item.product].addonServices.forEach(
            (serviceIndex: string) => {
              const index = parseInt(serviceIndex);
              const service = item.productDetails.addonServices?.[index];
              if (service?.price) {
                total += service.price * item.quantity;
              }
            }
          );
        }
      });

      setCalculatedTotal(total);
    } else {
      // If no items, fall back to backend total (usually 0)
      setCalculatedTotal(totalPrice);
    }
  }, [cartItems, selectedServices, totalPrice]);

  const handleInstallationToggle = (productId: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        installation: !prev[productId]?.installation,
      },
    }));
  };

  // Persist selected services to localStorage
  useEffect(() => {
    if (Object.keys(selectedServices).length > 0) {
      localStorage.setItem(
        "cart_selected_services",
        JSON.stringify(selectedServices)
      );
    }
  }, [selectedServices]);

  const handleAddonServiceToggle = (
    productId: string,
    serviceIndex: number
  ) => {
    setSelectedServices((prev) => {
      const current = prev[productId]?.addonServices || [];
      const isSelected = current.includes(serviceIndex.toString());

      const updatedAddons = isSelected
        ? current.filter((id) => id !== serviceIndex.toString())
        : [...current, serviceIndex.toString()];

      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          addonServices: updatedAddons,
        },
      };
    });
  };

  // Get addon service name and price
  const getAddonServiceInfo = (item: CartItem, index: number) => {
    const service = item.productDetails.addonServices?.[index];
    return {
      name: service?.name || `Service ${index + 1}`,
      price: service?.price || 0,
    };
  };

  // Get installation fee for an item
  const getInstallationFee = (item: CartItem) => {
    return item.productDetails.installationPrice || 0;
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your cart...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-semibold text-destructive">
          Failed to load cart
        </p>
        <Button
          onPress={() => queryClient.invalidateQueries({ queryKey: ["cart"] })}>
          Try Again
        </Button>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Looks like you haven't added any tires or wheels to your cart yet.
          </p>
          <Link href="/">
            <Button
              size="lg"
              className="gap-2">
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-5 rounded">
            <CardHeader>Cart Items ({cartItems?.length})</CardHeader>
            <CardBody className="grid gap-6">
              {cartItems?.map((item: CartItem, index: number) => (
                <div
                  key={index}
                  className="grid gap-4 border-b pb-6 last:border-0">
                  <div className="grid gap-4 sm:grid-cols-[120px_1fr] md:gap-6">
                    <div className="relative aspect-square h-[120px] overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.thumbnail}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {item.productType}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${item.price.toFixed(2)} each
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-8 w-8"
                            onPress={() =>
                              handleUpdateCartItem({
                                productType: item.productType,
                                productId: item.product,
                                quantity: Math.max(1, item.quantity - 1),
                              })
                            }
                            disabled={
                              updateCartItemPending || item.quantity <= 1
                            }>
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            className="h-8 w-8"
                            onPress={() =>
                              handleUpdateCartItem({
                                productType: item.productType,
                                productId: item.product,
                                quantity: item.quantity + 1,
                              })
                            }
                            disabled={
                              updateCartItemPending ||
                              item.quantity >= item.availableStock
                            }>
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-500"
                          onPress={() =>
                            handleRemoveItemFromCart({
                              productType: item.productType,
                              productId: item.product,
                            })
                          }
                          disabled={removeFromCartPending}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Addon Services */}
                  {item.productDetails.addonServices &&
                    item.productDetails.addonServices.length > 0 && (
                      <div className="ml-[136px] mt-2">
                        <p className="mb-2 font-medium">Additional Services:</p>
                        <div className="grid gap-2">
                          {item.productDetails.addonServices.map(
                            (service: any, serviceIndex: number) => (
                              <Checkbox
                                key={serviceIndex}
                                isSelected={
                                  selectedServices[
                                    item.product
                                  ]?.addonServices.includes(
                                    serviceIndex.toString()
                                  ) || false
                                }
                                onValueChange={() =>
                                  handleAddonServiceToggle(
                                    item.product,
                                    serviceIndex
                                  )
                                }
                                className="items-start">
                                <div className="ml-2">
                                  <div className="font-medium">
                                    {service.name ||
                                      `Service ${serviceIndex + 1}`}
                                    : ${service.price?.toFixed(2) || "0.00"} per
                                    item
                                  </div>
                                </div>
                              </Checkbox>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  {/* Installation Service */}
                  {getInstallationFee(item) > 0 && (
                    <div className="ml-[136px] mt-2">
                      <Checkbox
                        isSelected={
                          selectedServices[item.product]?.installation || false
                        }
                        onValueChange={() =>
                          handleInstallationToggle(item.product)
                        }
                        className="items-start">
                        <div className="ml-2">
                          <div className="font-medium">
                            Installation Service: $
                            {getInstallationFee(item).toFixed(2)} per item
                          </div>
                          {item.productDetails.installationService && (
                            <div className="text-sm text-muted-foreground">
                              {item.productDetails.installationService}
                            </div>
                          )}
                        </div>
                      </Checkbox>
                    </div>
                  )}

                  {/* Item Total with Services */}
                  <div className="ml-[136px] mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Item Subtotal:</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>

                    {selectedServices[item.product]?.installation &&
                      getInstallationFee(item) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Installation:
                          </span>
                          <span>
                            + $
                            {(getInstallationFee(item) * item.quantity).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      )}

                    {selectedServices[item.product]?.addonServices.length > 0 &&
                      selectedServices[item.product].addonServices.map(
                        (serviceIndex: string) => {
                          const index = parseInt(serviceIndex);
                          const service =
                            item.productDetails.addonServices?.[index];
                          if (service?.price) {
                            return (
                              <div
                                key={index}
                                className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {service.name}:
                                </span>
                                <span>
                                  + $
                                  {(service.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            );
                          }
                          return null;
                        }
                      )}

                    <div className="mt-2 flex justify-between font-medium">
                      <span>Item Total:</span>
                      <span>
                        $
                        {(
                          item.price * item.quantity +
                          (selectedServices[item.product]?.installation
                            ? getInstallationFee(item) * item.quantity
                            : 0) +
                          selectedServices[item.product]?.addonServices.reduce(
                            (sum: number, serviceIndex: string) => {
                              const index = parseInt(serviceIndex);
                              const service =
                                item.productDetails.addonServices?.[index];
                              return (
                                sum + (service?.price || 0) * item.quantity
                              );
                            },
                            0
                          )
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
            <CardFooter className="justify-between">
              <Button>
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button
                variant="ghost"
                onPress={() => {
                  handleClearCart();
                }}
                disabled={clearCartPending}>
                {clearCartPending ? "Clearing..." : "Clear Cart"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="p-5 rounded">
            <CardHeader>Order Summary</CardHeader>
            <CardBody className="grid gap-4">
              <div className="flex items-center justify-between">
                <span>Items ({totalItems})</span>
                {/* FIX: We sum the ORIGINAL price (e.g., 1000) 
          instead of using backend totalPrice (which was 879)
      */}
                <span>
                  $
                  {cartItems
                    .reduce((sum: number, item: CartItem) => {
                      return sum + item.productDetails.price * item.quantity;
                    }, 0)
                    .toFixed(2)}
                </span>
              </div>

              {/* Discount Display */}
              {cartItems.some(
                (item: CartItem) => item.price < item.productDetails.price
              ) && (
                <div className="flex items-center justify-between text-green-600 bg-green-50 p-2 rounded-md my-2">
                  <span className="text-sm font-medium">
                    Bulk Pricing Applied
                  </span>
                  <span className="text-sm">
                    - $
                    {cartItems
                      .reduce((sum: number, item: CartItem) => {
                        const savingsPerUnit =
                          item.productDetails.price - item.price;
                        return (
                          sum +
                          (savingsPerUnit > 0
                            ? savingsPerUnit * item.quantity
                            : 0)
                        );
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              )}

              {/* Installation Fees */}
              {cartItems.some(
                (item: CartItem) =>
                  selectedServices[item.product]?.installation &&
                  getInstallationFee(item) > 0
              ) && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Installation Fees
                  </span>
                  <span>
                    + $
                    {cartItems
                      .reduce((sum: number, item: CartItem) => {
                        if (selectedServices[item.product]?.installation) {
                          return sum + getInstallationFee(item) * item.quantity;
                        }
                        return sum;
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              )}

              {/* Addon Services Fees */}
              {cartItems.some(
                (item: CartItem) =>
                  selectedServices[item.product]?.addonServices.length > 0
              ) && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Additional Services
                  </span>
                  <span>
                    + $
                    {cartItems
                      .reduce((sum: number, item: CartItem) => {
                        const itemAddonTotal = selectedServices[
                          item.product
                        ]?.addonServices.reduce(
                          (serviceSum: number, serviceIndex: string) => {
                            const service =
                              item.productDetails.addonServices?.[
                                parseInt(serviceIndex)
                              ];
                            return (
                              serviceSum + (service?.price || 0) * item.quantity
                            );
                          },
                          0
                        );
                        return sum + (itemAddonTotal || 0);
                      }, 0)
                      .toFixed(2)}
                  </span>
                </div>
              )}

              <div className="border-t pt-4 mt-2">
                <div className="flex items-center justify-between font-medium text-lg">
                  <span>Total Amount</span>
                  <span>${calculatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onPress={handleProceedToCheckout}
                isLoading={isSyncingServices}
                disabled={isSyncingServices}>
                {isSyncingServices ? "Updating Cart..." : "Proceed to Checkout"}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 rounded-lg border p-4">
            <h3 className="mb-2 font-medium">We Accept</h3>
            <div className="flex gap-2">
              <div className="rounded bg-muted px-2 py-1 text-xs">Visa</div>
              <div className="rounded bg-muted px-2 py-1 text-xs">
                Mastercard
              </div>
              <div className="rounded bg-muted px-2 py-1 text-xs">Amex</div>
              <div className="rounded bg-muted px-2 py-1 text-xs">PayPal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
