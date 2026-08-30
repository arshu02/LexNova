import Link from 'next/link';
import { Scale, Twitter, Linkedin, Github, Mail } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'AI Case Intake', href: '/dashboard/chat' },
    { label: 'Matter Workspace', href: '/dashboard/matters' },
    { label: 'Document Studio', href: '/dashboard/documents' },
    { label: 'Find an Advocate', href: '/advocates' },
    { label: 'Consultation Booking', href: '/dashboard/bookings' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Platform: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Bar Council Verification', href: '/how-it-works' },
    { label: 'Limitation Engine', href: '/how-it-works' },
    { label: 'Precedent Database', href: '/how-it-works' },
    { label: 'Security & Encryption', href: '/how-it-works' },
    { label: 'API Docs', href: '/how-it-works' },
  ],
  Company: [
    { label: 'About LexNova', href: '/' },
    { label: 'Careers', href: '/' },
    { label: 'Press Kit', href: '/' },
    { label: 'Blog', href: '/' },
    { label: 'Contact Us', href: '/' },
    { label: 'Partner Programme', href: '/' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/' },
    { label: 'Terms of Service', href: '/' },
    { label: 'Cookie Policy', href: '/' },
    { label: 'Disclaimer', href: '/' },
    { label: 'Refund Policy', href: '/' },
    { label: 'BCI Compliance', href: '/' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#050508] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Main footer grid */}
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <Scale size={17} />
              </div>
              <span className="text-[18px] font-bold tracking-tight text-white">LexNova</span>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md tracking-wider">OS</span>
            </Link>
            <p className="text-[14px] text-[#5B6B7C] leading-relaxed max-w-[260px]">
              India&apos;s AI-powered legal operating system. Making justice accessible, affordable, and intelligent.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '/', label: 'Twitter' },
                { icon: Linkedin, href: '/', label: 'LinkedIn' },
                { icon: Github, href: '/', label: 'GitHub' },
                { icon: Mail, href: '/', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-[#5B6B7C] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all"
                >
                  <Icon size={14} />
                </Link>
              ))}
            </div>

            {/* Newsletter */}
            <div className="pt-1">
              <p className="text-[12.5px] font-semibold text-[#7A8899] uppercase tracking-wider mb-2.5">Legal Insights Newsletter</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-[#0A0C10] border border-white/[0.08] rounded-lg px-3 py-2 text-[13.5px] text-white placeholder-[#3D4E5E] focus:border-blue-500/50 focus:outline-none transition-colors min-w-0"
                />
                <button
                  type="submit"
                  className="bg-white text-black text-[13px] font-semibold px-3.5 py-2 rounded-lg hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section} className="space-y-4">
              <h4 className="text-[12.5px] font-bold text-[#C8D0DC] uppercase tracking-[0.08em]">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13.5px] text-[#5B6B7C] hover:text-[#C8D0DC] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12.5px] text-[#3D4E5E]">
          <p>© 2026 LexNova Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Not a law firm · For informational purposes only</span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
