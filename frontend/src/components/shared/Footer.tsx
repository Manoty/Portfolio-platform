import { Link } from "react-router-dom";
import { Mail, ArrowUpRight, ExternalLink } from "lucide-react";
import { useSettingsStore } from "@/store/settings.store";

const SOCIAL_LINKS = [
  { icon: ExternalLink, href: "https://github.com/kevinmanoti", label: "GitHub" },
  { icon: ExternalLink, href: "https://linkedin.com/in/kevinmanoti", label: "LinkedIn" },
  { icon: ExternalLink, href: "https://twitter.com/kevinmanoti", label: "Twitter" },
  { icon: Mail, href: "mailto:kevin@kevinmanoti.dev", label: "Email" },
];

const FOOTER_SECTIONS = [
  {
    title: "Navigation",
    links: [
      { href: "/", label: "Home" },
      { href: "/projects", label: "Projects" },
      { href: "/blog", label: "Blog" },
      { href: "/testimonials", label: "Testimonials" },
    ],
  },
  {
    title: "Work",
    links: [
      { href: "/#about", label: "About Me" },
      { href: "/#skills", label: "Skills" },
      { href: "/#experience", label: "Experience" },
      { href: "/#contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  const { settings } = useSettingsStore();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 relative overflow-hidden">
      {/* Subtle top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                K
              </div>
              <span className="text-white font-bold text-lg">{settings.full_name}</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs text-gray-500">
              {settings.tagline} specializing in Django, React, and PostgreSQL.
              Building production-grade applications with clean architecture and great UX.
            </p>
            <div className="flex items-center gap-2 mt-6">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-500 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {year} Kevin Manoti. Built with React + Django. Deployed on a single VPS.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            <span className="text-xs text-gray-600">Available for opportunities</span>
          </div>
        </div>
      </div>
    </footer>
  );
}