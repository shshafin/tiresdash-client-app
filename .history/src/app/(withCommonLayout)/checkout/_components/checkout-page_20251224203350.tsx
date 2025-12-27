"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ITire, IWheel } from "@/src/types";
import { useUser } from "@/src/context/user.provider";
import { useGetCartByUserId } from "@/src/hooks/cart.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  MapPin,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Spinner } from "@heroui/spinner";
import { AddressAutocomplete } from "./AddressAutocomplete";

// --- Types ---
interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: ITire | IWheel;
  installationFee?: number;
  addonPrice?: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading } = useGetCartByUserId(user?._id);

  const {
    items: cartItems = [],
    totalPrice = 0,
    _id: cartId,
  } = data?.data || {};

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // ✅ LOGICAL FIX: Calculate Grand Total including fees multiplied by quantity
  useEffect(() => {
    if (cartItems?.length > 0) {
      let currentGrandTotal = 0;
      let totalDiscount = 0;

      cartItems.forEach((item: any) => {
        // 1. Base Product Total
        const baseProductSubtotal = item.price * item.quantity;

        // 2. Installation Fee Total (Unit Fee * Quantity)
        const installationSubtotal =
          (item.installationFee || 0) * item.quantity;

        // 3. Addon Price Total (Unit Addon * Quantity)
        const addonSubtotal = (item.addonPrice || 0) * item.quantity;

        // Sum everything for this item
        currentGrandTotal +=
          baseProductSubtotal + installationSubtotal + addonSubtotal;

        // Calculate Savings (Original Price - Discounted Price)
        const savings =
          (item.productDetails?.price - item.price) * item.quantity;
        if (savings > 0) totalDiscount += savings;
      });

      setCalculatedTotal(currentGrandTotal);
      setDiscountAmount(totalDiscount);
    } else {
      setCalculatedTotal(totalPrice);
    }
  }, [cartItems, totalPrice]);

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  const updateBillingAddress = (field: keyof Address, value: string) => {
    const updated = { ...billingAddress, [field]: value };
    setBillingAddress(updated);
    if (sameAsBilling) setShippingAddress(updated);
  };

  const validateAddresses = () => {
    const billingValid = Object.values(billingAddress).every(
      (v) => v.trim() !== ""
    );
    return sameAsBilling
      ? billingValid
      : billingValid &&
          Object.values(shippingAddress).every((v) => v.trim() !== "");
  };

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <Spinner
          size="lg"
          color="secondary"
          label="Finalizing Checkout..."
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 pb-12 sm:pb-20">
      {/* Responsive Header */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b dark:border-zinc-800 py-3 sm:py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="light"
            isIconOnly
            size="sm"
            onPress={() => router.push("/cart")}>
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase">
            Checkout
          </h1>
          <div className="w-8"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
          {/* Right Side: Order Summary */}
          <div className="w-full lg:col-span-4 lg:order-2">
            <Card className="shadow-md border-none bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-800/50 border-b dark:border-zinc-800">
                <h2 className="text-[10px] sm:text-xs font-black tracking-widest text-zinc-400 uppercase">
                  Order Summary
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item: CartItem, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center">
                      <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 rounded-lg bg-gray-50 border dark:border-zinc-800">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[10px] sm:text-xs truncate uppercase">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-zinc-400 font-bold">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-xs sm:text-sm tracking-tighter">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-[11px] sm:text-xs font-medium text-zinc-500">
                    <span>Subtotal</span>
                    <span>
                      $
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum +
                            (item.productDetails?.price || 0) * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[11px] sm:text-xs font-bold text-emerald-500">
                      <span>Instant Savings</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* ✅ FIXED: Services & Installation Total Calculation */}
                  {cartItems.some(
                    (i: any) => i.installationFee > 0 || i.addonPrice > 0
                  ) && (
                    <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                      <span>Installation & Services</span>
                      <span>
                        +$
                        {cartItems
                          .reduce(
                            (acc: number, i: any) =>
                              acc +
                              ((i.installationFee || 0) + (i.addonPrice || 0)) *
                                i.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 border-t dark:border-zinc-800">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">
                      Grand Total
                    </span>
                    <span className="text-xl sm:text-3xl font-black text-rose-600 tracking-tighter">
                      ${calculatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <StripeButton
                    amount={calculatedTotal.toFixed(2)}
                    paymentData={{
                      cartId,
                      shippingAddress,
                      billingAddress,
                      paymentMethod: "stripe",
                    }}
                    isDisabled={!validateAddresses()}
                  />
                  <div className="flex items-center gap-2 text-[9px] text-zinc-400 uppercase font-black justify-center mt-4">
                    <ShieldCheck
                      size={12}
                      className="text-emerald-500"
                    />{" "}
                    Secure Encryption Active
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Left Side: Forms */}
          <div className="w-full lg:col-span-8 lg:order-1 space-y-6">
            {/* Billing Card */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardHeader className="flex gap-3 px-4 sm:px-6 pt-6 items-center">
                <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-lg sm:rounded-xl">
                  <MapPin size={18} />
                </div>
                <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                  Billing Details
                </h2>
              </CardHeader>
              <CardBody className="p-4 sm:p-6 space-y-4">
                <AddressAutocomplete
                  id="billing-street"
                  label="Street Address"
                  value={billingAddress.street}
                  onChange={(val) => updateBillingAddress("street", val)}
                  onAddressSelect={(addr) => {
                    const fullAddr = {
                      street: addr.street,
                      city: addr.city,
                      state: addr.state,
                      postalCode: addr.postalCode,
                      country: addr.country || "US",
                    };
                    setBillingAddress(fullAddr);
                    if (sameAsBilling) setShippingAddress(fullAddr);
                  }}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    variant="flat"
                    size="sm"
                    label="City"
                    className="rounded-xl"
                    value={billingAddress.city}
                    onChange={(e) =>
                      updateBillingAddress("city", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="flat"
                    size="sm"
                    label="State"
                    className="rounded-xl"
                    value={billingAddress.state}
                    onChange={(e) =>
                      updateBillingAddress("state", e.target.value)
                    }
                    isRequired
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    variant="flat"
                    size="sm"
                    label="Postal Code"
                    className="rounded-xl"
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      updateBillingAddress("postalCode", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="flat"
                    size="sm"
                    label="Country"
                    className="rounded-xl"
                    value={billingAddress.country}
                    onChange={(e) =>
                      updateBillingAddress("country", e.target.value)
                    }
                    isRequired
                  />
                </div>
                <Checkbox
                  color="secondary"
                  size="sm"
                  isSelected={sameAsBilling}
                  onValueChange={(checked) => {
                    setSameAsBilling(checked);
                    if (checked) setShippingAddress(billingAddress);
                  }}>
                  <span className="text-[11px] font-bold uppercase text-zinc-500">
                    Same address for delivery
                  </span>
                </Checkbox>
              </CardBody>
            </Card>

            {/* Shipping Card */}
            {!sameAsBilling && (
              <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
                <CardHeader className="flex gap-3 px-4 sm:px-6 pt-6">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-lg sm:rounded-xl">
                    <Truck size={18} />
                  </div>
                  <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                    Shipping Details
                  </h2>
                </CardHeader>
                <CardBody className="p-4 sm:p-6 space-y-4">
                  <AddressAutocomplete
                    id="shipping-street"
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(val) =>
                      setShippingAddress({ ...shippingAddress, street: val })
                    }
                    onAddressSelect={(addr) =>
                      setShippingAddress({
                        street: addr.street,
                        city: addr.city,
                        state: addr.state,
                        postalCode: addr.postalCode,
                        country: addr.country || "US",
                      })
                    }
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      variant="flat"
                      size="sm"
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      isRequired
                    />
                    <Input
                      variant="flat"
                      size="sm"
                      label="State"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          state: e.target.value,
                        })
                      }
                      isRequired
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      variant="flat"
                      size="sm"
                      label="Postal Code"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        })
                      }
                      isRequired
                    />
                    <Input
                      variant="flat"
                      size="sm"
                      label="Country"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          country: e.target.value,
                        })
                      }
                      isRequired
                    />
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Payment Method Card */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardBody className="p-4 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-xs sm:text-sm uppercase">
                        Secure Payment
                      </h3>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                        Card / Wallet
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center bg-zinc-50 dark:bg-zinc-800 p-2 rounded-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                      className="h-3 w-auto"
                      alt="visa"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      className="h-5 w-auto"
                      alt="mastercard"
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Stripe Button ---
const StripeButton = ({ amount, paymentData, isDisabled }: any) => {
  const { mutate: handleCreatePayment, isPending } = useCreatePayment({
    onSuccess: (data: any) => {
      if (data.data?.url) window.location.href = data.data.url;
    },
    onError: (err: any) => toast.error(err.message || "Payment Failed"),
  });

  return (
    <button
      disabled={isPending || isDisabled}
      onClick={() => handleCreatePayment(paymentData)}
      className={`
        w-full h-12 sm:h-16 rounded-xl sm:rounded-2xl text-white font-black text-sm sm:text-lg uppercase tracking-tight
        transition-all duration-300 transform active:scale-95
        flex items-center justify-center gap-3
        ${
          isPending || isDisabled
            ? "bg-zinc-300 cursor-not-allowed"
            : "bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-105 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]"
        }
      `}>
      {isPending ? (
        <Spinner
          size="sm"
          color="white"
        />
      ) : (
        `Complete Payment $${amount}`
      )}
    </button>
  );
};

export default CheckoutPage;
