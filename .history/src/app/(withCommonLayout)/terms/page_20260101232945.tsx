"use client";

import React from "react";
import {
  ShieldCheck,
  Gavel,
  UserCircle,
  AlertTriangle,
  ShoppingBag,
  Scale,
  Zap,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

const TermsPage: React.FC = () => {
  const sections = [
    {
      title: "01. THE AGREEMENT",
      icon: <Gavel size={20} />,
      text: "By engaging with TyresDash, purchasing our elite tire units, or utilizing our pit-services, you are entering into a binding performance contract. We don't do small print—just straight talk.",
    },
    {
      title: "02. INVENTORY & PRICING",
      icon: <ShoppingBag size={20} />,
      text: "Our stock moves fast. Prices and availability are live and subject to change based on market velocity. Once your order is staged, the price is locked and secured.",
    },
    {
      title: "03. SECURE TRANSACTIONS",
      icon: <ShieldCheck size={20} />,
      text: "All capital transfers are handled via encrypted global gateways. Your financial data is a 'No-Fly Zone'—we process it, we don't store it. Total security is our baseline.",
    },
    {
      title: "04. PILOT RESPONSIBILITIES",
      icon: <UserCircle size={20} />,
      text: "You are responsible for accurate data entry at checkout. Misuse of our platform or fraudulent maneuvers will result in immediate mission termination (account suspension).",
    },
    {
      title: "05. LIABILITY LIMITS",
      icon: <AlertTriangle size={20} />,
      text: "TyresDash is not liable for indirect damages or incidental machine failures. We provide the gear; how you dominate the track is your responsibility. Safety first, always.",
    },
    {
      title: "06. GOVERNING LAW",
      icon: <Scale size={20} />,
      text: "These terms are the final word. Any disputes will be resolved under the legal framework of our operating jurisdiction. We play fair, and we expect the same.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      {/* 🏎️ Tactical Header: Rose & Crimson Gradient */}
      <header className="relative py-24 sm:py-32 px-4 text-center overflow-hidden bg-gradient-to-br from-[#4c0519] via-[#881337] to-black">
        {/* Carbon Fiber Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line (Rose Tint) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-rose-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl shadow-rose-900/40">
            <Zap
              size={12}
              className="fill-current"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Operational Framework
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            TERMS OF{" "}
            <span className="text-rose-400 drop-shadow-[0_0_20px_rgba(251,113,133,0.4)]">
              MISSION
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-rose-100/70 tracking-[0.2em] leading-relaxed">
            THE RULES OF ENGAGEMENT. BY UTILIZING TYRESDASH{" "}
            <br className="hidden sm:block" />
            PLATFORMS, YOU AGREE TO THESE PROTOCOLS.
          </p>
        </div>
      </header>

      {/* 🛠️ Terms Grid */}
      <main className="max-w-6xl mx-auto py-12 sm:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 dark:bg-[#0f1115] p-6 sm:p-8 rounded-[24px] sm:rounded-[35px] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-rose-600/30 hover:-translate-y-2 overflow-hidden shadow-xl">
              {/* Floating Number Watermark */}
              <div className="absolute -right-4 -top-4 text-7xl font-black text-black/5 dark:text-white/5 italic">
                {idx + 1}
              </div>

              <div className="relative z-10">
                {/* Icon Box: Turns Black on Rose Hover */}
                <div className="size-10 sm:size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-gray-100 dark:border-white/10 group-hover:bg-rose-500 group-hover:text-black transition-all duration-500 text-rose-600">
                  {section.icon}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3 group-hover:text-rose-500 transition-colors">
                  {section.title}
                </h2>

                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-wider">
                  {section.text}
                </p>
              </div>

              {/* Hover Bottom Glow Strip */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* 🚀 Tactical Support Footer */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] bg-gray-900 dark:bg-[#0f1115] border-2 border-rose-600/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
            <FileText size={150} />
          </div>

          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              QUESTIONS ON RULES?
            </h3>
            <p className="text-[9px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
              Our legal pit-crew is ready to clarify any mission protocols.
            </p>
          </div>

          <Link
            href="/contact"
            className="relative z-20 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-rose-600 text-white px-8 py-4 sm:py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] sm:text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <span>Request Support</span>
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
  Section;
};

export default TermsPage;
