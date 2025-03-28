
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ThemePreferenceProvider } from './hooks/use-theme-preference';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ProjectView from "./pages/ProjectView";
import ProjectInsights from "./pages/ProjectInsights";
import Settings from "./pages/Settings";
import AgentSettings from "./pages/AgentSettings";
import NotFound from "./pages/NotFound";
import DataUpload from "./pages/DataUpload";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import AnalysisResults from "./pages/AnalysisResults";

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Initialize the Supabase client with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a supabase client only if credentials are available
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
  } else {
    console.warn("Supabase credentials not found. Authentication features will be limited.");
    // Create a mock client for development/preview
    supabase = {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null })
      }
    };
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Fallback to a mock client
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signOut: async () => ({ error: null })
    }
  };
}

const App = () => {
  console.log("App component rendering"); // Debug log
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemePreferenceProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/project/:id" element={<ProjectView />} />
                <Route path="/project/:projectId/results/:batchId" element={<AnalysisResults />} />
                <Route path="/project-insights/:id" element={<ProjectInsights />} />
                <Route path="/data-upload/:projectId?" element={<DataUpload />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/agent-settings" element={<AgentSettings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </ThemePreferenceProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

export default App;
