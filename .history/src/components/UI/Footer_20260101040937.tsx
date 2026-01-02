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
    <footer className="relative bg-[#050608] text-gray-400 pt-16 pb-8 overflow-hidden">
      {/* Background Racing Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-600 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-6">
            <Link
              href="/"
              className="inline-block transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.png"
                alt="Tires Dash"
                width={140}
                height={60}
                className="object-contain brightness-110"
              />
            </Link>
            <p className="text-sm leading-relaxed font-medium italic tracking-wide">
              DRIVING FINANCIAL EASE AND FLEXIBILITY. <br />
              <span className="text-orange-500 font-black uppercase tracking-tighter">
                Your Journey Starts Here.
              </span>
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 bg-white/5 rounded-lg hover:bg-orange-600 hover:text-white transition-all group">
                  <Icon
                    size={18}
                    className="group-hover:rotate-12 transition-transform"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* About Section - Glass Card Style */}
          <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-sm">
            <h4 className="text-sm font-black text-white uppercase italic tracking-[0.2em] mb-4 flex items-center gap-2">
              <div className="h-1 w-4 bg-orange-600 rounded-full" />
              About Us
            </h4>
            <p className="text-xs leading-loose font-medium text-gray-500">
              At <span className="text-gray-300">Tires Dash</span>, we
              specialize in providing flexible financing solutions for all your
              tire needs. Whether new performance sets or standard replacements,
              we ensure easy and affordable paths to the road.
            </p>
          </div>

          {/* Links Section - Two Columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase italic tracking-widest">
                Explore
              </h4>
              <ul className="space-y-3">
                {["Home", "Deals", "Blog", "Appointments"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-xs font-bold uppercase tracking-tighter hover:text-orange-500 flex items-center gap-1 group transition-colors">
                      <ChevronRight
                        size={12}
                        className="text-orange-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                      />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-black text-white uppercase italic tracking-widest">
                Support
              </h4>
              <ul className="space-y-3">
                {["Terms", "Privacy", "Refund", "FAQs"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="text-xs font-bold uppercase tracking-tighter hover:text-orange-500 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Section - Dynamic Sporty Look */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase italic tracking-widest">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:info@tiresdash.com"
                className="flex items-center gap-4 group">
                <div className="p-3 bg-orange-600/10 rounded-xl group-hover:bg-orange-600 transition-all">
                  <Mail
                    size={18}
                    className="text-orange-500 group-hover:text-white"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 italic">
                    Email Us
                  </p>
                  <p className="text-xs font-bold text-gray-300 uppercase">
                    info@tiresdash.com
                  </p>
                </div>
              </a>
              <a
                href="tel:+15612323230"
                className="flex items-center gap-4 group">
                <div className="p-3 bg-orange-600/10 rounded-xl group-hover:bg-orange-600 transition-all">
                  <Phone
                    size={18}
                    className="text-orange-500 group-hover:text-white"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 italic">
                    Call Center
                  </p>
                  <p className="text-xs font-bold text-gray-300 uppercase">
                    561-232-3230
                  </p>
                </div>
              </a>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  <MapPin
                    size={18}
                    className="text-orange-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 italic">
                    Location
                  </p>
                  <p className="text-xs font-bold text-gray-300 uppercase italic">
                    Boynton Beach, FL, USA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-600">
            © 2026 <span className="text-orange-600">Tires Dash</span>. Pure
            Performance. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
              Privacy
            </Link>
            <div className="h-1 w-1 bg-gray-700 rounded-full" />
            <Link
              href="/terms"
              className="text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
              Terms
            </Link>
          </div>
          <div className="flex items-center gap-2 group cursor-crosshair">
            <Zap
              size={14}
              className="text-orange-500 group-hover:animate-bounce"
            />
            <span className="text-[10px] font-black uppercase tracking-widest italic text-gray-400">
              Built for Speed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
