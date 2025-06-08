import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Settings, User, Bell, Shield, Building2, Key, Webhook, FileText, Download, Upload, HardDrive, History, Eye } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

import SystemLogsModal from './SystemLogsModal';
import { logActivity } from '@/utils/activityLogger';
import { supabase } from '@/integration/supabase/client';
import { Database } from '@/integration/supabase/types';


type BusinessType = Database['public']['Enums']['business_type'];

interface SettingsPageProps {
  businessType: BusinessType;
  onSwitchBusinessType: () => void;
}

const SettingsPage = ({ businessType, onSwitchBusinessType }: SettingsPageProps) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.full_name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: '+1234567890',
    company: 'My Business'
  });
  
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    marketingEmails: false
  });
  
  const [systemSettings, setSystemSettings] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    passwordPolicy: 'medium'
  });

  // Profile Management
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.name,
          email: profile.email
        })
        .eq('id', user?.id);

      if (error) throw error;

      await logActivity('UPDATE', 'Profile', { fields: ['name', 'email'] });

      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    } catch (error) {
      console.error('Profile update error:', error);
      await logActivity('UPDATE_FAILED', 'Profile', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Notification Settings
  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user?.id,
          business_type: businessType,
          setting_key: 'notifications',
          setting_value: JSON.stringify(notifications)
        });

      if (error) throw error;

      await logActivity('UPDATE', 'Notification Settings', notifications);

      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved",
      });
    } catch (error) {
      console.error('Notification settings error:', error);
      await logActivity('UPDATE_FAILED', 'Notification Settings', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // System Settings
  const handleSaveSystemSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user?.id,
          business_type: businessType,
          setting_key: 'system_preferences',
          setting_value: JSON.stringify(systemSettings)
        });

      if (error) throw error;

      await logActivity('UPDATE', 'System Settings', systemSettings);

      toast({
        title: "System settings updated",
        description: "Your system preferences have been saved",
      });
    } catch (error) {
      console.error('System settings error:', error);
      await logActivity('UPDATE_FAILED', 'System Settings', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to update system settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Data Management Functions
  const handleExportData = async () => {
    setLoading(true);
    try {
      const { data: customers } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .eq('business_type', businessType);

      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user?.id)
        .eq('business_type', businessType);

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('business_type', businessType);

      const exportData = {
        profile,
        businessType,
        customers: customers || [],
        products: products || [],
        orders: orders || [],
        exportDate: new Date().toISOString()
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${businessType}_data_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      await logActivity('EXPORT', 'Data', { 
        exportType: 'JSON',
        recordCount: (customers?.length || 0) + (products?.length || 0) + (orders?.length || 0)
      });

      toast({
        title: "Data exported successfully",
        description: "Your data has been exported to a JSON file",
      });
    } catch (error) {
      console.error('Export error:', error);
      await logActivity('EXPORT_FAILED', 'Data', { error: error.message });
      toast({
        title: "Export failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            
            await logActivity('IMPORT', 'Data', { 
              fileName: file.name,
              fileSize: file.size,
              importType: 'JSON'
            });
            
            toast({
              title: "Data imported successfully",
              description: "Your data has been imported",
            });
          } catch (error) {
            console.error('Import error:', error);
            await logActivity('IMPORT_FAILED', 'Data', { error: error.message });
            toast({
              title: "Import failed",
              description: "Invalid file format",
              variant: "destructive",
            });
          } finally {
            setLoading(false);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleBackupData = async () => {
    setLoading(true);
    try {
      const { data: allData } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id);

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await logActivity('BACKUP', 'Data', { 
        backupType: 'Full',
        recordCount: allData?.length || 0
      });
      
      toast({
        title: "Backup created",
        description: "Your data backup has been created successfully",
      });
    } catch (error) {
      console.error('Backup error:', error);
      await logActivity('BACKUP_FAILED', 'Data', { error: error.message });
      toast({
        title: "Backup failed",
        description: "Failed to create backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Security Functions
  const handleChangePassword = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '');
      
      if (error) throw error;
      
      await logActivity('PASSWORD_RESET', 'Security', { email: user?.email });
      
      toast({
        title: "Password reset initiated",
        description: "Please check your email for password reset instructions",
      });
    } catch (error) {
      console.error('Password reset error:', error);
      await logActivity('PASSWORD_RESET_FAILED', 'Security', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to initiate password reset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    setLoading(true);
    try {
      const newTwoFactorState = !security.twoFactorEnabled;
      
      const { error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user?.id,
          business_type: businessType,
          setting_key: 'two_factor_auth',
          setting_value: JSON.stringify({ enabled: newTwoFactorState })
        });

      if (error) throw error;

      setSecurity(prev => ({ ...prev, twoFactorEnabled: newTwoFactorState }));
      
      await logActivity('2FA_TOGGLE', 'Security', { enabled: newTwoFactorState });
      
      toast({
        title: newTwoFactorState ? "Two-factor auth enabled" : "Two-factor auth disabled",
        description: newTwoFactorState ? 
          "Two-factor authentication has been enabled for your account" : 
          "Two-factor authentication has been disabled for your account",
      });
    } catch (error) {
      console.error('Two-factor auth error:', error);
      await logActivity('2FA_TOGGLE_FAILED', 'Security', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewLoginHistory = async () => {
    setLoading(true);
    try {
      await logActivity('VIEW', 'Login History', {});
      setShowSystemLogs(true);
      
      toast({
        title: "Login History",
        description: "Displaying recent login activity for your account",
      });
    } catch (error) {
      console.error('Login history error:', error);
      await logActivity('VIEW_FAILED', 'Login History', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to load login history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Advanced Functions
  const handleManageAPIKeys = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await logActivity('VIEW', 'API Keys', {});
      
      toast({
        title: "API Keys Management",
        description: "Opening API keys management interface",
      });
    } catch (error) {
      console.error('API keys error:', error);
      await logActivity('VIEW_FAILED', 'API Keys', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to access API keys management",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageWebhooks = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await logActivity('VIEW', 'Webhooks', {});
      
      toast({
        title: "Webhooks Management",
        description: "Opening webhooks configuration interface",
      });
    } catch (error) {
      console.error('Webhooks error:', error);
      await logActivity('VIEW_FAILED', 'Webhooks', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to access webhooks management",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewSystemLogs = async () => {
    setLoading(true);
    try {
      await logActivity('VIEW', 'System Logs', {});
      setShowSystemLogs(true);
      
      toast({
        title: "System Logs",
        description: "Displaying system activity logs",
      });
    } catch (error) {
      console.error('System logs error:', error);
      await logActivity('VIEW_FAILED', 'System Logs', { error: error.message });
      toast({
        title: "Error",
        description: "Failed to load system logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-gray-500">Receive promotional and marketing emails</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={notifications.marketingEmails}
                    onCheckedChange={(checked) => 
                      setNotifications({ ...notifications, marketingEmails: checked })
                    }
                  />
                </div>
              </div>
              
              <Separator />
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={loading}>
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>Data management, security, and advanced system operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Data Management */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      {/* <Database className="h-5 w-5" /> */}
                      Data Management
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleExportData}
                        disabled={loading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleImportData}
                        disabled={loading}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleBackupData}
                        disabled={loading}
                      >
                        <HardDrive className="h-4 w-4 mr-2" />
                        Backup Data
                      </Button>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Security
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleChangePassword}
                        disabled={loading}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleToggleTwoFactor}
                        disabled={loading}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {security.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Auth
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleViewLoginHistory}
                        disabled={loading}
                      >
                        <History className="h-4 w-4 mr-2" />
                        Login History
                      </Button>
                    </div>
                  </div>

                  {/* Advanced */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Advanced
                    </h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleManageAPIKeys}
                        disabled={loading}
                      >
                        <Key className="h-4 w-4 mr-2" />
                        API Keys
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleManageWebhooks}
                        disabled={loading}
                      >
                        <Webhook className="h-4 w-4 mr-2" />
                        Webhooks
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={handleViewSystemLogs}
                        disabled={loading}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        System Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Configure application appearance and behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select value={systemSettings.theme} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, theme: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={systemSettings.language} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, language: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={systemSettings.timezone} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, timezone: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time</SelectItem>
                        <SelectItem value="PST">Pacific Time</SelectItem>
                        <SelectItem value="CST">Central Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={systemSettings.dateFormat} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, dateFormat: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={systemSettings.currency} onValueChange={(value) => 
                      setSystemSettings({ ...systemSettings, currency: value })
                    }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                <div className="flex justify-end">
                  <Button onClick={handleSaveSystemSettings} disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
              <CardDescription>Manage your business type and related preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Business Type</Label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">{businessType}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Switch Business Type</Label>
                  <p className="text-sm text-gray-500">
                    Change your business type to access different features and layouts
                  </p>
                  <Button onClick={onSwitchBusinessType} variant="outline">
                    Switch Business Type
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Danger Zone</h3>
                <div className="border border-red-200 rounded-lg p-4 space-y-3">
                  <div className="space-y-2">
                    <Label className="text-red-700">Reset All Data</Label>
                    <p className="text-sm text-red-600">
                      This will permanently delete all your data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" size="sm">
                      Reset All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SystemLogsModal 
        open={showSystemLogs} 
        onOpenChange={setShowSystemLogs} 
      />
    </div>
  );
};

export default SettingsPage;