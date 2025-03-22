import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, User, Mail, LogIn, Save, Trash, Moon, Sun, Monitor } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import { getGravatarUrl } from "@/utils/profileUtils";
import { useThemePreference } from "@/hooks/use-theme-preference";
import { useIsMobile } from "@/hooks/use-mobile";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  defaultExportFormat: z.enum(["pdf", "csv", "markdown", "json"]),
  preferredMethodologies: z.array(z.string()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loginProvider, setLoginProvider] = useState<string>("email");
  const { theme, setTheme } = useThemePreference();
  const isMobile = useIsMobile();
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      defaultExportFormat: "pdf",
      preferredMethodologies: [],
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        const email = user.email || "";
        
        const googleAvatarUrl = user?.user_metadata?.avatar_url;
        
        if (googleAvatarUrl) {
          setAvatarUrl(googleAvatarUrl);
          setLoginProvider("google");
        } else {
          setAvatarUrl(getGravatarUrl(email));
          setLoginProvider("email");
        }
        
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Could not load your profile. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        if (profile) {
          const preferences = profile.preferences || {};
          
          form.reset({
            name: profile.name || user.user_metadata?.full_name || "",
            defaultExportFormat: preferences.defaultExportFormat || "pdf",
            preferredMethodologies: preferences.preferredMethodologies || [],
          });
        }
      } catch (error) {
        console.error("Error in profile setup:", error);
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate, supabase, form]);
  
  const handleSaveProfile = async (values: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();
        
      const existingPreferences = existingProfile?.preferences || {};
      
      const preferences = {
        ...existingPreferences,
        defaultExportFormat: values.defaultExportFormat,
        preferredMethodologies: values.preferredMethodologies,
      };
      
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          name: values.name,
          preferences: preferences,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        console.error("Error saving profile:", error);
        toast({
          title: "Error",
          description: "Failed to save your profile. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been updated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) return null;
  
  return (
    <PageTransition>
      <div className="container max-w-5xl py-6 md:py-10 px-4 md:px-8">
        <div className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">User Profile</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-4">
            <CardHeader className={isMobile ? "px-4 py-4" : ""}>
              <CardTitle className={isMobile ? "text-lg" : ""}>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            
            <CardContent className={`flex flex-col items-center space-y-4 ${isMobile ? "px-4 py-2" : ""}`}>
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-2 border-primary/10">
                <AvatarImage src={avatarUrl || ""} alt={user.email || "User"} />
                <AvatarFallback className="text-xl md:text-2xl">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold">
                  {user.user_metadata?.full_name || form.getValues().name || "User"}
                </h3>
                <div className="flex items-center justify-center text-muted-foreground gap-1 mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-xs md:text-sm">{user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <LogIn className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs md:text-sm text-muted-foreground">Signed in with:</span>
                <Badge variant="outline" className="capitalize text-xs">
                  {loginProvider}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className={`flex flex-col space-y-3 ${isMobile ? "px-4 py-4" : ""}`}>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ToggleGroup type="single" variant="outline" value={theme} onValueChange={(value: any) => value && setTheme(value)}>
                    <ToggleGroupItem value="light" size="sm" className="w-9 h-9">
                      <Sun className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="dark" size="sm" className="w-9 h-9">
                      <Moon className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="system" size="sm" className="w-9 h-9">
                      <Monitor className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-2" 
                onClick={() => navigate("/settings")}
                size={isMobile ? "sm" : "default"}
              >
                Manage Account
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="md:col-span-8">
            <CardHeader className={isMobile ? "px-4 py-4" : ""}>
              <CardTitle className={isMobile ? "text-lg" : ""}>Preferences</CardTitle>
              <CardDescription>Customize your QualAgents experience</CardDescription>
            </CardHeader>
            
            <CardContent className={isMobile ? "px-4 py-2" : ""}>
              {isLoading ? (
                <div className="flex items-center justify-center h-40 md:h-48">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4 md:space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-muted-foreground" />
                              <Input placeholder="Your name" {...field} />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs">
                            This is how you'll appear in the application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator className="my-4" />
                    
                    <FormField
                      control={form.control}
                      name="defaultExportFormat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Export Format</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pdf">PDF Document</SelectItem>
                              <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                              <SelectItem value="markdown">Markdown Text</SelectItem>
                              <SelectItem value="json">JSON Data</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-xs">
                            This format will be used when exporting insights
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="preferredMethodologies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Research Methodologies</FormLabel>
                          <FormControl>
                            <ToggleGroup
                              type="multiple"
                              variant="outline"
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex flex-wrap gap-2"
                            >
                              <ToggleGroupItem value="grounded_theory" className="px-3 py-1 text-xs">
                                Grounded Theory
                              </ToggleGroupItem>
                              <ToggleGroupItem value="thematic_analysis" className="px-3 py-1 text-xs">
                                Thematic Analysis
                              </ToggleGroupItem>
                              <ToggleGroupItem value="phenomenology" className="px-3 py-1 text-xs">
                                Phenomenology
                              </ToggleGroupItem>
                              <ToggleGroupItem value="discourse_analysis" className="px-3 py-1 text-xs">
                                Discourse Analysis
                              </ToggleGroupItem>
                              <ToggleGroupItem value="narrative_inquiry" className="px-3 py-1 text-xs">
                                Narrative Inquiry
                              </ToggleGroupItem>
                              <ToggleGroupItem value="content_analysis" className="px-3 py-1 text-xs">
                                Content Analysis
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormDescription className="text-xs">
                            These will be suggested when creating new projects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!isMobile && (
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => form.reset()}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              )}
            </CardContent>
            
            {isMobile && (
              <CardFooter className="px-4 py-4">
                <div className="flex w-full justify-between space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => form.reset()}
                  >
                    <Trash className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1"
                    disabled={isLoading}
                    onClick={form.handleSubmit(handleSaveProfile)}
                  >
                    {isLoading ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3 mr-1" />
                    )}
                    Save
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
