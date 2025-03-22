
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";
import GoogleSignInButton from "./GoogleSignInButton";
import { Separator } from "@/components/ui/separator";
import { UserCheck, User, Database, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PasswordResetForm from "./PasswordResetForm";
import { useIsMobile } from "@/hooks/use-mobile";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your sign up.",
        });
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast({
        title: "Sign up failed",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "There was a problem signing in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showResetForm) {
    return <PasswordResetForm onBackToLogin={() => setShowResetForm(false)} />;
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Database className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl">QualAgents</span>
        </div>
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>Sign in to your account or create a new one</CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="signin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="signin">
            <UserCheck className="mr-2 h-4 w-4" />
            Sign In
          </TabsTrigger>
          <TabsTrigger value="signup">
            <User className="mr-2 h-4 w-4" />
            Sign Up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <GoogleSignInButton mode="signin" />
              </div>
              
              <div className="relative flex items-center">
                <Separator className="flex-1" />
                <span className="mx-2 text-xs text-muted-foreground">or continue with email</span>
                <Separator className="flex-1" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md pl-3">
                  <User className="h-4 w-4 text-muted-foreground" />
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
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md pl-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="text-right">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowResetForm(true);
                    }}
                  >
                    Forgot password?
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <GoogleSignInButton mode="signup" />
              </div>
              
              <div className="relative flex items-center">
                <Separator className="flex-1" />
                <span className="mx-2 text-xs text-muted-foreground">or continue with email</span>
                <Separator className="flex-1" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md pl-3">
                  <User className="h-4 w-4 text-muted-foreground" />
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
              
              <div className="space-y-2">
                <div className="flex items-center border rounded-md pl-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-2">
                By signing up, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
