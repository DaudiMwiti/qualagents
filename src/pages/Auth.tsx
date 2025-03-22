
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import PageTransition from "@/components/shared/PageTransition";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Auth = () => {
  const user = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { isLoading: isSessionLoading, error } = useSessionContext();
  
  // Determine if we're on the signup page
  const isSignUp = location.pathname === "/signup";

  useEffect(() => {
    console.log("Auth page - User state:", user ? "Logged in" : "Not logged in");
    console.log("Auth page - Session loading:", isSessionLoading);
    
    // Only redirect if session is loaded and we have a user
    if (!isSessionLoading) {
      if (user) {
        console.log("User is logged in, redirecting to dashboard");
        // User is logged in, redirect to dashboard
        navigate("/dashboard");
      }
      setIsLoading(false);
    }
  }, [user, navigate, isSessionLoading]);

  useEffect(() => {
    // Check for authentication information in the URL (for OAuth callbacks)
    if (window.location.hash && window.location.hash.includes("access_token")) {
      console.log("OAuth callback detected");
      setIsLoading(true);
    }
    
    // Check for error in URL params (such as from email confirmation)
    const params = new URLSearchParams(window.location.search);
    const errorDescription = params.get("error_description");
    if (errorDescription) {
      console.error("URL error detected:", errorDescription);
      setAuthError(errorDescription);
      toast({
        title: "Authentication error",
        description: errorDescription,
        variant: "destructive",
      });
    }
  }, []);

  useEffect(() => {
    // Show error if there was a problem with the session
    if (error) {
      console.error("Session error:", error);
      setAuthError(error.message);
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
          {authError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <AuthForm defaultTab={isSignUp ? "signup" : "signin"} />
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
