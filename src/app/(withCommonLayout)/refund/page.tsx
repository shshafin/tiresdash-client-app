"use client";

import React from "react";
import {
  ShieldAlert,
  RefreshCcw,
  PackageX,
  Truck,
  Mail,
  HelpCircle,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const RefundPage: React.FC = () => {
  const policies = [
    {
      title: "01. TOTAL TRANSPARENCY",
      icon: <HelpCircle size={20} />,
      text: "We don't hide behind legal jargon. If you're not satisfied, we're not satisfied. Our goal is to keep you moving, and our refund process is built on that trust.",
    },
    {
      title: "02. ELIGIBILITY CRITERIA",
      icon: <ShieldAlert size={20} />,
      text: "Received a defective unit or damaged shipment? No worries. Return it within 7 days. If we messed up the description, we'll fix it immediately.",
    },
    {
      title: "03. THE 'NO' LIST",
      icon: <PackageX size={20} />,
      text: "To stay fair, we can't refund custom orders, tires that have hit the asphalt (used), or products damaged by aggressive misuse.",
    },
    {
      title: "04. RAPID REFUND CYCLE",
      icon: <RefreshCcw size={20} />,
      text: "Approved refunds hit your original payment method in 5–7 business days. No endless waiting, no run-around. Pure speed.",
    },
    {
      title: "05. LOGISTICS & SHIPPING",
      icon: <Truck size={20} />,
      text: "Shipping is on us if the error was ours. For change-of-mind returns, the logistics cost is handled by the client.",
    },
    {
      title: "06. DIRECT INTEL",
      icon: <Mail size={20} />,
      text: "Still confused? Skip the FAQ and hit us up at info@tiresdash.com. We're here to settle things fast.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      {/* 🏎️ Tactical Header: Now in Deep Emerald Money Gradient */}
      <header className="relative py-24 sm:py-32 px-4 text-center overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#022c22] to-black">
        {/* Carbon Fiber Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl">
            <ShieldAlert
              size={12}
              className="fill-current"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Purchase Protection
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-emerald-50  leading-none mb-6">
            REFUND{" "}
            <span className="text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              PROTOCOL
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-emerald-100/70 tracking-[0.2em] leading-relaxed">
            SECURE RETURNS. RAPID PROCESSING. <br className="hidden sm:block" />
            OUR COMMITMENT TO YOUR CAPITAL IS ABSOLUTE.
          </p>
        </div>
      </header>

      {/* 🛠️ Policy Grid */}
      <main className="max-w-6xl mx-auto py-12 sm:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {policies.map((policy, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 dark:bg-[#0f1115] p-6 sm:p-8 rounded-[24px] sm:rounded-[35px] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-emerald-600/30 hover:-translate-y-2 overflow-hidden shadow-xl">
              {/* Background Number */}
              <div className="absolute -right-4 -top-4 text-7xl font-black text-black/5 dark:text-white/5 italic">
                {idx + 1}
              </div>

              <div className="relative z-10">
                {/* Icon Box: Turns Black on Hover */}
                <div className="size-10 sm:size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-gray-100 dark:border-white/10 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-500 text-emerald-600">
                  {policy.icon}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3 group-hover:text-emerald-500 transition-colors">
                  {policy.title}
                </h2>

                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-wider">
                  {policy.text}
                </p>
              </div>

              {/* Hover Bottom Glow */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* 🚀 Supportive Footer CTA: Fixed Interaction */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] bg-gray-900 dark:bg-[#0f1115] border-2 border-emerald-600/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          {/* Decorative Element: pointer-events-none added to fix click issues */}
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
            <RefreshCcw size={150} />
          </div>

          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              STILL NEED CLARITY?
            </h3>
            <p className="text-[9px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
              Our experts are standby. Instant resolution is our priority.
            </p>
          </div>

          <Link
            href="/contact"
            className="relative z-20 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-4 sm:py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] sm:text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <span>Speak to an Expert</span>
              <ArrowRight size={14} />
            </button>
          </Link>
        </div>
      </main>

      <style jsx>{`
        @keyframes scan {
          0% {
            top: 0%;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RefundPage;
