
import { useState, useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, Brain, Database, Settings, LogOut } from "lucide-react";

import { supabase } from "@/integration/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import BusinessTypeSelector from "@/components/business/BusinessTypeSelector";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AIInsights from "@/components/ai/AIInsights";
import QuickActions from "@/components/dashboard/QuickActions";
import CustomerList from "@/components/crud/CustomerList";


const Index = () => {
  const { user, signOut } = useAuth();
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          setSelectedBusinessType(profile.business_type);
          setIsSetupComplete(true);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleBusinessTypeSelect = async (businessType: string) => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ business_type: businessType as "Hospital" | "Medical Store" | "Warehouse" | "Retail Store" | "Automotive" | "General Business" })
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update business type",
          variant: "destructive",
        });
        return;
      }

      setSelectedBusinessType(businessType);
      setIsSetupComplete(true);
      toast({
        title: "Business Type Updated",
        description: `Your CRM is now configured for ${businessType} operations.`,
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  };

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">Dynamic CRM</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">
              AI-Powered Customer Relationship Management
            </p>
            <p className="text-lg text-gray-500 mb-4">
              Welcome {userProfile?.full_name || user?.email}! Please select your business type to continue.
            </p>
            <Button variant="outline" onClick={handleSignOut} className="mb-6">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="text-center">
                <Brain className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">AI-Powered</CardTitle>
                <CardDescription>
                  Smart insights and automated recommendations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 shadow-lg">
              <CardHeader className="text-center">
                <Database className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Dynamic Database</CardTitle>
                <CardDescription>
                  Customizable data structures for any business
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 shadow-lg">
              <CardHeader className="text-center">
                <Settings className="h-10 w-10 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Fully Customizable</CardTitle>
                <CardDescription>
                  Adapt to your specific business needs
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <BusinessTypeSelector onSelect={handleBusinessTypeSelect} />
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout businessType={selectedBusinessType}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">
              Welcome to your {selectedBusinessType} CRM, {userProfile?.full_name || user?.email}
              <Badge variant="secondary" className="ml-2">
                {selectedBusinessType}
              </Badge>
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsSetupComplete(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Business Type
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        <DashboardStats businessType={selectedBusinessType} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIInsights businessType={selectedBusinessType} />
          </div>
          <div>
            <QuickActions businessType={selectedBusinessType} />
          </div>
        </div>

        <CustomerList businessType={selectedBusinessType} />
      </div>
    </DashboardLayout>
  );
};

export default Index;
