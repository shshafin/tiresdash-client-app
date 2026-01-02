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
  FileText,
  TrendingUp,
  MapPin,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  Users,
  Award,
  Zap,
  Globe,
  BarChart3,
  ShieldAlert,
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

// 🛰️ Fleet-Specific Button
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
      className={`inline-flex items-center px-8 py-4 bg-sky-600 hover:bg-white hover:text-black text-white font-black uppercase italic tracking-widest text-[10px] sm:text-xs rounded-none skew-x-[-12deg] shadow-[0_0_20px_rgba(2,132,199,0.3)] transition-all duration-500 ${className}`}
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
    className="group relative bg-gray-50 dark:bg-[#0f1115] p-8 rounded-none border border-gray-100 dark:border-white/5 transition-all duration-500 hover:border-sky-500/30 hover:-translate-y-2 overflow-hidden"
    variants={fadeInUp}>
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 group-hover:opacity-10 transition-opacity">
      <Icon size={80} />
    </div>
    <div className="size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-6 shadow-inner group-hover:bg-sky-500 group-hover:text-black transition-all">
      <Icon size={24} />
    </div>
    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-3 group-hover:text-sky-500 transition-colors">
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
      {/* 🏎️ Tactical Hero: Sky Blue Aero Theme */}
      <header className="relative pt-24 pb-32 px-4 text-center overflow-hidden bg-gradient-to-br from-sky-600 via-sky-900 to-black">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-sky-300/40 animate-scan pointer-events-none" />

        <div className="relative z-20 max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}>
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-1 transform -skew-x-12 mb-8 shadow-2xl">
              <Zap
                size={14}
                className="fill-current animate-pulse"
              />
              <span className="font-black uppercase italic text-[9px] tracking-[0.4em]">
                Fleet Command Center
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white leading-[0.85] mb-8">
              DOMINATE{" "}
              <span className="text-sky-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
                LOGISTICS.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-2xl mx-auto text-[10px] sm:text-xs font-bold uppercase italic text-sky-100/70 tracking-[0.2em] leading-relaxed mb-12">
              REDUCE DOWNTIME. OPTIMIZE OVERHEAD. SECURE YOUR OPERATIONS{" "}
              <br className="hidden sm:block" />
              WITH THE MOST ADVANCED FLEET TIRE PROTOCOL ON THE MARKET.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton>Authorize Fleet Access</CTAButton>
              <Link href="#intel">
                <button className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase italic tracking-widest text-[10px] sm:text-xs skew-x-[-12deg] hover:bg-white hover:text-black transition-all duration-500">
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
          <div className="w-20 h-1 bg-sky-600 mx-auto transform -skew-x-12" />
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
                <tr className="bg-sky-600/10 border-b border-white/5">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-sky-400">
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
                    <td className="p-6 text-sky-500 flex items-center gap-2">
                      <CheckCircle size={14} /> {fl}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 🚀 Operational Deployment Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter">
            Deployment Cycle
          </h2>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-2">
            Go live in 4 simple maneuvers
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-sky-600/30 to-transparent" />
          {[
            { t: "Initiate Apply", d: "Submit your fleet Intel" },
            { t: "Verification", d: "Account cleared in 24h" },
            { t: "Synchronization", d: "Pricing locks in" },
            { t: "Full Deployment", d: "Track performance live" },
          ].map((step, i) => (
            <div
              key={i}
              className="text-center relative group">
              <div className="size-20 rounded-none bg-gray-50 dark:bg-white/5 border border-sky-500/20 flex items-center justify-center mx-auto mb-8 transform -rotate-12 group-hover:rotate-0 group-hover:bg-sky-600 transition-all duration-500 shadow-xl">
                <span className="text-3xl font-black italic text-gray-900 dark:text-white group-hover:text-black">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-black uppercase italic tracking-tighter mb-2 group-hover:text-sky-500 transition-colors">
                {step.t}
              </h3>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                {step.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 Pilot Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-[#0b0c10] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                n: "Sarah Johnson",
                c: "Metro Logistics",
                q: "TyresDash cut our fleet overhead by 30% while eliminating critical downtime.",
              },
              {
                n: "Mike Chen",
                c: "Swift Transport",
                q: "The analytics provided through the dashboard are a game changer for our ROI.",
              },
              {
                n: "Lisa Rodriguez",
                c: "City Delivery",
                q: "Priority support and bulk pricing allowed us to scale without friction.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-8 bg-white dark:bg-[#0f1115] rounded-none sm:rounded-tr-[40px] border-l-4 border-sky-500 shadow-lg">
                <div className="flex mb-6 text-sky-500">
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                  <Star
                    size={16}
                    fill="currentColor"
                  />
                </div>
                <p className="text-sm font-bold uppercase italic text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  "{t.q}"
                </p>
                <div>
                  <p className="font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">
                    {t.n}
                  </p>
                  <p className="text-[9px] font-black text-sky-600 uppercase tracking-[0.2em]">
                    {t.c}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ❓ Support Frequency */}
      <section className="py-24 max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter">
            Operational FAQ
          </h2>
        </div>
        <div className="space-y-4">
          {[
            {
              q: "What is the minimum fleet requirement?",
              a: "The program is optimized for businesses with 5 or more units.",
            },
            {
              q: "How is fleet pricing calculated?",
              a: "Tiered volume discounts based on annual operational velocity.",
            },
            {
              q: "Is emergency support available?",
              a: "Yes, fleet commanders get 24/7 priority roadside intervention.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-white/5 border border-white/5">
              <button
                onClick={() => setOpenAccordion(openAccordion === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center group">
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-sky-500 transition-colors">
                  {item.q}
                </span>
                <ChevronDown
                  className={`transition-transform duration-500 ${openAccordion === i ? "rotate-180 text-sky-500" : ""}`}
                />
              </button>
              {openAccordion === i && (
                <div className="px-6 pb-6 text-[10px] font-bold uppercase italic text-gray-400 tracking-widest animate-in fade-in slide-in-from-top-1">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 Final Authorization CTA */}
      <section className="py-32 px-4 bg-gradient-to-br from-sky-600 via-sky-800 to-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none mb-8">
            Ready to <span className="text-sky-400">Scale?</span>
          </h2>
          <p className="text-[10px] font-bold uppercase italic text-sky-100/70 tracking-[0.3em] mb-12">
            LOCK IN YOUR CORPORATE PRIVILEGES TODAY.
          </p>
          <CTAButton className="bg-white text-sky-900 hover:bg-black hover:text-white border-0 py-6 px-12">
            Initialize Fleet Account
          </CTAButton>
        </div>
      </section>

      {/* 📱 Sticky Mobile CTA (Tactical) */}
      <div className="fixed bottom-6 right-6 lg:hidden z-[60]">
        <CTAButton className="rounded-full !px-6 !py-6 shadow-[0_0_30px_rgba(2,132,199,0.5)]">
          Join Fleet
        </CTAButton>
      </div>
    </div>
  );
}
