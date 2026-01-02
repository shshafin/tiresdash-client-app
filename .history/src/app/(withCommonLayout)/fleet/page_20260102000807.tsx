"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Shield,
  Clock,
  CreditCard,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  Award,
  Zap,
  Globe,
  BarChart3,
  CheckCircle,
} from "lucide-react";

// 🏎️ Tactical Variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
};

// 🛰️ Fleet-Specific Button (Orange-Red Theme)
const CTAButton = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <Link
    href="http://fleet.tiresdash.com/register"
    target="_blank"
    rel="noopener noreferrer">
    <motion.span
      className={`inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-white hover:text-white text-black font-black uppercase italic tracking-widest text-[10px] sm:text-xs rounded-none skew-x-[-12deg] shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-500 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}>
      <span className="skew-x-[12deg] flex items-center gap-2">
        {children} <ArrowRight size={16} />
      </span>
    </motion.span>
  </Link>
);

const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <motion.div
    className="group relative bg-gray-50 dark:bg-[#0f1115] p-8 rounded-none border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-orange-600/30 hover:-translate-y-2 overflow-hidden"
    variants={fadeInUp}>
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:bg-orange-600 group-hover:text-white transition-all text-orange-600">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3 group-hover:text-orange-600 transition-colors">
      {title}
    </h3>
    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase italic leading-relaxed tracking-widest">
      {description}
    </p>
  </motion.div>
);

export default function FleetPage() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-500">
      {/* 🏎️ Tactical Hero: Orange-Red Velocity Theme */}
      <header className="relative pt-24 pb-32 px-4 text-center overflow-hidden bg-gradient-to-br from-orange-700 via-red-900 to-black">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Animated Scan Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-orange-400/30 animate-scan pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}>
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-1 transform -skew-x-12 mb-8 shadow-2xl border border-orange-600/50">
              <Zap
                size={14}
                className="text-orange-500 animate-pulse fill-current"
              />
              <span className="font-black uppercase italic text-[9px] tracking-[0.4em]">
                Fleet Command Center
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85] mb-8">
              DOMINATE{" "}
              <span className="text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                LOGISTICS.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-[10px] sm:text-xs font-bold uppercase italic text-orange-100/70 tracking-[0.2em] leading-relaxed mb-12">
              REDUCE DOWNTIME. OPTIMIZE OVERHEAD. SECURE YOUR OPERATIONS{" "}
              <br className="hidden sm:block" />
              WITH THE MOST ADVANCED FLEET TIRE PROTOCOL ON THE MARKET.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton>Authorize Fleet Access</CTAButton>
              <Link href="#intel">
                <button className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase italic tracking-widest text-[10px] sm:text-xs skew-x-[-12deg] hover:bg-orange-600 hover:border-orange-600 transition-all duration-500">
                  <span className="skew-x-[12deg]">View Protocol</span>
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* 🛠️ Strategic Intel Grid */}
      <section
        id="intel"
        className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter mb-4">
            Tactical Advantages
          </h2>
          <div className="w-20 h-1 bg-orange-600 mx-auto transform -skew-x-12" />
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}>
          <FeatureCard
            icon={Shield}
            title="Bulk Unit Pricing"
            description="Save up to 25% on enterprise-scale orders through our high-velocity pricing model."
          />
          <FeatureCard
            icon={Clock}
            title="Priority Pit Stops"
            description="Skip the civilian queue with guaranteed priority slots for every vehicle in your fleet."
          />
          <FeatureCard
            icon={BarChart3}
            title="Performance Analytics"
            description="Deep-dive into wear patterns and ROI data through your dedicated fleet dashboard."
          />
          <FeatureCard
            icon={CreditCard}
            title="Credit Operations"
            description="Flexible billing cycles and consolidated net-payment terms for fluid capital management."
          />
          <FeatureCard
            icon={Globe}
            title="Regional Support"
            description="Deploy consistent maintenance across our certified partner network without friction."
          />
          <FeatureCard
            icon={Award}
            title="Dedicated Manager"
            description="Direct line to a fleet specialist who knows your operational specs inside out."
          />
        </motion.div>
      </section>

      {/* 📊 Comparison: The Command Edge */}
      <section className="py-24 bg-gray-900 dark:bg-[#0f1115] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/grid.png')]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tighter text-white">
              The Command Edge
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">
              Fleet Intelligence vs Standard Retail
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-none border border-white/5 shadow-2xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-orange-600/10 border-b border-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-orange-500">
                    Parameter
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Standard
                  </th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white">
                    Fleet Protocol
                  </th>
                </tr>
              </thead>
              <tbody className="text-[11px] font-bold uppercase italic tracking-widest text-gray-400">
                {[
                  ["Asset Cost", "Market Rate", "High-Volume Rebate"],
                  ["Support Cycle", "Asynchronous", "Synchronous Priority"],
                  ["Fleet Intel", "None", "Real-Time Tracking"],
                  ["Billing", "Instant Pay", "Net-30 Options"],
                ].map(([f, s, fl], i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 text-gray-300">{f}</td>
                    <td className="p-6">{s}</td>
                    <td className="p-6 text-orange-500 flex items-center gap-2">
                      <CheckCircle size={14} /> {fl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 🚀 Deployment Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter mb-20">
          Deployment Cycle
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { t: "Initiate Apply", d: "Submit fleet Intel" },
            { t: "Verification", d: "Account cleared in 24h" },
            { t: "Synchronization", d: "Pricing locks in" },
            { t: "Full Deployment", d: "Track performance" },
          ].map((step, i) => (
            <div
              key={i}
              className="group">
              <div className="size-20 bg-gray-50 dark:bg-white/5 border border-orange-500/20 flex items-center justify-center mx-auto mb-6 transform -rotate-12 group-hover:rotate-0 group-hover:bg-orange-600 transition-all duration-500 shadow-xl">
                <span className="text-3xl font-black italic text-orange-600 dark:text-white group-hover:text-black">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-base font-black uppercase italic tracking-tighter group-hover:text-orange-500 transition-colors">
                {step.t}
              </h3>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {step.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 Final Authorization CTA */}
      <section className="py-32 px-4 bg-gradient-to-br from-orange-600 via-red-900 to-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none mb-8">
            Ready to <span className="text-orange-500">Scale?</span>
          </h2>
          <p className="text-[10px] font-bold uppercase italic text-orange-100/70 tracking-[0.3em] mb-12">
            LOCK IN YOUR CORPORATE PRIVILEGES TODAY.
          </p>
          <CTAButton className="bg-white text-orange-600 hover:bg-black hover:text-white border-0 py-6 px-12">
            Initialize Fleet Account
          </CTAButton>
        </div>
      </section>

      {/* 📱 Sticky Mobile CTA */}
      <div className="fixed bottom-6 right-6 lg:hidden z-[60]">
        <CTAButton className="rounded-full !px-6 !py-6 shadow-[0_0_30px_rgba(234,88,12,0.5)]">
          Join Fleet
        </CTAButton>
      </div>

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
}
