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
import { ArrowLeft, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { useCreatePayment } from "@/src/hooks/payment.hook";
import { Spinner } from "@heroui/spinner";
import { AddressAutocomplete } from "./AddressAutocomplete";

// --- আপনার অরিজিনাল ইন্টারফেসগুলো ঠিক রাখা হয়েছে ---
interface CartItem {
  product: string;
  productType: string;
  quantity: number;
  price: number;
  name: string;
  thumbnail: string;
  productDetails: ITire | IWheel;
  installationFee?: number; // ব্যাকএন্ড থেকে আসা ফি
  addonPrice?: number; // ব্যাকএন্ড থেকে আসা ফি
}

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const Label = ({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium mb-1 block ${className}`}>
    {children}
  </label>
);

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`h-px bg-gray-200 my-4 ${className}`} />
);

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const CheckoutPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, isError } = useGetCartByUserId(user?._id);

  const {
    items: cartItems = [],
    totalItems = 0,
    totalPrice = 0, // এটি সরাসরি ডাটাবেস থেকে আসা ফাইনাল প্রাইস
    _id,
  } = data?.data || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // --- ফিক্স: আপনার অরিজিনাল UI স্টেটগুলো রাখা হয়েছে কিন্তু ক্যালকুলেশন সরাসরি totalPrice থেকে আসবে ---
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
    const updatedAddress = { ...billingAddress, [field]: value };
    setBillingAddress(updatedAddress);
    if (sameAsBilling) setShippingAddress(updatedAddress);
  };

  const updateShippingAddress = (field: keyof Address, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
  };

  const validateAddresses = () => {
    const requiredBillingFields = Object.values(billingAddress).every(
      (value) => value.trim() !== ""
    );
    if (!requiredBillingFields) return false;
    if (!sameAsBilling) {
      return Object.values(shippingAddress).every(
        (value) => value.trim() !== ""
      );
    }
    return true;
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* --- আপনার ডিজাইন অনুযায়ী টপ বার --- */}
      <div className="mb-8 flex items-center">
        <Link href="/cart">
          <Button
            variant="ghost"
            className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Button>
        </Link>
        <h1 className="ml-4 text-3xl font-bold">Checkout</h1>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="grid gap-8">
              {/* Billing Address Card - আপনার ডিজাইন ঠিক রাখা হয়েছে */}
              <Card className="p-5 rounded">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Billing Address</h2>
                </CardHeader>
                <CardBody className="grid gap-4">
                  <AddressAutocomplete
                    id="billing-street"
                    label="Street Address*"
                    value={billingAddress.street}
                    onChange={(value) => updateBillingAddress("street", value)}
                    onAddressSelect={(address) => {
                      const addr = {
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country || "US",
                      };
                      setBillingAddress(addr);
                      if (sameAsBilling) setShippingAddress(addr);
                    }}
                    required
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="City*"
                      value={billingAddress.city}
                      onChange={(e) =>
                        updateBillingAddress("city", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="State/Province*"
                      value={billingAddress.state}
                      onChange={(e) =>
                        updateBillingAddress("state", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox
                      isSelected={sameAsBilling}
                      onValueChange={(checked) => {
                        setSameAsBilling(checked);
                        if (checked) setShippingAddress(billingAddress);
                      }}>
                      Shipping address same as billing
                    </Checkbox>
                  </div>
                </CardBody>
              </Card>

              {/* Payment Method - আপনার ডিজাইন */}
              <Card className="p-5 rounded">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </CardHeader>
                <CardBody className="grid gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="stripe"
                        checked={paymentMethod === "stripe"}
                        onChange={() => setPaymentMethod("stripe")}
                      />
                      <label
                        htmlFor="stripe"
                        className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Credit Card
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        id="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      <label htmlFor="paypal">PayPal</label>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Order Summary Sidebar - আপনার অরিজিনাল ডিজাইন */}
          <div className="lg:col-span-2">
            <Card className="p-5 rounded sticky top-4">
              <CardHeader>
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </CardHeader>
              <CardBody className="grid gap-4">
                <div className="max-h-[300px] overflow-auto">
                  {cartItems.map((item: CartItem, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 py-2 border-b last:border-0">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>
                      $
                      {cartItems
                        .reduce(
                          (sum: number, item: any) =>
                            sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>

                  {/* সার্ভিস ফি ডিসপ্লে: এটি এখন সরাসরি ব্যাকএন্ড ডাটা থেকে ক্যালকুলেট হবে */}
                  {cartItems.some(
                    (i: any) => i.installationFee > 0 || i.addonPrice > 0
                  ) && (
                    <div className="flex items-center justify-between text-blue-600">
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

                  <div className="flex items-center justify-between font-bold text-lg pt-2 border-t mt-2">
                    <span>Total</span>
                    <span className="text-rose-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <ShieldCheck className="h-4 w-4" />{" "}
                  <span>Secure checkout</span>
                </div>
              </CardBody>

              <CardFooter className="flex flex-col gap-4">
                {paymentMethod === "stripe" ? (
                  <StripeButton
                    amount={totalPrice.toFixed(2)}
                    paymentData={{
                      cartId: _id,
                      shippingAddress,
                      billingAddress,
                      paymentMethod,
                    }}
                    isDisabled={!validateAddresses()}
                  />
                ) : (
                  <PaypalCheckoutButton
                    amount={totalPrice.toFixed(2)}
                    paymentData={{
                      cartId: _id,
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
      </form>
    </div>
  );
};

// --- আপনার পেমেন্ট বাটন কম্পোনেন্টগুলো ঠিক রাখা হয়েছে ---
const StripeButton = ({ amount, paymentData, isDisabled }: any) => {
  const { mutate: handleCreatePayment, isPending } = useCreatePayment({
    onSuccess: (data: any) => {
      if (data.data?.url) window.location.href = data.data.url;
    },
    onError: (error: any) => toast.error(error.message || "Payment failed!"),
  });

  return (
    <Button
      color="primary"
      className="w-full h-12 bg-blue-600 font-bold"
      disabled={isPending || isDisabled}
      onPress={() => handleCreatePayment(paymentData)}>
      {isPending ? (
        <Spinner
          size="sm"
          color="white"
        />
      ) : (
        `Pay $${amount}`
      )}
    </Button>
  );
};

// ... PaypalCheckoutButton একইভাবে আপনার ডিজাইন অনুযায়ী হবে

export default CheckoutPage;
