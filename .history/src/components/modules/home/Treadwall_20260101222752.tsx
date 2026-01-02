"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Star,
  Clock,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  TrendingUp,
  Heart,
  Zap,
  Target,
  Activity,
} from "lucide-react";

const TreadWellSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-white dark:bg-black">
      {/* 🏎️ Racing Background Decals */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')]" />
        <div className="absolute top-40 -right-20 size-[500px] bg-orange-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 -left-20 size-[500px] bg-red-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* 🏁 Hero Header: High Velocity */}
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 bg-black dark:bg-white/5 border border-white/10 px-6 py-2 rounded-sm transform -skew-x-12 mb-8 shadow-xl">
            <TrendingUp
              size={14}
              className="text-orange-600 animate-bounce"
            />
            <span className="text-white font-black uppercase italic text-xs tracking-[0.3em]">
              Precision Engineered Selection
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.85] mb-8 uppercase italic tracking-tighter">
            <span className="dark:text-white text-gray-900">TIRED OF TIRE</span>
            <br />
            <span className="text-orange-600 drop-shadow-[0_0_30px_rgba(234,88,12,0.3)]">
              CONFUSION?
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-500 font-bold uppercase italic tracking-widest max-w-3xl mx-auto mb-10 leading-relaxed">
            Ditch the sales fluff. Get{" "}
            <span className="text-orange-600 underline decoration-2 underline-offset-8">
              Battle-Tested
            </span>{" "}
            recommendations synced to your chassis, budget, and driving
            intensity.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              {
                icon: ShieldCheck,
                label: "Expert Verified",
                color: "text-blue-500",
              },
              {
                icon: Users,
                label: "75K+ Active Units",
                color: "text-emerald-500",
              },
              {
                icon: Award,
                label: "Industry Elite",
                color: "text-purple-500",
              },
            ].map((tag, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/10">
                <tag.icon className={`size-4 ${tag.color}`} />
                <span className="text-[10px] font-black uppercase italic text-gray-600 dark:text-gray-400">
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 🛠️ Visual Grid: The Lab */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {/* Card 01: The Hub */}
          <div className="relative group overflow-hidden rounded-[40px] border-2 border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0f1115] p-2">
            <Image
              src="/deals.jpg"
              alt="Trusted Expert"
              width={500}
              height={500}
              className="rounded-[38px] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
              <h3 className="text-2xl font-black text-white uppercase italic leading-none tracking-tighter">
                Your Performance
                <br />
                <span className="text-orange-600">Command Center</span>
              </h3>
            </div>
          </div>

          {/* Card 02: Tech Specs */}
          <div className="lg:mt-12 group relative rounded-[40px] border-4 border-orange-600 overflow-hidden shadow-2xl shadow-orange-600/20">
            <Image
              src="/tread.jpg"
              alt="Tread Tech"
              width={500}
              height={500}
              className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-125"
            />
            <div className="absolute top-6 right-6 bg-orange-600 text-white px-4 py-1 rounded-sm font-black italic text-[10px] uppercase tracking-widest shadow-xl">
              Tread Config: Ultra
            </div>
          </div>

          {/* Card 03: Live Analytics */}
          <div className="space-y-6 lg:pt-24">
            {[
              {
                icon: Activity,
                val: "75K+",
                label: "Happy Drivers",
                color: "from-blue-600 to-cyan-600",
              },
              {
                icon: Star,
                val: "4.9★",
                label: "Elite Rating",
                color: "from-orange-600 to-rose-600",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#111318] p-8 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-xl relative overflow-hidden group">
                <div
                  className={`absolute top-0 right-0 size-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-bl-full group-hover:scale-150 transition-transform duration-700`}
                />
                <div className="flex items-center gap-6">
                  <div
                    className={`size-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <p className="text-4xl font-black dark:text-white italic tracking-tighter leading-none">
                      {stat.val}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🚀 Feature Matrix: Pit Crew Wisdom */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
          {[
            {
              icon: BarChart3,
              title: "Combat Reviews",
              desc: "No marketing fluff. Just raw, unedited track-side feedback from real drivers.",
              tag: "Field Verified",
            },
            {
              icon: Target,
              title: "Precision Match",
              desc: "Chassis, weather, and driving intensity. We factor it all for a spot-on fit.",
              tag: "Zero Gap",
            },
            {
              icon: Calendar,
              title: "Cost Efficiency",
              desc: "Know your price per mile. Full transparency on longevity and spending.",
              tag: "Value Locked",
            },
            {
              icon: Clock,
              title: "Rapid Reserve",
              desc: "Book online, skip the pit wait. Your tires will be staged and ready.",
              tag: "Fast Lane",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group relative bg-gray-50 dark:bg-[#0f1115] p-8 rounded-[32px] border-2 border-transparent hover:border-orange-600 transition-all duration-500">
              <div className="size-12 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
                <feature.icon className="size-6 text-gray-600 dark:text-gray-400 group-hover:text-white" />
              </div>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-orange-600 mb-2 block italic">
                {feature.tag}
              </span>
              <h3 className="text-xl font-black dark:text-white uppercase italic tracking-tighter mb-4 leading-none">
                {feature.title}
              </h3>
              <p className="text-[11px] font-bold text-gray-500 uppercase leading-relaxed tracking-wider">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 🏎️ CTA: Start Your Mission */}
        <div className="text-center">
          <Link
            href="/tire"
            className="group relative inline-block">
            <div className="absolute inset-0 bg-orange-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <button className="relative bg-orange-600 text-white px-12 py-6 rounded-2xl font-black uppercase italic tracking-[0.2em] text-sm sm:text-lg flex items-center gap-4 group-hover:bg-rose-600 transition-all duration-500 shadow-2xl">
              Scan Perfect Match Now{" "}
              <ArrowRight
                size={24}
                className="group-hover:translate-x-2 transition-transform"
              />
            </button>
          </Link>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-60">
            {["Instant Recommendations", "No Sales Pressure", "2 Min Scan"].map(
              (point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2">
                  <ShieldCheck
                    size={14}
                    className="text-orange-600"
                  />
                  <span className="text-[9px] font-black uppercase italic tracking-widest dark:text-gray-400">
                    {point}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TreadWellSection;
