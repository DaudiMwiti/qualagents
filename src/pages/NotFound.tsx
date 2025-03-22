
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageTransition from "@/components/shared/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("NotFound page rendering for path:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold mb-6">404</h1>
          <h2 className="text-2xl font-medium mb-4">Page not found</h2>
          <p className="text-muted-foreground mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="rounded-full px-8">
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
