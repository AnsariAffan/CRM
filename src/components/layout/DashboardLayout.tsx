
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Calendar,
  Settings,
  LogOut,
  Building2,
  BarChart,
  FileText,
  Stethoscope,
  Truck,
  UserCheck,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessType: BusinessType;
  onSwitchBusinessType: () => void;
}

const DashboardLayout = ({ children, businessType, onSwitchBusinessType }: DashboardLayoutProps) => {
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentView = searchParams.get('view') || 'dashboard';

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigation = (view: string) => {
    setSearchParams({ view });
    setSidebarOpen(false);
  };

  const getNavigationItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'reports', label: 'Reports', icon: BarChart },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];

    const businessSpecificItems = {
      "Hospital": [
        { id: 'patients', label: 'Patients', icon: Users },
        { id: 'appointments', label: 'Appointments', icon: Calendar },
        { id: 'inventory', label: 'Medical Supplies', icon: Package },
        { id: 'records', label: 'Medical Records', icon: FileText },
        { id: 'suppliers', label: 'Suppliers', icon: Truck }
      ],
      "Medical Store": [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'medicines', label: 'Medicines', icon: Package },
        { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
        { id: 'suppliers', label: 'Suppliers', icon: Truck }
      ],
      "Warehouse": [
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'locations', label: 'Locations', icon: Building2 },
        { id: 'suppliers', label: 'Suppliers', icon: Truck }
      ],
      "Retail Store": [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'sales', label: 'Sales', icon: ShoppingCart },
        { id: 'suppliers', label: 'Suppliers', icon: Truck }
      ],
      "Automotive": [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'inventory', label: 'Vehicle Inventory', icon: Package },
        { id: 'orders', label: 'Service Orders', icon: ShoppingCart },
        { id: 'appointments', label: 'Service Appointments', icon: Calendar }
      ],
      "General Business": [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'suppliers', label: 'Suppliers', icon: Truck }
      ]
    };

    return [
      baseItems[0], // Dashboard
      ...businessSpecificItems[businessType] || businessSpecificItems["General Business"],
      ...baseItems.slice(1) // Reports and Settings
    ];
  };

  const navigationItems = getNavigationItems();

  const getBusinessTypeIcon = () => {
    switch (businessType) {
      case "Hospital": return Stethoscope;
      case "Medical Store": return Package;
      case "Warehouse": return Building2;
      case "Retail Store": return ShoppingCart;
      case "Automotive": return Truck;
      default: return Building2;
    }
  };

  const BusinessIcon = getBusinessTypeIcon();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <BusinessIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {businessType.includes('Store') ? 'Store' : businessType}
                </h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 text-left text-sm font-medium rounded-lg transition-colors",
                  currentView === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={onSwitchBusinessType}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Switch Business Type
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">
              {navigationItems.find(item => item.id === currentView)?.label || 'Dashboard'}
            </h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;