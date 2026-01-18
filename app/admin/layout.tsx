"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, Settings, Folder, Wrench, Briefcase, Mail, ListChecks, Star } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/projects", icon: Folder, label: "Projects" },
  { href: "/admin/skills", icon: Wrench, label: "Skills" },
  { href: "/admin/competencies", icon: ListChecks, label: "Competencies" },
  { href: "/admin/experience", icon: Briefcase, label: "Experience" },
  { href: "/admin/messages", icon: Mail, label: "Messages" },
  { href: "/admin/featured-blogs", icon: Star, label: "Featured Blogs" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

// Auth pages that should not show sidebar
const AUTH_PATHS = ["/admin/login", "/admin/signup"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if current page is an auth page (login/signup)
  const isAuthPage = AUTH_PATHS.some(path => pathname.startsWith(path));

  // Auth pages - render without sidebar
  if (isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/5">
        {children}
      </div>
    );
  }

  // Dashboard pages - render with sidebar
  return (
    <div className="min-h-screen flex bg-background text-foreground">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 flex flex-col border-r border-border/50 bg-card/95 backdrop-blur-xl
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Admin</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 hover:bg-muted rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border/50">
          <Link
            href="/admin/logout"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen w-full md:w-auto">

        {/* Header */}
        <header className="sticky top-0 z-30 h-16 border-b border-border/50 bg-card/80 backdrop-blur-xl flex items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold truncate">
              {NAV_ITEMS.find(item => pathname.startsWith(item.href))?.label || 'Admin'}
            </h1>
          </div>

          <div className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">Logged in as </span>
            <span className="font-medium text-foreground">Admin</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-10 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
