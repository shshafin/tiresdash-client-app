"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ITire, IWheel } from "@/src/types";
import { useUser } from "@/src/context/user.provider";
import { useGetCartByUserId } from "@/src/hooks/cart.hook";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  ShieldCheck,
  Truck,
  MapPin,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Spinner } from "@heroui/spinner";
import { AddressAutocomplete } from "./AddressAutocomplete";

// Types
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
  const { data, isLoading, isError } = useGetCartByUserId(user?._id);

  const {
    items: cartItems = [],
    totalPrice = 0,
    _id: cartId,
  } = data?.data || {};

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
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
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Spinner
          size="lg"
          color="secondary"
        />
        <p className="text-gray-500 font-medium">
          Securing your checkout session...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="flat"
            color="secondary"
            startContent={<ArrowLeft size={18} />}
            onPress={() => router.push("/cart")}
            className="font-medium">
            Back to Cart
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              CHECKOUT
            </h1>
            <p className="text-rose-500 font-semibold text-sm">
              Secure Payment Gateway
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Side: Address & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* Billing Card */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900 overflow-visible">
              <CardHeader className="flex gap-3 px-6 pt-6">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-lg">
                  <MapPin size={20} />
                </div>
                <h2 className="text-xl font-bold">Billing Details</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    variant="bordered"
                    label="City"
                    value={billingAddress.city}
                    onChange={(e) =>
                      updateBillingAddress("city", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="bordered"
                    label="State/Province"
                    value={billingAddress.state}
                    onChange={(e) =>
                      updateBillingAddress("state", e.target.value)
                    }
                    isRequired
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    variant="bordered"
                    label="Postal Code"
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      updateBillingAddress("postalCode", e.target.value)
                    }
                    isRequired
                  />
                  <Input
                    variant="bordered"
                    label="Country"
                    value={billingAddress.country}
                    onChange={(e) =>
                      updateBillingAddress("country", e.target.value)
                    }
                    isRequired
                  />
                </div>
                <Checkbox
                  color="secondary"
                  className="mt-2"
                  isSelected={sameAsBilling}
                  onValueChange={(checked) => {
                    setSameAsBilling(checked);
                    if (checked) setShippingAddress(billingAddress);
                  }}>
                  <span className="text-sm font-medium">
                    Shipping address is the same as billing
                  </span>
                </Checkbox>
              </CardBody>
            </Card>

            {/* Shipping Card (Conditional) */}
            {!sameAsBilling && (
              <Card className="shadow-sm border-none bg-white dark:bg-zinc-900 animate-in fade-in slide-in-from-top-4 duration-300">
                <CardHeader className="flex gap-3 px-6 pt-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                    <Truck size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Shipping Details</h2>
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      variant="bordered"
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
                      variant="bordered"
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
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      variant="bordered"
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
                      variant="bordered"
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

            {/* Payment Method Selection */}
            <Card className="shadow-sm border-none bg-white dark:bg-zinc-900">
              <CardHeader className="flex gap-3 px-6 pt-6">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                  <Wallet size={20} />
                </div>
                <h2 className="text-xl font-bold">Select Payment Method</h2>
              </CardHeader>
              <CardBody className="p-6 flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("stripe")}
                  className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "stripe" ? "border-rose-500 bg-rose-50 dark:bg-rose-900/10" : "border-gray-100 dark:border-zinc-800"}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard
                      className={
                        paymentMethod === "stripe"
                          ? "text-rose-500"
                          : "text-gray-400"
                      }
                    />
                    <span className="font-bold text-sm text-gray-800 dark:text-gray-200">
                      Credit / Debit Card
                    </span>
                  </div>
                  {paymentMethod === "stripe" && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-white shadow-sm" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("paypal")}
                  className={`flex-1 flex items-center justify-between p-4 rounded-xl border-2 transition-all ${paymentMethod === "paypal" ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10" : "border-gray-100 dark:border-zinc-800"}`}>
                  <div className="flex items-center gap-3 text-gray-800 dark:text-gray-200">
                    <span className="font-black italic text-blue-700">
                      PayPal
                    </span>
                  </div>
                  {paymentMethod === "paypal" && (
                    <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                  )}
                </button>
              </CardBody>
            </Card>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-4">
            <Card className="shadow-lg border-2 border-rose-500/10 bg-white dark:bg-zinc-900 sticky top-10">
              <CardHeader className="p-6 border-b dark:border-zinc-800">
                <h2 className="text-xl font-black tracking-tight">
                  ORDER SUMMARY
                </h2>
              </CardHeader>
              <CardBody className="p-6 space-y-4">
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItems.map((item: CartItem, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 group">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-50 border dark:border-zinc-800">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t dark:border-zinc-800">
                  <div className="flex justify-between text-sm font-medium text-gray-500">
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
                    <div className="flex justify-between text-sm font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                      <span>Instant Savings</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {cartItems.some(
                    (i: any) => i.installationFee > 0 || i.addonPrice > 0
                  ) && (
                    <div className="flex justify-between text-xs font-semibold text-rose-500">
                      <span>Services & Installation</span>
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
                  <div className="flex justify-between text-xs font-medium text-gray-400">
                    <span>Shipping</span>
                    <span className="text-emerald-500 uppercase tracking-widest font-black">
                      Free
                    </span>
                  </div>

                  <div className="pt-4 flex justify-between items-end">
                    <span className="text-gray-400 font-bold text-sm uppercase">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-rose-600 tracking-tighter">
                      ${calculatedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest justify-center pt-2">
                  <ShieldCheck
                    size={14}
                    className="text-emerald-500"
                  />{" "}
                  Secure SSL Encrypted Checkout
                </div>
              </CardBody>
              <CardFooter className="p-6 pt-0">
                {paymentMethod === "stripe" ? (
                  <StripeButton
                    amount={calculatedTotal.toFixed(2)}
                    paymentData={{
                      cartId,
                      shippingAddress,
                      billingAddress,
                      paymentMethod,
                    }}
                    isDisabled={!validateAddresses()}
                  />
                ) : (
                  <PaypalCheckoutButton
                    amount={calculatedTotal.toFixed(2)}
                    paymentData={{
                      cartId,
                      shippingAddress,
                      billingAddress,
                      paymentMethod,
                    }}
                    isDisabled={!validateAddresses()}
                  />
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Stripe Button Component ---
const StripeButton = ({ amount, paymentData, isDisabled }: any) => {
  const { mutate: handleCreatePayment, isPending } = useCreatePayment({
    onSuccess: (data: any) => {
      if (data.data?.url) window.location.href = data.data.url;
    },
    onError: (err: any) => toast.error(err.message || "Payment Failed"),
  });

  return (
    <Button
      color="secondary"
      size="lg"
      className="w-full h-14 text-lg font-black shadow-rose-200 dark:shadow-none shadow-xl transition-all hover:scale-[1.02] active:scale-95"
      disabled={isPending || isDisabled}
      onPress={() => handleCreatePayment(paymentData)}>
      {isPending ? (
        <div className="flex items-center gap-2">
          <Spinner
            size="sm"
            color="white"
          />{" "}
          SECURING...
        </div>
      ) : (
        `PAY $${amount}`
      )}
    </Button>
  );
};

// --- Paypal Button Component ---
const PaypalCheckoutButton = ({ amount, paymentData, isDisabled }: any) => {
  const { mutate: handleCreatePayment, isPending } = useCreatePayment({
    onSuccess: (data: any) => {
      const approvalLink = data.links?.find(
        (link: any) => link.rel === "approve"
      );
      if (approvalLink) window.location.href = approvalLink.href;
    },
    onError: (err: any) => toast.error(err.message || "Payment Failed"),
  });

  return (
    <Button
      className="w-full h-14 bg-blue-600 text-white text-lg font-black shadow-blue-200 shadow-xl transition-all hover:scale-[1.02] active:scale-95"
      disabled={isPending || isDisabled}
      onPress={() => handleCreatePayment(paymentData)}>
      {isPending ? "REDIRECTING..." : `PAY $${amount} WITH PAYPAL`}
    </Button>
  );
};

export default CheckoutPage;
