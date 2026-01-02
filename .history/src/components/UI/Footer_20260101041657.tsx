import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Zap,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-10">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-80" />

      {/* Background Subtle Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* 1. BRAND IDENTITY */}
          <div className="flex flex-col space-y-6 items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="inline-block group">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Tires Dash"
                  width={140}
                  height={60}
                  className="object-contain brightness-110 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-orange-600 group-hover:w-full transition-all duration-500" />
              </div>
            </Link>
            <p className="text-[10px] leading-relaxed font-black italic tracking-[0.2em] uppercase text-gray-500">
              Pushing the boundaries of <br />
              <span className="text-orange-600">Financial Performance.</span>
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 group">
                  <Icon
                    size={18}
                    className="group-hover:rotate-12"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* 2. NAVIGATION - SPORTY STYLE */}
          <div className="flex flex-col space-y-6 bg-white/[0.02] md:bg-transparent p-6 md:p-0 rounded-[2rem] border border-white/5 md:border-none">
            <h4 className="text-[11px] font-black text-white uppercase italic tracking-[0.3em] flex items-center gap-3">
              <Target
                size={14}
                className="text-orange-600"
              />
              The Circuit
            </h4>
            <ul className="space-y-4">
              {["Deals", "Blog", "Appointments", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-3 group transition-all">
                    <div className="h-[1px] w-0 bg-orange-600 group-hover:w-4 transition-all duration-300" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SUPPORT CENTER */}
          <div className="flex flex-col space-y-6 bg-white/[0.02] md:bg-transparent p-6 md:p-0 rounded-[2rem] border border-white/5 md:border-none">
            <h4 className="text-[11px] font-black text-white uppercase italic tracking-[0.3em] flex items-center gap-3">
              <ShieldCheck
                size={14}
                className="text-orange-600"
              />
              Pit Stop
            </h4>
            <ul className="space-y-4">
              {["Terms", "Privacy", "Refund", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white flex items-center gap-3 group transition-all">
                    <ChevronRight
                      size={10}
                      className="text-orange-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                    />
                    {item} & Policies
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. HIGH-SPEED CONTACT */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-[11px] font-black text-white uppercase italic tracking-[0.3em] flex items-center gap-3">
              <Headphones
                size={14}
                className="text-orange-600"
              />
              Direct Line
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:info@tiresdash.com"
                className="group flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-orange-600/30 transition-all">
                <div className="p-2 bg-orange-600 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <Mail
                    size={16}
                    className="text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-600 uppercase italic">
                    Send Intel
                  </span>
                  <span className="text-[11px] font-bold text-gray-300">
                    info@tiresdash.com
                  </span>
                </div>
              </a>
              <a
                href="tel:+15612323230"
                className="group flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-transparent hover:border-orange-600/30 transition-all">
                <div className="p-2 bg-white/10 rounded-lg group-hover:bg-orange-600 transition-all">
                  <Phone
                    size={16}
                    className="text-gray-300 group-hover:text-white"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-600 uppercase italic">
                    Call HQ
                  </span>
                  <span className="text-[11px] font-bold text-gray-300 italic tracking-tighter">
                    561-232-3230
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* 🏁 FOOTER BOTTOM - THE FINISH LINE */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] italic text-gray-700">
              © 2026 <span className="text-orange-600">Tires Dash</span>. Track
              Tested. User Approved.
            </p>
          </div>

          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-full border border-white/5 group hover:border-orange-600/50 transition-all cursor-help">
            <Zap
              size={14}
              className="text-orange-500 animate-pulse group-hover:scale-125 transition-transform"
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] italic text-gray-500">
              Built for Absolute Speed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
