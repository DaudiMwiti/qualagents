
import AuthForm from "@/components/auth/AuthForm";
import PageTransition from "@/components/shared/PageTransition";
import { useUser } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
    </PageTransition>
  );
};

export default Auth;
