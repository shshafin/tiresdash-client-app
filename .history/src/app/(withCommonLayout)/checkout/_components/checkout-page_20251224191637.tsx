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

const Label = ({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`text-sm font-medium mb-1 block ${className}`}>
      {children}
    </label>
  );
};

const Separator = ({ className = "" }: { className?: string }) => {
  return <div className={`h-px bg-gray-200 my-4 ${className}`} />;
};

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

  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Sync total with backend
  useEffect(() => {
    if (totalPrice > 0) {
      setCalculatedTotal(totalPrice);
    }

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
        <span className="ml-2">Loading checkout information...</span>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="grid gap-8">
            <Card className="p-5 rounded">
              <CardHeader>
                <h2 className="text-xl font-semibold">Billing Address</h2>
              </CardHeader>
              <CardBody className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
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
                  <Input
                    label="City*"
                    value={billingAddress.city}
                    onChange={(e) =>
                      updateBillingAddress("city", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Input
                    label="State/Province*"
                    value={billingAddress.state}
                    onChange={(e) =>
                      updateBillingAddress("state", e.target.value)
                    }
                    required
                  />
                  <Input
                    label="Postal Code*"
                    value={billingAddress.postalCode}
                    onChange={(e) =>
                      updateBillingAddress("postalCode", e.target.value)
                    }
                    required
                  />
                  <Input
                    label="Country*"
                    value={billingAddress.country}
                    onChange={(e) =>
                      updateBillingAddress("country", e.target.value)
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

            {!sameAsBilling && (
              <Card className="p-5 rounded">
                <CardHeader>
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                </CardHeader>
                <CardBody className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <AddressAutocomplete
                      id="shipping-street"
                      label="Street Address*"
                      value={shippingAddress.street}
                      onChange={(value) =>
                        updateShippingAddress("street", value)
                      }
                      onAddressSelect={(address) =>
                        setShippingAddress({
                          street: address.street,
                          city: address.city,
                          state: address.state,
                          postalCode: address.postalCode,
                          country: address.country || "US",
                        })
                      }
                      required
                    />
                    <Input
                      label="City*"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        updateShippingAddress("city", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input
                      label="State/Province*"
                      value={shippingAddress.state}
                      onChange={(e) =>
                        updateShippingAddress("state", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Postal Code*"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        updateShippingAddress("postalCode", e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Country*"
                      value={shippingAddress.country}
                      onChange={(e) =>
                        updateShippingAddress("country", e.target.value)
                      }
                      required
                    />
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

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
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${item?.thumbnail}`}
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
                          sum + item.productDetails?.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Savings</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
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
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${calculatedTotal.toFixed(2)}</span>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Label htmlFor="payment">Payment Method</Label>
                <div className="grid gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={() => setPaymentMethod("stripe")}
                    />
                    <label
                      htmlFor="stripe"
                      className="flex items-center gap-2 cursor-pointer">
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
                    <label
                      htmlFor="paypal"
                      className="cursor-pointer">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
            </CardBody>
            <CardFooter>
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
  );
};

export default CheckoutPage;

// --- পেমেন্ট বাটন হ্যান্ডলার (Fixed Logic) ---
const StripeButton = ({ amount, paymentData, isDisabled }: any) => {
  const { mutate: handleCreatePayment, isPending } = useCreatePayment({
    onSuccess: (data: any) => {
      if (data.data?.url) window.location.href = data.data.url;
    },
    onError: (err: any) => toast.error(err.message || "Payment Failed"),
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
      color="primary"
      className="w-full h-12 bg-blue-600 font-bold"
      disabled={isPending || isDisabled}
      onPress={() => handleCreatePayment(paymentData)}>
      {isPending ? "Redirecting..." : `Pay $${amount} with PayPal`}
    </Button>
  );
};
