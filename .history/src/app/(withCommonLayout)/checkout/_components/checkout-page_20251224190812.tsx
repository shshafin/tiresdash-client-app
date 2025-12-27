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

const Label = ({ htmlFor, children, className = "" }: any) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium mb-1 block ${className}`}>
    {children}
  </label>
);

const Separator = () => <div className="h-px bg-gray-200 my-4 w-full" />;

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
    totalPrice = 0,
    _id: cartId,
  } = data?.data || {};

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // Address State
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
    if (!sameAsBilling) {
      const shippingValid = Object.values(shippingAddress).every(
        (v) => v.trim() !== ""
      );
      return billingValid && shippingValid;
    }
    return billingValid;
  };

  if (isLoading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center">
        <Button
          variant="ghost"
          className="gap-2"
          onPress={() => router.push("/cart")}>
          <ArrowLeft size={16} /> Back to Cart
        </Button>
        <h1 className="ml-4 text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          {/* Billing Section */}
          <Card className="p-5">
            <CardHeader>
              <h2 className="text-xl font-semibold">Billing Address</h2>
            </CardHeader>
            <CardBody className="grid gap-4">
              <AddressAutocomplete
                id="billing-street"
                label="Street Address*"
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
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={billingAddress.city}
                  onChange={(e) => updateBillingAddress("city", e.target.value)}
                />
                <Input
                  label="State"
                  value={billingAddress.state}
                  onChange={(e) =>
                    updateBillingAddress("state", e.target.value)
                  }
                />
              </div>
              <Checkbox
                isSelected={sameAsBilling}
                onValueChange={(checked) => {
                  setSameAsBilling(checked);
                  if (checked) setShippingAddress(billingAddress);
                }}>
                Shipping address same as billing
              </Checkbox>
            </CardBody>
          </Card>

          {/* Payment Method Selection */}
          <Card className="p-5">
            <CardHeader>
              <h2 className="text-xl font-semibold">Payment Method</h2>
            </CardHeader>
            <CardBody className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                />
                <CreditCard size={18} /> Stripe (Card)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="pay"
                  checked={paymentMethod === "paypal"}
                  onChange={() => setPaymentMethod("paypal")}
                />
                PayPal
              </label>
            </CardBody>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <Card className="p-5 sticky top-4">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {cartItems.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm">
                  <div className="flex gap-3">
                    <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden relative">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item.thumbnail}`}
                        fill
                        alt="thumb"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    $
                    {cartItems
                      .reduce((s: any, i: any) => s + i.price * i.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>

                {/* Service Fees Calculated from DB response */}
                {cartItems.some(
                  (i: any) => i.installationFee > 0 || i.addonPrice > 0
                ) && (
                  <div className="flex justify-between text-blue-600">
                    <span>Services & Installation</span>
                    <span>
                      +$
                      {cartItems
                        .reduce(
                          (s: any, i: any) =>
                            s +
                            ((i.installationFee || 0) + (i.addonPrice || 0)) *
                              i.quantity,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-xl font-black pt-4 border-t">
                  <span>Total</span>
                  <span className="text-rose-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <PaymentAction
                method={paymentMethod}
                amount={totalPrice}
                data={{
                  cartId,
                  billingAddress,
                  shippingAddress,
                  paymentMethod,
                }}
                disabled={!validateAddresses()}
              />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

const PaymentAction = ({ method, amount, data, disabled }: any) => {
  const { mutate: createPayment, isPending } = useCreatePayment({
    onSuccess: (res: any) => {
      if (res.data?.url)
        window.location.href = res.data.url; // Stripe
      else if (res.links)
        window.location.href = res.links.find(
          (l: any) => l.rel === "approve"
        ).href; // PayPal
    },
  });

  return (
    <Button
      color="secondary"
      size="lg"
      className="w-full font-bold"
      disabled={disabled || isPending}
      onPress={() => createPayment(data)}>
      {isPending ? (
        <Spinner
          size="sm"
          color="white"
        />
      ) : (
        `Pay $${amount.toFixed(2)}`
      )}
    </Button>
  );
};

export default CheckoutPage;
