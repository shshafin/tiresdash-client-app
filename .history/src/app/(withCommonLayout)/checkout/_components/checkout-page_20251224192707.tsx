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

  useEffect(() => {
    if (totalPrice > 0) setCalculatedTotal(totalPrice);
    let totalDiscount = 0;
    cartItems.forEach((item: any) => {
      const savings = (item.productDetails?.price - item.price) * item.quantity;
      if (savings > 0) totalDiscount += savings;
    });
    setDiscountAmount(totalDiscount);
  }, [totalPrice, cartItems]);

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
          label="Loading Checkout..."
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-zinc-950 pb-20">
      {/* Top Sticky Header for Mobile */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b dark:border-zinc-800 py-4 px-4 mb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="light"
            isIconOnly
            onPress={() => router.push("/cart")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-xl font-black tracking-tight">CHECKOUT</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* Order Summary - Mobile Priority (Appears first on small screens) */}
          <div className="lg:col-span-4 lg:order-2">
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900 overflow-hidden">
              <CardHeader className="p-5 bg-gray-50/50 dark:bg-zinc-800/50 border-b dark:border-zinc-800">
                <h2 className="text-sm font-black tracking-widest text-gray-400">
                  ORDER SUMMARY
                </h2>
              </CardHeader>
              <CardBody className="p-5 space-y-4">
                {/* Compact Item List */}
                <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item: CartItem, index: number) => (
                    <div
                      key={index}
                      className="flex gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 border dark:border-zinc-800">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs truncate uppercase">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <p className="font-black text-xs tracking-tighter">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t dark:border-zinc-800 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-gray-500">
                    <span>Subtotal</span>
                    <span>
                      $
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.productDetails?.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs font-bold text-emerald-500">
                      <span>Bulk Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {cartItems.some(
                    (i: any) => i.installationFee > 0 || i.addonPrice > 0
                  ) && (
                    <div className="flex justify-between text-[10px] font-bold text-rose-500 uppercase">
                      <span>Services</span>
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
                  <div className="flex justify-between pt-3">
                    <span className="text-sm font-black uppercase tracking-wider">
                      Total
                    </span>
                    <span className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter">
                      ${calculatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-black justify-center bg-gray-50 dark:bg-zinc-800/30 py-2 rounded-lg mt-2">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-500"
                  />{" "}
                  256-bit SSL Encryption
                </div>

                {/* PAY BUTTON - Modern Ground Shadow Gradient */}
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
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Left Side: Address Forms */}
          <div className="lg:col-span-8 lg:order-1 space-y-6">
            {/* Billing Card */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardHeader className="flex gap-3 px-6 pt-6 items-center">
                <div className="h-10 w-10 flex items-center justify-center bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-black tracking-tight uppercase">
                  Billing Address
                </h2>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
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
                    label="City"
                    className="bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    value={billingAddress.city}
                    onChange={(e) =>
                      updateBillingAddress("city", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="flat"
                    label="State/Province"
                    className="bg-gray-50 dark:bg-zinc-800 rounded-xl"
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
                    label="Postal Code"
                    className="bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      updateBillingAddress("postalCode", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="flat"
                    label="Country"
                    className="bg-gray-50 dark:bg-zinc-800 rounded-xl"
                    value={billingAddress.country}
                    onChange={(e) =>
                      updateBillingAddress("country", e.target.value)
                    }
                    isRequired
                  />
                </div>
                <Checkbox
                  color="secondary"
                  isSelected={sameAsBilling}
                  onValueChange={(checked) => {
                    setSameAsBilling(checked);
                    if (checked) setShippingAddress(billingAddress);
                  }}>
                  <span className="text-xs font-bold uppercase text-gray-500">
                    Deliver to the same address
                  </span>
                </Checkbox>
              </CardBody>
            </Card>

            {/* Shipping Card */}
            {!sameAsBilling && (
              <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
                <CardHeader className="flex gap-3 px-6 pt-6">
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-lg font-black tracking-tight uppercase">
                    Shipping Address
                  </h2>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
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
                      label="City"
                      className="bg-gray-50 dark:bg-zinc-800"
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
                      label="State"
                      className="bg-gray-50 dark:bg-zinc-800"
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
                      label="Postal Code"
                      className="bg-gray-50 dark:bg-zinc-800"
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
                      label="Country"
                      className="bg-gray-50 dark:bg-zinc-800"
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

            {/* Modern Payment Method Card */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardBody className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase">
                        Credit / Debit Card
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Instant Activation
                      </p>
                    </div>
                  </div>
                  {/* Credit Card Logos Image placeholder */}
                  <div className="flex gap-2 items-center bg-white p-2 rounded-lg border dark:border-zinc-800">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg"
                      className="h-4 w-auto"
                      alt="visa"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      className="h-6 w-auto"
                      alt="mastercard"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                      className="h-4 w-auto opacity-40 grayscale"
                      alt="paypal"
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

// --- Stripe Button with Gradient & Ground Shadow ---
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
        w-full h-16 rounded-2xl text-white font-black text-lg uppercase tracking-tighter
        transition-all duration-300 transform active:scale-95
        flex items-center justify-center gap-3
        ${
          isPending || isDisabled
            ? "bg-gray-300 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 hover:brightness-110 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]"
        }
      `}>
      {isPending ? (
        <Spinner
          size="sm"
          color="white"
        />
      ) : (
        `PAY $${amount}`
      )}
    </button>
  );
};

export default CheckoutPage;
