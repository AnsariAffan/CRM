
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import QuickActions from '@/components/dashboard/QuickActions';
import CustomerList from '@/components/crud/CustomerList';
import ProductList from '@/components/crud/ProductList';
import OrderList from '@/components/crud/OrderList';
import SupplierList from '@/components/crud/SupplierList';
import AppointmentList from '@/components/crud/AppointmentList';
import ReportsPage from '@/components/reports/ReportsPage';
import SettingsPage from '@/components/settings/SettingsPage';
import { Database } from '@/integration/supabase/types';
// import type { Database } from '@/integrations/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface DashboardProps {
  view?: string;
  businessType: BusinessType;
  onSwitchBusinessType: () => void;
}

const Dashboard = ({ view = 'dashboard', businessType, onSwitchBusinessType }: DashboardProps) => {
  const { user } = useAuth();

  const renderContent = () => {
    switch (view) {
      case 'customers':
      case 'patients':
        return <CustomerList businessType={businessType} />;
      case 'products':
      case 'medicines':
      case 'inventory':
        return <ProductList businessType={businessType} />;
      case 'orders':
      case 'sales':
      case 'prescriptions':
        return <OrderList businessType={businessType} />;
      case 'suppliers':
        return <SupplierList businessType={businessType} />;
      case 'appointments':
        return <AppointmentList businessType={businessType} />;
      case 'reports':
      case 'analytics':
        return <ReportsPage businessType={businessType} />;
      case 'settings':
        return <SettingsPage businessType={businessType} onSwitchBusinessType={onSwitchBusinessType} />;
      case 'ai-insights':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">AI Insights functionality coming soon...</p>
            </div>
          </div>
        );
      case 'records':
        return React.createElement(
          React.lazy(() => import('@/components/medical/MedicalRecords')),
          { businessType }
        );
      case 'locations':
        return React.createElement(
          React.lazy(() => import('@/components/warehouse/LocationManagementProps')),
          { businessType }
        );
      default:
        return (
          <div className="space-y-6">
            <DashboardStats businessType={businessType} />
            <DashboardCharts businessType={businessType} />
            <QuickActions businessType={businessType} />
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      businessType={businessType} 
      onSwitchBusinessType={onSwitchBusinessType}
    >
      <React.Suspense fallback={<div>Loading...</div>}>
        {renderContent()}
      </React.Suspense>
    </DashboardLayout>
  );
};

export default Dashboard;