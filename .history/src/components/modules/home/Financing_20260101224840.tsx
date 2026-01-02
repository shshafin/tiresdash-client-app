"use client";

import {
  ShieldCheck,
  Lock,
  CreditCard,
  LifeBuoy,
  Zap,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

const PaymentGatewaysSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-white dark:bg-black transition-colors duration-500">
      {/* 🏁 Racing Background Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* 🛡️ Header: Heavy Security Vibe */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white/5 border border-white/10 px-5 py-2 rounded-sm transform -skew-x-12 mb-6 shadow-xl">
            <Lock
              size={14}
              className="text-orange-600"
            />
            <span className="text-white font-black uppercase italic text-[10px] tracking-[0.4em]">
              Encrypted Checkout Protocol
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white leading-none mb-6">
            SECURE & <span className="text-orange-600">SEAMLESS</span>
          </h2>
          <p className="max-w-xl mx-auto text-xs sm:text-sm font-bold uppercase italic text-gray-400 tracking-widest leading-relaxed">
            Every transaction is protected by bank-level encryption.{" "}
            <br className="hidden sm:block" />
            Your sensitive data never touches our local storage.
          </p>
        </div>

        {/* 🛠️ Security Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {/* Card 01: Secure Processing */}
          <div className="group relative bg-gray-50 dark:bg-[#0f1115] p-10 rounded-[40px] border-2 border-transparent hover:border-blue-600/30 transition-all duration-500 overflow-hidden shadow-2xl">
            <div className="relative z-20">
              <div className="size-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-[0_15px_30px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">
                <ShieldCheck
                  size={32}
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter mb-4">
                Enterprise Protection
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase italic tracking-wider leading-relaxed mb-8">
                We leverage 256-bit SSL encryption and PCI DSS Level 1
                compliance to ensure your payment info is handled with maximum
                precision.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "SSL Encrypted",
                  "PCI Compliant",
                  "2FA Ready",
                  "No Data Logs",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-blue-600"
                    />
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* Watermark */}
            <Lock className="absolute -right-10 -bottom-10 size-48 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>

          {/* Card 02: Total Coverage */}
          <div className="group relative bg-gray-50 dark:bg-[#0f1115] p-10 rounded-[40px] border-2 border-transparent hover:border-orange-600/30 transition-all duration-500 overflow-hidden shadow-2xl">
            <div className="relative z-20">
              <div className="size-16 rounded-2xl bg-orange-600 flex items-center justify-center text-white mb-8 shadow-[0_15px_30px_rgba(234,88,12,0.3)] group-hover:scale-110 transition-transform">
                <CreditCard
                  size={32}
                  strokeWidth={2.5}
                />
              </div>
              <h3 className="text-3xl font-black dark:text-white uppercase italic tracking-tighter mb-4">
                Global Payment Gateways
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase italic tracking-wider leading-relaxed mb-8">
                Whether you pay via credit card, mobile wallet, or bank
                transfer, our partners ensure a fail-safe checkout experience
                every time.
              </p>
              <div className="flex flex-wrap gap-4">
                {/* Subtle Card Icons Vibe */}
                <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
                  <span className="text-[10px] font-black italic tracking-widest">
                    VISA / MASTERCARD
                  </span>
                </div>
                <div className="px-4 py-2 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
                  <span className="text-[10px] font-black italic tracking-widest">
                    DIGITAL WALLETS
                  </span>
                </div>
              </div>
            </div>
            {/* Watermark */}
            <Zap className="absolute -right-10 -bottom-10 size-48 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
        </div>

        {/* 🛡️ Money-Back Guarantee: The "Safety Net" */}
        <div className="relative bg-gradient-to-br from-[#111318] to-black rounded-[48px] p-8 sm:p-16 overflow-hidden border-2 border-orange-600/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
          <div className="relative z-20 flex flex-col lg:flex-row items-center gap-12">
            <div className="shrink-0">
              <div className="relative size-32 sm:size-48">
                <div className="absolute inset-0 bg-orange-600 blur-[40px] opacity-40 animate-pulse" />
                <div className="relative h-full w-full rounded-full border-4 border-orange-600/50 flex items-center justify-center bg-[#111318]">
                  <ShieldAlert
                    size={80}
                    className="text-orange-600 animate-bounce"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-6">
              <h3 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
                30-DAY <span className="text-orange-600">GUARANTEE</span>
              </h3>
              <p className="text-sm sm:text-base font-bold text-gray-400 uppercase italic tracking-widest leading-relaxed max-w-2xl">
                Shop with uncompromised confidence. If you're not 100% satisfied
                with your tires or wheels, we provide a full refund. No
                questions. No friction.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Secure Pay",
                    sub: "Bank-Grade Protection",
                  },
                  {
                    icon: LifeBuoy,
                    title: "24/7 Support",
                    sub: "Mission Ready Assistance",
                  },
                  {
                    icon: Zap,
                    title: "Best Price",
                    sub: "Price Match Lock-in",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center lg:items-start space-y-2">
                    <feat.icon
                      size={20}
                      className="text-orange-600"
                    />
                    <h4 className="text-xs font-black text-white uppercase italic tracking-tighter">
                      {feat.title}
                    </h4>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                      {feat.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Parallax Design Element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 -skew-x-12 transform translate-x-1/2" />
        </div>
      </div>
    </section>
  );
};

export default PaymentGatewaysSection;
