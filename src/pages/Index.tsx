
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import BusinessTypeSelector from "@/components/business/BusinessTypeSelector";
import Dashboard from "./Dashboard";
import { useSearchParams } from "react-router-dom";
import { Database } from "@/integration/supabase/types";
import { supabase } from "@/integration/supabase/client";
// import { supabase } from "@/integrations/supabase/client";
// import type { Database } from '@/integrations/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

const Index = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType | null>(null);
  const [showBusinessSelector, setShowBusinessSelector] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('business_type')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setShowBusinessSelector(true);
        } else if (profile?.business_type) {
          setSelectedBusinessType(profile.business_type);
        } else {
          setShowBusinessSelector(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setShowBusinessSelector(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleBusinessTypeSelect = async (type: BusinessType) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ business_type: type })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating business type:', error);
        return;
      }

      setSelectedBusinessType(type);
      setShowBusinessSelector(false);
    } catch (error) {
      console.error('Error updating business type:', error);
    }
  };

  const handleSwitchBusinessType = () => {
    setShowBusinessSelector(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Please log in to continue...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  if (showBusinessSelector || !selectedBusinessType) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <BusinessTypeSelector 
            onSelect={handleBusinessTypeSelect}
            currentBusinessType={selectedBusinessType}
            user={user}
          />
        </div>
      </div>
    );
  }

  return (
    <Dashboard 
      view={view} 
      businessType={selectedBusinessType} 
      onSwitchBusinessType={handleSwitchBusinessType}
    />
  );
};

export default Index;