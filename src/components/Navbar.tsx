import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, Menu, X, BarChart3, Map, FileText, Users, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/projects", label: "Projects", icon: BarChart3 },
  { path: "/map", label: "Map View", icon: Map },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/admin", label: "Admin", icon: Users },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            CivicLens <span className="text-sky">AI</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={active ? "default" : "ghost"}
                  size="sm"
                  className="gap-1.5 text-sm"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-1.5">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-card md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="mt-2 w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
