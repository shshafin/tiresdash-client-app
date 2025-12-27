"use client";
import { useUser } from "@/src/context/user.provider";
import {
  useClearCart,
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
  PackageCheck,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
    },
  });

  const { mutate: handleRemoveItemFromCart, isPending: removeFromCartPending } =
    useRemoveItemFromCart({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["GET_CART"] });
        toast.success("Item removed from your collection");
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
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4">
        <Spinner
          size="lg"
          color="secondary"
          label="Refining your cart..."
        />
      </div>
    );

  if (cartItems.length === 0)
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
        <div className="p-6 bg-gray-50 dark:bg-zinc-900 rounded-full">
          <ShoppingBag
            size={64}
            className="text-gray-300"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added any premium tires yet.
          </p>
        </div>
        <Button
          color="secondary"
          size="lg"
          radius="full"
          onClick={() => router.push("/")}>
          Continue Shopping
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex items-center gap-3 mb-10">
        <PackageCheck
          size={32}
          className="text-rose-500"
        />
        <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
          Your Cart
        </h1>
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {cartItems.map((item: CartItem, idx: number) => (
            <Card
              key={idx}
              className="border-none shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardBody className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Product Image */}
                  <div className="relative w-full md:w-48 h-48 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl overflow-hidden border dark:border-zinc-800 group">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                      alt={item.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-black text-xl text-gray-900 dark:text-gray-100 uppercase tracking-tight">
                          {item.name}
                        </h3>
                        <p className="text-rose-500 font-bold mt-1 text-sm">
                          ${item.price.toFixed(2)} per unit
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-xl border dark:border-zinc-700">
                        <Button
                          size="sm"
                          variant="flat"
                          isIconOnly
                          className="bg-white dark:bg-zinc-700 shadow-sm"
                          onClick={() => {
                            setActiveUpdateId(item.product);
                            handleUpdateCartItem({
                              productId: item.product,
                              productType: item.productType,
                              quantity: Math.max(1, item.quantity - 1),
                            });
                          }}
                          disabled={
                            item.quantity <= 1 ||
                            activeUpdateId === item.product
                          }>
                          <Minus size={14} />
                        </Button>
                        <span className="w-8 text-center font-black text-lg">
                          {activeUpdateId === item.product ? (
                            <Loader2
                              size={14}
                              className="animate-spin mx-auto"
                            />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <Button
                          size="sm"
                          variant="flat"
                          isIconOnly
                          className="bg-white dark:bg-zinc-700 shadow-sm"
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
                        </Button>
                      </div>

                      <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        className="font-bold uppercase tracking-widest text-[10px]"
                        onClick={() =>
                          handleRemoveItemFromCart({
                            productId: item.product,
                            productType: item.productType,
                          })
                        }>
                        <Trash2
                          size={16}
                          className="mr-1"
                        />{" "}
                        Remove Item
                      </Button>
                    </div>

                    {/* Separated Services Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t dark:border-zinc-800">
                      {/* Installation Highlight */}
                      {item.productDetails?.installationPrice > 0 && (
                        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                          <div className="flex items-center gap-2 mb-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest">
                            <Wrench size={14} /> Installation
                          </div>
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
                            <span className="text-xs font-medium">
                              Apply Professional Fitment <br />
                              <span className="text-[10px] text-gray-500">
                                +${item.productDetails.installationPrice} per
                                unit
                              </span>
                            </span>
                          </Checkbox>
                        </div>
                      )}

                      {/* Addons Highlight */}
                      {item.productDetails?.addonServices?.length > 0 && (
                        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border dark:border-zinc-800">
                          <div className="flex items-center gap-2 mb-2 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                            <PlusCircle size={14} /> Available Add-ons
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
                                  onValueChange={() =>
                                    handleAddonServiceToggle(
                                      item.product,
                                      item.productType,
                                      sIdx
                                    )
                                  }>
                                  <span className="text-[11px] font-medium">
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
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <Card className="p-8 border-none shadow-xl bg-zinc-900 text-white sticky top-10">
            <CardHeader className="p-0 mb-8">
              <h2 className="text-xl font-black uppercase tracking-widest text-zinc-400">
                Order Summary
              </h2>
            </CardHeader>
            <CardBody className="p-0 space-y-6">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-sm font-medium uppercase tracking-tight">
                  Merchandise Subtotal
                </span>
                <span className="font-bold">
                  $
                  {cartItems
                    .reduce(
                      (s: number, i: CartItem) => s + i.price * i.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-400 pb-6 border-b border-zinc-800">
                <span className="text-sm font-medium uppercase tracking-tight">
                  Services & Extras
                </span>
                <span className="font-bold">
                  $
                  {(
                    calculatedTotal -
                    cartItems.reduce(
                      (s: number, i: CartItem) => s + i.price * i.quantity,
                      0
                    )
                  ).toFixed(2)}
                </span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">
                    Estimated Total
                  </span>
                  <span className="text-4xl font-black text-rose-500 tracking-tighter">
                    ${calculatedTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardBody>
            <CardFooter className="p-0 mt-10">
              <Button
                color="secondary"
                size="lg"
                className="w-full h-16 font-black uppercase tracking-widest text-lg shadow-2xl shadow-rose-500/20 transition-transform active:scale-95"
                onClick={() =>
                  router.push(`/checkout?total=${calculatedTotal.toFixed(2)}`)
                }>
                Secure Checkout{" "}
                <ArrowRight
                  className="ml-2"
                  size={20}
                />
              </Button>
            </CardFooter>
            <div className="mt-6 flex items-center justify-center gap-2 text-zinc-500">
              <ShieldCheck size={16} />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                SSL Encrypted Transaction
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
