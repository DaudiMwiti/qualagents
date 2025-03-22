
import { useState, useEffect, createContext, useContext } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { toast } from "@/hooks/use-toast";

type Theme = "light" | "dark" | "system";

interface ThemePreference {
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  isLoading: boolean;
  toggleTheme: () => Promise<void>;
}

const ThemePreferenceContext = createContext<ThemePreference | undefined>(undefined);

export const ThemePreferenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    const fetchThemePreference = async () => {
      if (!user) {
        // If no user is logged in, try to get from localStorage
        const localTheme = localStorage.getItem("theme") as Theme;
        if (localTheme) {
          setThemeState(localTheme);
        }
        setIsLoading(false);
        return;
      }

      try {
        // Get theme preference from Supabase
        const { data, error } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data?.preferences?.theme) {
          setThemeState(data.preferences.theme);
        } else {
          // Default to system if not found
          setThemeState("system");
        }
      } catch (error) {
        console.error("Error fetching theme preference:", error);
        // Fallback to localStorage
        const localTheme = localStorage.getItem("theme") as Theme;
        if (localTheme) {
          setThemeState(localTheme);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemePreference();
  }, [user, supabase]);

  useEffect(() => {
    function updateTheme() {
      const root = document.documentElement;
      
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        
        root.classList.remove("light", "dark");
        root.classList.add(systemTheme);
      } else {
        root.classList.remove("light", "dark");
        root.classList.add(theme);
      }
    }

    updateTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateTheme();
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // If user is logged in, save to Supabase
    if (user) {
      try {
        const { data: profile, error: fetchError } = await supabase
          .from("profiles")
          .select("preferences")
          .eq("id", user.id)
          .single();
        
        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }
        
        const currentPreferences = profile?.preferences || {};
        const updatedPreferences = {
          ...currentPreferences,
          theme: newTheme
        };
        
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            preferences: updatedPreferences,
            updated_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
      } catch (error) {
        console.error("Error saving theme preference:", error);
        toast({
          title: "Error saving theme",
          description: "Your theme preference was set but couldn't be saved to your profile.",
          variant: "destructive"
        });
      }
    }
  };

  // Add a toggleTheme function to easily switch between light and dark
  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    await setTheme(newTheme);
    
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <ThemePreferenceContext.Provider value={{ theme, setTheme, isLoading, toggleTheme }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
};

export function useThemePreference() {
  const context = useContext(ThemePreferenceContext);
  if (context === undefined) {
    throw new Error("useThemePreference must be used within a ThemePreferenceProvider");
  }
  return context;
}
