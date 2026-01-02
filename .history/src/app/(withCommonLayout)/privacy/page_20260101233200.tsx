"use client";

import React from "react";
import {
  ShieldCheck,
  Fingerprint,
  Lock,
  EyeOff,
  Database,
  FileSignature,
  Zap,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

const PrivacyPage: React.FC = () => {
  const sections = [
    {
      title: "01. DATA MANIFESTO",
      icon: <Fingerprint size={20} />,
      text: "Your privacy is your digital fortress. We don't just 'respect' it; we build our entire infrastructure around it. No third-party sales. No data leaks. Absolute protection.",
    },
    {
      title: "02. INTEL GATHERING",
      icon: <Database size={20} />,
      text: "We collect only what's mission-critical. Account details and browsing behavior are analyzed solely to optimize your high-speed experience on our platform.",
    },
    {
      title: "03. ENCRYPTED CAPITAL",
      icon: <Lock size={20} />,
      text: "Financial transfers are handled via bank-grade SSL tunnels. Your card details are never cached on our local servers. What happens in checkout stays in checkout.",
    },
    {
      title: "04. TRACKING PROTOCOLS",
      icon: <EyeOff size={20} />,
      text: "We use cookies as tactical sensors to enhance functionality. You have the master override—manage your tracking preferences at any time through your dashboard.",
    },
    {
      title: "05. PILOT PRIVILEGES",
      icon: <ShieldCheck size={20} />,
      text: "You own the data. Access it, modify it, or initiate a total wipe-out (deletion) whenever you choose. You are the sole commander of your personal information.",
    },
    {
      title: "06. SYSTEM UPDATES",
      icon: <FileSignature size={20} />,
      text: "Privacy laws evolve, and so do we. Any tactical changes to our policy will be logged here instantly. Transparency is our baseline for every mission.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      {/* 🏎️ Tactical Header: Deep Purple & Indigo Security Gradient */}
      <header className="relative py-24 sm:py-32 px-4 text-center overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-black">
        {/* Carbon Fiber Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line (Indigo Tint) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-indigo-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1 transform -skew-x-12 mb-6 shadow-2xl shadow-indigo-900/40">
            <ShieldAlert
              size={12}
              className="fill-current"
            />
            <span className="font-black uppercase italic text-[9px] tracking-[0.3em]">
              Data Security Protocol
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-none mb-6">
            PRIVACY{" "}
            <span className="text-indigo-400 drop-shadow-[0_0_20px_rgba(129,140,248,0.4)]">
              MANIFESTO
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-[9px] sm:text-xs font-bold uppercase italic text-indigo-100/70 tracking-[0.2em] leading-relaxed">
            YOUR DIGITAL FORTRESS IS OUR PRIORITY. UNDERSTAND{" "}
            <br className="hidden sm:block" />
            HOW WE SHIELD YOUR INTEL AT TYRESDASH.
          </p>
        </div>
      </header>

      {/* 🛠️ Privacy Grid */}
      <main className="max-w-6xl mx-auto py-12 sm:py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="group relative bg-gray-50 dark:bg-[#0f1115] p-6 sm:p-8 rounded-[24px] sm:rounded-[35px] border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-indigo-600/30 hover:-translate-y-2 overflow-hidden shadow-xl">
              {/* Floating Number Watermark */}
              <div className="absolute -right-4 -top-4 text-7xl font-black text-black/5 dark:text-white/5 italic">
                {idx + 1}
              </div>

              <div className="relative z-10">
                {/* Icon Box: Turns Black on Indigo Hover */}
                <div className="size-10 sm:size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-gray-100 dark:border-white/10 group-hover:bg-indigo-500 group-hover:text-black transition-all duration-500 text-indigo-600">
                  {section.icon}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3 group-hover:text-indigo-500 transition-colors">
                  {section.title}
                </h2>

                <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-wider">
                  {section.text}
                </p>
              </div>

              {/* Hover Bottom Glow Strip */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* 🚀 Tactical Support Footer */}
        <div className="mt-16 sm:mt-24 p-6 sm:p-12 rounded-[32px] sm:rounded-[48px] bg-gray-900 dark:bg-[#0f1115] border-2 border-indigo-600/10 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 pointer-events-none">
            <ShieldCheck size={150} />
          </div>

          <div className="relative z-10 text-center sm:text-left">
            <h3 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-tighter mb-2">
              DATA CONCERNS?
            </h3>
            <p className="text-[9px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest leading-none">
              Our security experts are on high alert. Command your data now.
            </p>
          </div>

          <Link
            href="/contact"
            className="relative z-20 w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 sm:py-5 rounded-2xl font-black uppercase italic tracking-[0.2em] text-[10px] sm:text-xs hover:bg-white hover:text-black transition-all duration-500 shadow-xl active:scale-95 flex items-center justify-center gap-3">
              <span>Initiate Secure Comms</span>
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

export default PrivacyPage;
