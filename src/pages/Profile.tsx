
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
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, User, Mail, LogIn, Save, Trash } from "lucide-react";
import PageTransition from "@/components/shared/PageTransition";
import { getGravatarUrl } from "@/utils/profileUtils";

// Define the profile schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  defaultExportFormat: z.enum(["pdf", "csv", "markdown", "json"]),
  preferredMethodologies: z.array(z.string()),
  darkMode: z.boolean().default(false),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const user = useUser();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loginProvider, setLoginProvider] = useState<string>("email");
  
  // Profile form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      defaultExportFormat: "pdf",
      preferredMethodologies: [],
      darkMode: false,
    },
  });

  // Fetch user profile on load
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get user's email for Gravatar
        const email = user.email || "";
        
        // Check if the user has a Google avatar
        const googleAvatarUrl = user?.user_metadata?.avatar_url;
        
        // Use Google avatar or fall back to Gravatar
        if (googleAvatarUrl) {
          setAvatarUrl(googleAvatarUrl);
          setLoginProvider("google");
        } else {
          setAvatarUrl(getGravatarUrl(email));
          setLoginProvider("email");
        }
        
        // Get profile data from Supabase
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
          // Parse the saved preferences JSON
          const preferences = profile.preferences || {};
          
          // Update form values
          form.reset({
            name: profile.name || user.user_metadata?.full_name || "",
            defaultExportFormat: preferences.defaultExportFormat || "pdf",
            preferredMethodologies: preferences.preferredMethodologies || [],
            darkMode: preferences.darkMode || false,
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
      
      // Extract preferences to store as JSONB
      const preferences = {
        defaultExportFormat: values.defaultExportFormat,
        preferredMethodologies: values.preferredMethodologies,
        darkMode: values.darkMode,
      };
      
      // Update profile in Supabase
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
        title: "Success",
        description: "Your profile has been updated.",
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
      <div className="container max-w-5xl py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">User Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* User info card */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                <AvatarImage src={avatarUrl || ""} alt={user.email || "User"} />
                <AvatarFallback className="text-2xl">
                  {user.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user.user_metadata?.full_name || form.getValues().name || "User"}
                </h3>
                <div className="flex items-center justify-center text-muted-foreground gap-1 mt-1">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <LogIn className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Signed in with:</span>
                <Badge variant="outline" className="capitalize">
                  {loginProvider}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button variant="outline" onClick={() => navigate("/settings")}>
                Manage Account
              </Button>
            </CardFooter>
          </Card>
          
          {/* Preferences form */}
          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize your QualAgents experience</CardDescription>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-6">
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
                          <FormDescription>
                            This is how you'll appear in the application
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
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
                          <FormDescription>
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
                          <FormDescription>
                            These will be suggested when creating new projects
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="darkMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Dark Mode</FormLabel>
                            <FormDescription>
                              Switch between light and dark themes
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
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
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
