import { Link } from "react-router-dom";

const SOCIAL_LINKS = [
  { href: "https://github.com/Manoty", label: "GitHub" },
  { href: "https://www.linkedin.com/in/kevin-manoti-394933233/", label: "LinkedIn" },
  { href: "https://twitter.com/yourhandle", label: "Twitter" },
  { href: "mailto:kevinnoty21@gmail.com", label: "Email" },
];

const FOOTER_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/testimonials", label: "Testimonials" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-white">
              {"<YourName />"}
            </Link>
            <p className="text-sm mt-1">Building things for the web.</p>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg hover:text-white hover:bg-gray-800 transition-colors"
              >
                <span className="sr-only">{label}</span>
                <span aria-hidden>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {year} YourName. Built with React + Django.
        </div>
      </div>
    </footer>
  );
}