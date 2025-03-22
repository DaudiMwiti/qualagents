
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";

type PasswordResetFormProps = {
  onBackToLogin: () => void;
};

const PasswordResetForm = ({ onBackToLogin }: PasswordResetFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const supabase = useSupabaseClient();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSubmitted(true);
        toast({
          title: "Password reset email sent",
          description: "Check your inbox for instructions to reset your password.",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "There was a problem sending the reset link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl flex items-center justify-center">
          <KeyRound className="h-6 w-6 mr-2 text-primary" />
          Reset Password
        </CardTitle>
        <CardDescription>
          {!isSubmitted ? 
            "Enter your email to receive password reset instructions" : 
            "Check your email for password reset instructions"}
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handlePasswordReset}>
        <CardContent className="space-y-4">
          {!isSubmitted ? (
            <div className="space-y-2">
              <div className="flex items-center border rounded-md pl-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 p-4 rounded-md text-sm text-center">
              We've sent a password reset link to <strong>{email}</strong>. The link will expire in 24 hours.
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {!isSubmitted ? (
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending link..." : "Send Reset Link"}
            </Button>
          ) : (
            <Button 
              type="button" 
              variant="secondary"
              className="w-full" 
              onClick={() => setIsSubmitted(false)}
            >
              Try another email
            </Button>
          )}
          
          <Button 
            type="button" 
            variant="ghost" 
            className="mt-2 flex items-center" 
            onClick={onBackToLogin}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PasswordResetForm;
