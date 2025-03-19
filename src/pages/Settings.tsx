
import { useState } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/shared/PageTransition";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Brain,
  Lock,
  User,
  Save,
  RotateCw,
  KeyRound,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const Settings = () => {
  return (
    <PageTransition>
      <Navbar />
      
      <main className="pt-24 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.42, 0, 0.58, 1] }}
          >
            <h1 className="text-3xl font-semibold mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">
              Manage your account and configure application preferences
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
              <Tabs defaultValue="profile" orientation="vertical" className="flex flex-col sm:flex-row lg:flex-col">
                <TabsList className="h-auto justify-start sm:flex-col mb-6 sm:mb-0 bg-secondary/30 p-1 rounded-lg gap-1">
                  <TabsTrigger value="profile" className="justify-start data-[state=active]:bg-background">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="agents" className="justify-start data-[state=active]:bg-background">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Agents
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start data-[state=active]:bg-background">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start data-[state=active]:bg-background">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex-1">
                  <TabsContent value="profile" className="m-0">
                    <ProfileSettings />
                  </TabsContent>
                  
                  <TabsContent value="agents" className="m-0">
                    <AgentSettings />
                  </TabsContent>
                  
                  <TabsContent value="security" className="m-0">
                    <SecuritySettings />
                  </TabsContent>
                  
                  <TabsContent value="notifications" className="m-0">
                    <NotificationSettings />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

const ProfileSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSave = () => {
    setIsLoading(true);
    // Simulate saving
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="glass-card">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-4">Profile Settings</h2>
        <p className="text-muted-foreground mb-6">
          Update your personal information and preferences.
        </p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="Enter your first name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Enter your last name" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Enter your email address" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input id="organization" placeholder="Enter your organization" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="researcher">Researcher</SelectItem>
                <SelectItem value="professor">Professor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="analyst">Analyst</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="researchFields">Research Fields</Label>
            <Input id="researchFields" placeholder="e.g., Health, Education, Technology" />
            <p className="text-xs text-muted-foreground mt-1">
              Separate multiple fields with commas
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-border/40">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

const AgentSettings = () => {
  return (
    <div className="glass-card">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-4">AI Agent Settings</h2>
        <p className="text-muted-foreground mb-6">
          Configure AI agents and their methodological approaches.
        </p>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="defaultAgents">Default Analysis Agents</Label>
            <Select>
              <SelectTrigger id="defaultAgents">
                <SelectValue placeholder="Select default agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Available Agents</SelectItem>
                <SelectItem value="grounded">Grounded Theory Only</SelectItem>
                <SelectItem value="phenomenology">Phenomenology Only</SelectItem>
                <SelectItem value="discourse">Discourse Analysis Only</SelectItem>
                <SelectItem value="custom">Custom Selection</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base">Agent Capabilities</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Select which capabilities should be enabled for AI agents
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="crossReferences" defaultChecked />
                <Label htmlFor="crossReferences" className="font-normal cursor-pointer">
                  Cross-reference analysis between agents
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="debateMode" defaultChecked />
                <Label htmlFor="debateMode" className="font-normal cursor-pointer">
                  Enable agent debate mode
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="uncertainty" defaultChecked />
                <Label htmlFor="uncertainty" className="font-normal cursor-pointer">
                  Show uncertainty levels in analysis
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="autoSummary" defaultChecked />
                <Label htmlFor="autoSummary" className="font-normal cursor-pointer">
                  Generate automatic summaries
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="citations" defaultChecked />
                <Label htmlFor="citations" className="font-normal cursor-pointer">
                  Include data citations in insights
                </Label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base">Model Selection</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which AI models to use for analysis
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="gpt4" className="font-normal cursor-pointer mb-1">
                    GPT-4o (Recommended)
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Best overall performance for qualitative analysis
                  </span>
                </div>
                <Switch id="gpt4" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="claude" className="font-normal cursor-pointer mb-1">
                    Claude
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Alternative model with different strengths
                  </span>
                </div>
                <Switch id="claude" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="llama" className="font-normal cursor-pointer mb-1">
                    Llama 3
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Open-source alternative
                  </span>
                </div>
                <Switch id="llama" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-border/40">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="glass-card">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-4">Security Settings</h2>
        <p className="text-muted-foreground mb-6">
          Manage your account security and privacy preferences.
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 px-4 bg-secondary/30 rounded-lg">
            <div>
              <h3 className="font-medium flex items-center">
                <KeyRound className="h-4 w-4 mr-2 text-primary" />
                Password
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Last changed 3 months ago
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-8">
              Change
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base">Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">Two-factor authentication</p>
                <p className="text-sm text-muted-foreground">
                  Protect your account with an additional verification step
                </p>
              </div>
              <Switch id="2fa" />
            </div>
            
            <Button variant="outline" className="w-full mt-2">
              Set Up Two-Factor Authentication
            </Button>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base">Data Privacy</Label>
            <p className="text-sm text-muted-foreground mb-4">
              Control how your research data is stored and used
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="anonymize" defaultChecked />
                <Label htmlFor="anonymize" className="font-normal cursor-pointer">
                  Anonymize personal data in analysis
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="localOnly" />
                <Label htmlFor="localOnly" className="font-normal cursor-pointer">
                  Process sensitive data locally when possible
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox id="deleteData" defaultChecked />
                <Label htmlFor="deleteData" className="font-normal cursor-pointer">
                  Automatically delete raw data after processing
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-border/40">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="glass-card">
      <div className="p-6">
        <h2 className="text-xl font-medium mb-4">Notification Settings</h2>
        <p className="text-muted-foreground mb-6">
          Control which notifications you receive and how they are delivered.
        </p>
        
        <div className="space-y-6">
          <div>
            <Label className="text-base mb-2 block">Email Notifications</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="analysisComplete" className="font-normal cursor-pointer">
                  Analysis completion
                </Label>
                <Switch id="analysisComplete" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="newCollaborator" className="font-normal cursor-pointer">
                  New collaborator added
                </Label>
                <Switch id="newCollaborator" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="projectUpdates" className="font-normal cursor-pointer">
                  Project updates
                </Label>
                <Switch id="projectUpdates" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="newsletter" className="font-normal cursor-pointer">
                  Newsletter and product updates
                </Label>
                <Switch id="newsletter" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <Label className="text-base mb-2 block">In-App Notifications</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="agentActivity" className="font-normal cursor-pointer">
                  Agent activity updates
                </Label>
                <Switch id="agentActivity" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="comments" className="font-normal cursor-pointer">
                  Comments on insights
                </Label>
                <Switch id="comments" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mentions" className="font-normal cursor-pointer">
                  Mentions and tags
                </Label>
                <Switch id="mentions" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="tips" className="font-normal cursor-pointer">
                  Tips and feature announcements
                </Label>
                <Switch id="tips" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="notificationFrequency">Notification Frequency</Label>
            <Select>
              <SelectTrigger id="notificationFrequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end items-center gap-3 px-6 py-4 border-t border-border/40">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default Settings;
