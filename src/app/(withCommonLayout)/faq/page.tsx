"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Settings,
  Truck,
  Calendar,
  Phone,
  ChevronDown,
  Zap,
  ArrowRight,
  Headphones,
} from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    icon: <Shield size={20} />,
    question: "What types of tires do you sell?",
    answer:
      "We offer a high-performance selection including Passenger, SUV, Ultra-High Performance (UHP), and Off-Road tires from world-class manufacturers.",
  },
  {
    icon: <Settings size={20} />,
    question: "Do you provide wheel servicing?",
    answer:
      "Yes. Our pit-crew specialists handle precision alignment, dynamic balancing, and strategic rotation to maximize your tire life.",
  },
  {
    icon: <Lock size={20} />,
    question: "Are my payments secure?",
    answer:
      "Every transaction is shielded with bank-level 256-bit encryption. We prioritize your financial security through verified global protocols.",
  },
  {
    icon: <Truck size={20} />,
    question: "Do you offer fleet services?",
    answer:
      "Correct. We provide comprehensive fleet management, including bulk pricing, scheduled maintenance, and priority logistics for corporate partners.",
  },
  {
    icon: <Calendar size={20} />,
    question: "Can I book appointments online?",
    answer:
      "Absolutely. Our rapid booking system allows you to stage your service appointment in under 60 seconds.",
  },
  {
    icon: <Phone size={20} />,
    question: "Technical Support access?",
    answer:
      "Our tactical support team is standby 24/7. Contact us via the 'Pit Crew Support' portal for immediate assistance.",
  },
];

const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      {/* 🏎️ Tactical Header: Deep Blue & Indigo Knowledge Gradient */}
      <header className="relative py-24 sm:py-32 px-4 text-center overflow-hidden bg-gradient-to-br from-[#1e3a8a] via-[#1e1b4b] to-black">
        {/* Carbon Fiber Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line (Blue Tint) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl">
            <Zap
              size={12}
              className="fill-current animate-pulse"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            GOT{" "}
            <span className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.4)]">
              QUESTIONS?
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-blue-100/70 tracking-[0.2em] leading-relaxed">
            SYSTEM INTEL & OPERATIONAL GUIDANCE.{" "}
            <br className="hidden sm:block" />
            EVERYTHING YOU NEED TO KNOW TO STAY IN CONTROL.
          </p>
        </div>
      </header>

      {/* 🛠️ FAQ Grid: Tactical Design */}
      <main className="max-w-5xl mx-auto py-12 sm:py-20 px-4">
        <div className="grid gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden transition-all duration-500 rounded-2xl border-2 ${
                openIndex === idx
                  ? "border-blue-600 bg-gray-50 dark:bg-[#0f1115]"
                  : "border-gray-100 dark:border-white/5 bg-transparent"
              }`}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-7 text-left">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Icon Box: Turns Black on Blue Hover/Open */}
                  <div
                    className={`p-3 rounded-xl transition-all duration-500 ${
                      openIndex === idx
                        ? "bg-blue-600 text-black rotate-12"
                        : "bg-gray-100 dark:bg-white/5 text-blue-500"
                    }`}>
                    {faq.icon}
                  </div>
                  <h2
                    className={`text-base sm:text-xl font-black uppercase italic tracking-tighter transition-colors ${
                      openIndex === idx
                        ? "text-blue-600"
                        : "text-gray-900 dark:text-white"
                    }`}>
                    {faq.question}
                  </h2>
                </div>
                <ChevronDown
                  className={`transition-transform duration-500 ${
                    openIndex === idx
                      ? "rotate-180 text-blue-600"
                      : "text-gray-400"
                  }`}
                  size={20}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}>
                <div className="px-5 pb-7 pt-0 ml-[68px] sm:ml-[88px] border-l-2 border-blue-600/20">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-wider">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Racing Stripe Decor */}
              <div
                className={`absolute left-0 top-0 h-full w-1 bg-blue-600 transition-all duration-500 ${
                  openIndex === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* 🚀 Tactical Support Footer: Same Compact Style */}
        <div className="mt-12 sm:mt-24 p-5 sm:p-12 rounded-[24px] sm:rounded-[48px] bg-gray-900 dark:bg-[#0f1115] border-2 border-blue-600/10 relative overflow-hidden text-center sm:text-left shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-[0.02] rotate-12 hidden sm:block pointer-events-none">
            <Headphones size={120} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8">
            <div className="space-y-2 sm:space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                <div className="size-1 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                  Active Now
                </span>
              </div>

              <h3 className="text-2xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                NEED A <span className="text-blue-600">QUICK REPLY?</span>
              </h3>

              <p className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase italic tracking-[0.15em] leading-tight max-w-[280px] sm:max-w-md mx-auto sm:mx-0">
                Our team is online. Expect a response{" "}
                <br className="hidden sm:block" /> in minutes, not hours.
              </p>
            </div>

            <Link
              href="/contact"
              className="w-full sm:w-auto group relative z-20">
              <button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 sm:px-10 sm:py-6 rounded-xl sm:rounded-2xl font-black uppercase italic tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs flex items-center justify-center gap-3 sm:gap-4 hover:bg-white hover:text-black transition-all duration-500 active:scale-95 shadow-lg">
                <span>Get Help Now</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform sm:w-5 sm:h-5"
                />
              </button>
            </Link>
          </div>
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

export default FaqPage;
