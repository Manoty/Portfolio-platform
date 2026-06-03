import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Download, ArrowRight, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { resumeService } from "@/services/resume.service";
import { useSettingsStore } from "@/store/settings.store";

const NAV_LINKS = [
  { href: "/#about",       label: "About" },
  { href: "/projects",     label: "Projects" },
  { href: "/blog",         label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/#contact",     label: "Contact" },
];



export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler(); // run once on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href;
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
        scrolled
          // Scrolled — white frosted glass
          ? "bg-white/96 backdrop-blur-md shadow-sm shadow-gray-200/80 border-b border-gray-200/60"
          // Initial — dark glass panel — ALWAYS VISIBLE
          : "bg-gray-900/80 backdrop-blur-md border-b border-white/8"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:scale-110 group-hover:shadow-blue-500/50 transition-all duration-200">
              <Code2 size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={cn(
                "font-black text-sm tracking-tight transition-colors duration-300",
                scrolled ? "text-gray-900" : "text-white"
              )}>
                {settings.full_name}
              </span>
              <span className={cn(
                "text-[10px] font-semibold tracking-widest uppercase transition-colors duration-300",
                scrolled ? "text-blue-600" : "text-blue-400"
              )}>
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive(link.href)
                    ? scrolled
                      ? "text-blue-600 bg-blue-50"
                      : "text-white bg-white/15"
                    : scrolled
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2.5">
            <a href={resumeService.downloadUrl()} download>
              <button className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95",
                scrolled
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  : "border border-white/20 text-gray-200 hover:bg-white/10 hover:border-white/30"
              )}>
                <Download size={13} /> Resume
              </button>
            </a>
            <a href="/#contact">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/25 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]">
                Hire Me <ArrowRight size={13} />
              </button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
            className={cn(
              "md:hidden p-2 rounded-lg transition-all duration-200",
              scrolled
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-200 hover:bg-white/10"
            )}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "rounded-2xl mx-1 mb-3 overflow-hidden border",
            scrolled
              ? "bg-white border-gray-200 shadow-lg"
              : "bg-gray-900/98 border-white/10 shadow-2xl"
          )}>
            <div className="p-3 space-y-0.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200",
                    isActive(link.href)
                      ? "text-blue-600 bg-blue-50"
                      : scrolled
                      ? "text-gray-700 hover:bg-gray-50"
                      : "text-gray-300 hover:bg-white/8 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className={cn(
              "flex gap-2 px-4 py-3 border-t",
              scrolled ? "border-gray-100" : "border-white/8"
            )}>
              <a href={resumeService.downloadUrl()} download className="flex-1">
                <button className={cn(
                  "w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all",
                  scrolled
                    ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "border-white/20 text-gray-300 hover:bg-white/8"
                )}>
                  <Download size={13} /> Resume
                </button>
              </a>
              <a href="/#contact" className="flex-1">
                <button className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-bold">
                  Hire Me <ArrowRight size={13} />
                </button>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}