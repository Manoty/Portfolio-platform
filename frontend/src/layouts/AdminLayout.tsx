import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FolderKanban, FileText, MessageSquare,
  FileUp, Star, BarChart2, User, LogOut, Menu, X, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Code2, Briefcase, Cpu } from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin",            icon: LayoutDashboard, label: "Dashboard",    exact: true },
  { to: "/admin/projects",   icon: FolderKanban,    label: "Projects" },
  { to: "/admin/blog",       icon: FileText,         label: "Blog" },
  { to: "/admin/messages",   icon: MessageSquare,    label: "Messages" },
  { to: "/admin/resume",     icon: FileUp,           label: "Resume" },
  { to: "/admin/testimonials", icon: Star,           label: "Testimonials" },
  { to: "/admin/analytics",  icon: BarChart2,        label: "Analytics" },
  { to: "/admin/profile",    icon: User,             label: "Profile" },
  { to: "/admin/technologies", icon: Code2,      label: "Technologies" },
  { to: "/admin/experience",   icon: Briefcase,  label: "Experience"   },
  { to: "/admin/skills",       icon: Cpu,        label: "Skills"       },
  { to: "/admin/settings",     icon: Settings,   label: "Site Settings" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ------------------------------------------------------------------ */}
      {/* SIDEBAR                                                             */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-gray-950 text-gray-300 flex flex-col z-30",
          "transition-all duration-300",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        {/* Logo + toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          {sidebarOpen && (
            <span className="text-white font-bold text-lg truncate">KM · Portfolio CMS</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white ml-auto"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg text-sm font-medium",
                  "transition-colors group",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )
              }
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{label}</span>}
              {sidebarOpen && (
                <ChevronRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity"
                />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-gray-800 p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm",
              "text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
            )}
          >
            <LogOut size={18} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* MAIN CONTENT                                                        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen transition-all duration-300",
          sidebarOpen ? "ml-60" : "ml-16"
        )}
      >
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-20">
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Signed in as{" "}
              <span className="font-medium text-gray-900">{user?.email}</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 capitalize">
              {user?.role}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}