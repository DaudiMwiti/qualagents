
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { LucideChrome } from "lucide-react";

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup";
  redirectTo?: string;
  className?: string;
}

const GoogleSignInButton = ({
  mode = "signin",
  redirectTo = "/dashboard",
  className = "",
}: GoogleSignInButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${redirectTo}`,
        },
      });

      if (error) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Google sign in error:", error);
      toast({
        title: "Authentication failed",
        description: "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full relative ${className}`}
    >
      <LucideChrome className="mr-2 h-5 w-5" />
      {isLoading ? "Loading..." : mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
};

export default GoogleSignInButton;
