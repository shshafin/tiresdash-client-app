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
    <footer className="relative bg-[#050608] text-gray-400 mt-auto border-t border-white/5 overflow-hidden">
      {/* Top Racing Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* 1. Brand Section */}
          <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
            <Link
              href="/"
              className="inline-block transform hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="Tires Dash"
                width={120}
                height={50}
                className="object-contain brightness-110"
              />
            </Link>
            <p className="text-[11px] leading-relaxed font-bold italic tracking-wider uppercase max-w-[250px]">
              DRIVING FINANCIAL EASE. <br />
              <span className="text-orange-500 font-black tracking-tighter">
                Your Journey Starts Here.
              </span>
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2.5 bg-white/5 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Support Hub */}
          <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.25em] flex items-center gap-2">
              <div className="h-[2px] w-4 bg-orange-600 rounded-full" />
              Support Hub
            </h4>
            <ul className="space-y-3">
              {["Terms", "Privacy", "Refund", "FAQs"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-[11px] font-bold uppercase tracking-widest hover:text-orange-500 transition-colors">
                    {item} & Conditions
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Quick Navigation */}
          <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.25em] flex items-center gap-2">
              <div className="h-[2px] w-4 bg-orange-600 rounded-full" />
              Navigation
            </h4>
            <ul className="space-y-3">
              {["Deals", "Blog", "Appointments", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-[11px] font-bold uppercase tracking-widest hover:text-orange-500 flex items-center gap-2 group transition-all">
                    <ChevronRight
                      size={10}
                      className="text-orange-600 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                    />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Fast Contact */}
          <div className="flex flex-col space-y-5 items-center md:items-start text-center md:text-left">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.25em] flex items-center gap-2">
              <div className="h-[2px] w-4 bg-orange-600 rounded-full" />
              Fast Contact
            </h4>
            <div className="space-y-4 w-full">
              <a
                href="mailto:info@tiresdash.com"
                className="flex items-center justify-center md:justify-start gap-3 group">
                <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-orange-600 transition-all shadow-md">
                  <Mail
                    size={14}
                    className="text-orange-500 group-hover:text-white"
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-300 tracking-tight">
                  info@tiresdash.com
                </span>
              </a>
              <a
                href="tel:+15612323230"
                className="flex items-center justify-center md:justify-start gap-3 group">
                <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-orange-600 transition-all shadow-md">
                  <Phone
                    size={14}
                    className="text-orange-500 group-hover:text-white"
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-300 tracking-tight">
                  561-232-3230
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] italic text-gray-600">
            © 2026{" "}
            <span className="text-orange-600 underline underline-offset-4 decoration-2">
              Tires Dash
            </span>
            . Pure Performance.
          </p>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5 group hover:border-orange-500/30 transition-all">
            <Zap
              size={12}
              className="text-orange-500 animate-pulse group-hover:scale-125 transition-transform"
            />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-gray-500">
              Built for Speed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
