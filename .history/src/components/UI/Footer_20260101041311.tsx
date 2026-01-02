import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block transform hover:scale-105 transition-all">
              <Image
                src="/logo.png"
                alt="Tires Dash"
                width={120}
                height={50}
                className="object-contain brightness-110"
              />
            </Link>
            <p className="text-[11px] leading-relaxed font-bold italic tracking-wide uppercase">
              DRIVING FINANCIAL EASE. <br />
              <span className="text-orange-500 font-black tracking-tighter">Your Journey Starts Here.</span>
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a key={idx} href="#" className="p-2 bg-white/5 rounded-lg hover:bg-orange-600 hover:text-white transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Customer Care Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-2">
              <div className="h-[2px] w-3 bg-orange-600" /> Support Hub
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {['Terms', 'Privacy', 'Refund', 'FAQs'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-tighter hover:text-orange-500 transition-colors">
                    {item} & Conditions
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-2">
              <div className="h-[2px] w-3 bg-orange-600" /> Navigation
            </h4>
            <ul className="grid grid-cols-1 gap-2">
              {['Deals', 'Blog', 'Appointments', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase()}`} className="text-[11px] font-bold uppercase tracking-tighter hover:text-orange-500 flex items-center gap-2 group transition-all">
                    <ChevronRight size={10} className="text-orange-600 opacity-0 group-hover:opacity-100 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-white uppercase italic tracking-[0.2em] flex items-center gap-2">
              <div className="h-[2px] w-3 bg-orange-600" /> Fast Contact
            </h4>
            <div className="space-y-3">
              <a href="mailto:info@tiresdash.com" className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-600 transition-all">
                  <Mail size={14} className="text-orange-500 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-bold text-gray-300">info@tiresdash.com</span>
              </a>
              <a href="tel:+15612323230" className="flex items-center gap-3 group">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-orange-600 transition-all">
                  <Phone size={14} className="text-orange-500 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-bold text-gray-300">561-232-3230</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] italic text-gray-600">
            © 2026 <span className="text-orange-600">Tires Dash</span>. Pure Performance.
          </p>
          <div className="flex items-center gap-4 group">
            <Zap size={12} className="text-orange-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest italic text-gray-500">Built for Speed</span>
          </div>
        </div>
        
    </footer>
  );
};

export default Footer;
