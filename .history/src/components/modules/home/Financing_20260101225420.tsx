"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Zap,
  ArrowRight,
  CheckCircle2,
  Headphones,
} from "lucide-react";

const PaymentGatewaysSection = () => {
  return (
    <section className="relative py-16 px-4 bg-white dark:bg-[#050505] transition-colors duration-500">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* 🛡️ Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full mb-4">
            <Lock
              size={12}
              className="text-orange-600"
            />
            <span className="dark:text-gray-400 text-gray-600 font-bold uppercase text-[9px] tracking-[0.2em]">
              Security Protocol v2.1
            </span>
          </div>

          <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none mb-4">
            SAFE <span className="text-orange-600">&</span> SECURE
          </h2>
        </div>

        {/* 🛠️ Modern Grid with Animated Gradient Borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Card 01: Encryption */}
          <div className="group relative p-[2px] rounded-[24px] overflow-hidden">
            {/* 🏃 Animated Border Logic */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#EAB308_0%,#EA580C_50%,#EAB308_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-gray-50 dark:bg-[#0f1115] p-6 rounded-[23px] h-full z-10 border border-gray-200 dark:border-white/5">
              <ShieldCheck
                size={24}
                className="text-orange-600 mb-4"
              />
              <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter mb-2">
                Iron-Clad Security
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-normal mb-4">
                256-bit SSL encryption protects every byte of your data during
                checkout.
              </p>
              <ul className="space-y-1.5">
                {["Bank-Grade SSL", "PCI-DSS Level 1"].map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500"
                    />{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 02: Privacy */}
          <div className="group relative p-[2px] rounded-[24px] overflow-hidden">
            {/* 🏃 Animated Border Logic */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#3B82F6_0%,#1E40AF_50%,#3B82F6_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-gray-50 dark:bg-[#0f1115] p-6 rounded-[23px] h-full z-10 border border-gray-200 dark:border-white/5">
              <CreditCard
                size={24}
                className="text-blue-600 mb-4"
              />
              <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter mb-2">
                Privacy First
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-normal mb-4">
                We never store your card details. Transactions are handled by
                global providers.
              </p>
              <ul className="space-y-1.5">
                {["No Local Logs", "Instant Tokenization"].map((t, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <CheckCircle2
                      size={12}
                      className="text-blue-500"
                    />{" "}
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 03: Support */}
          <div className="group relative p-[2px] rounded-[24px] overflow-hidden">
            {/* 🏃 Animated Border Logic */}
            <div className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10B981_0%,#047857_50%,#10B981_100%)] opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative bg-gray-50 dark:bg-[#0f1115] p-6 rounded-[23px] h-full z-10 border border-gray-200 dark:border-white/5 flex flex-col">
              <Headphones
                size={24}
                className="text-emerald-600 mb-4"
              />
              <h3 className="text-lg font-black dark:text-white uppercase italic tracking-tighter mb-2">
                Live Support
              </h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight leading-normal mb-4">
                Encountered an issue? Our pit-crew is ready to assist you 24/7.
              </p>
              <Link
                href="/contact"
                className="mt-auto text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Help <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>

        {/* 🛡️ The Orange-Red Trust Strip */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="size-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <Zap
                size={24}
                className="text-orange-600 fill-current"
              />
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white uppercase italic tracking-tighter leading-none">
                30-Day Money Back Guarantee
              </h4>
              <p className="text-[9px] sm:text-[10px] font-bold text-orange-100 uppercase tracking-[0.2em] mt-1">
                Zero Risk. Total Satisfaction. No Questions Asked.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="px-5 py-2.5 bg-black/20 rounded-lg border border-white/10 flex items-center justify-center min-w-[120px]">
              <span className="text-[9px] font-black text-white uppercase tracking-widest text-center">
                Verified Partner
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default PaymentGatewaysSection;
