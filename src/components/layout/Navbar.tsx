
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Database, Settings, LucideBot } from "lucide-react";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from "@/components/ui/use-toast";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const supabase = useSupabaseClient();
  const user = useUser();
  
  const isHome = location.pathname === "/";
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Don't show navbar on auth pages
  if (isAuthPage) return null;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ${
        scrolled || !isHome 
          ? "py-3 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 font-semibold text-xl"
        >
          <Database className="h-6 w-6 text-primary" />
          <span>QualAgents</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/" active={location.pathname === "/"}>
            Home
          </NavLink>
          <NavLink to="/dashboard" active={location.pathname === "/dashboard"}>
            Dashboard
          </NavLink>
          <NavLink to="/agent-settings" active={location.pathname === "/agent-settings"}>
            AI Agents
          </NavLink>
          <NavLink to="/settings" active={location.pathname === "/settings"}>
            Settings
          </NavLink>
        </nav>
        
        <div className="flex items-center space-x-3">
          {!isHome && user && (
            <>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link to="/agent-settings">
                  <LucideBot className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
          
          {user ? (
            <Button 
              variant="outline" 
              className="rounded-full transition-all duration-300"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild variant="outline" className="rounded-full transition-all duration-300">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full transition-all duration-300">
                <Link to="/signup">
                  {isHome ? "Get Started" : "Sign Up"}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

type NavLinkProps = {
  to: string;
  active: boolean;
  children: React.ReactNode;
};

const NavLink = ({ to, active, children }: NavLinkProps) => {
  return (
    <Link
      to={to}
      className={`relative px-3 py-2 rounded-md font-medium text-sm transition-colors ${
        active 
          ? "text-primary" 
          : "text-foreground/70 hover:text-foreground"
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary mx-3"
        />
      )}
    </Link>
  );
};

export default Navbar;
