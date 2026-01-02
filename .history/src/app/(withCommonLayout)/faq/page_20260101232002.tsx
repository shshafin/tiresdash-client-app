"use client";

import React, { useState } from "react";
import {
  Shield,
  User,
  Lock,
  Settings,
  Key,
  FileText,
  Truck,
  Calendar,
  DollarSign,
  Phone,
  ChevronDown,
  Zap,
  ArrowRight,
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
      {/* 🏎️ Sporty Hero Header */}
      <header className="relative py-24 px-4 text-center overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute -bottom-1 left-0 w-full h-16 bg-gradient-to-t from-[#050505] to-transparent z-10" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl">
            <Zap
              size={14}
              className="animate-pulse fill-current"
            />
            <span className="font-black uppercase italic text-[10px] tracking-[0.3em]">
              Knowledge Base
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            GOT <span className="text-orange-600">QUESTIONS?</span>
          </h1>
          <p className="max-w-xl mx-auto text-[10px] sm:text-xs font-bold uppercase italic text-gray-400 tracking-[0.2em] leading-relaxed">
            Everything you need to know about <br className="hidden sm:block" />{" "}
            mission-critical tire performance and support.
          </p>
        </div>
      </header>

      {/* 🛠️ FAQ Grid: Tactical Design */}
      <main className="max-w-5xl mx-auto py-16 px-4">
        <div className="grid gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className={`group relative overflow-hidden transition-all duration-500 rounded-2xl border-2 ${
                openIndex === idx
                  ? "border-orange-600 bg-gray-50 dark:bg-[#0f1115]"
                  : "border-gray-100 dark:border-white/5 bg-transparent"
              }`}>
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 sm:p-7 text-left">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div
                    className={`p-3 rounded-xl transition-all duration-500 ${
                      openIndex === idx
                        ? "bg-orange-600 text-white rotate-12"
                        : "bg-gray-100 dark:bg-white/5 text-gray-400"
                    }`}>
                    {faq.icon}
                  </div>
                  <h2
                    className={`text-base sm:text-xl font-black uppercase italic tracking-tighter transition-colors ${
                      openIndex === idx
                        ? "text-orange-600"
                        : "text-gray-900 dark:text-white"
                    }`}>
                    {faq.question}
                  </h2>
                </div>
                <ChevronDown
                  className={`transition-transform duration-500 ${openIndex === idx ? "rotate-180 text-orange-600" : "text-gray-400"}`}
                  size={20}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === idx
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}>
                <div className="px-5 pb-7 pt-0 ml-[68px] sm:ml-[88px] border-l-2 border-orange-600/20">
                  <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-wider">
                    {faq.answer}
                  </p>
                </div>
              </div>

              {/* Racing Stripe Decor */}
              <div
                className={`absolute left-0 top-0 h-full w-1 bg-orange-600 transition-all duration-500 ${
                  openIndex === idx ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* 🚀 Tactical Support Footer */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] bg-gray-900 dark:bg-[#0f1115] border-2 border-orange-600/10 relative overflow-hidden text-center sm:text-left shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]">
          {/* ⚡ Background Decorative Icon */}
          <div className="absolute top-0 right-0 p-6 sm:p-10 opacity-[0.03] rotate-12">
            <Headphones size={150} />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              {/* 🟢 Live Status Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                <div className="size-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">
                  Support Agents Online
                </span>
              </div>

              <h3 className="text-3xl sm:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                NEED AN <br className="hidden sm:block" />
                <span className="text-orange-600">INSTANT RESPONSE?</span>
              </h3>

              <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase italic tracking-widest leading-relaxed max-w-md mx-auto sm:mx-0">
                Our dedicated support team is active and ready to assist you.
                Expect a breakthrough response in minutes, not hours.
              </p>
            </div>

            <Link
              href="/contact"
              className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto bg-orange-600 text-white px-10 py-5 sm:py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] sm:text-xs flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all duration-500 shadow-[0_20px_40px_rgba(234,88,12,0.3)] group-active:scale-95">
                <span>Connect To Live Support</span>
                <div className="bg-white/10 p-1 rounded-md group-hover:bg-black/10 transition-colors">
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default FaqPage;
