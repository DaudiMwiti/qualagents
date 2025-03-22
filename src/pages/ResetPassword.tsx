
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Database, KeyRound, Lock } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the hash fragment that Supabase requires for reset
    const hashFragment = window.location.hash;
    if (!hashFragment || !hashFragment.includes("access_token")) {
      setIsValid(false);
      toast({
        title: "Invalid or expired link",
        description: "This password reset link is invalid or has expired.",
        variant: "destructive",
      });
    }
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "The password and confirmation don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Your password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast({
          title: "Password update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated.",
        });
        
        // Navigate to login page after successful reset
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Password update failed",
        description: "There was a problem updating your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Database className="h-6 w-6 text-primary" />
                <span className="font-semibold text-xl">QualAgents</span>
              </div>
              <CardTitle className="text-2xl flex items-center justify-center">
                <KeyRound className="h-6 w-6 mr-2 text-primary" />
                Set New Password
              </CardTitle>
              <CardDescription>
                Create a new password for your account
              </CardDescription>
            </CardHeader>
            
            {!isValid ? (
              <CardContent className="space-y-4">
                <div className="bg-destructive/10 p-4 rounded-md text-center">
                  <p className="text-destructive font-medium">Invalid or expired link</p>
                  <p className="text-sm mt-2">This password reset link is invalid or has expired.</p>
                </div>
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate("/login")}
                >
                  Return to Login
                </Button>
              </CardContent>
            ) : (
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center border rounded-md pl-3">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center border rounded-md pl-3">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Updating password..." : "Set New Password"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default ResetPassword;
