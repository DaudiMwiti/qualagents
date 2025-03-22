
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import PageTransition from "@/components/shared/PageTransition";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: isSessionLoading, error } = useSessionContext();
  
  // Determine if we're on the signup page
  const isSignUp = location.pathname === "/signup";

  useEffect(() => {
    // Only redirect if session is loaded and we have a user
    if (!isSessionLoading) {
      if (user) {
        // User is logged in, redirect to dashboard
        navigate("/dashboard");
      }
      setIsLoading(false);
    }
  }, [user, navigate, isSessionLoading]);

  useEffect(() => {
    // Show error if there was a problem with the session
    if (error) {
      console.error("Session error:", error);
      toast({
        title: "Authentication error",
        description: "There was a problem with your session. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  if (isLoading || isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <AuthForm defaultTab={isSignUp ? "signup" : "signin"} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
