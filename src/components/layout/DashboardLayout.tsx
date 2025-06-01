
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Users, 
  Package, 
  TrendingUp, 
  Settings, 
  Brain, 
  FileText,
  Phone,
  Calendar,
  MapPin
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
  businessType: string;
}

const DashboardLayout = ({ children, businessType }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getBusinessSpecificMenuItems = (type: string) => {
    const baseItems = [
      { icon: TrendingUp, label: "Dashboard", path: "/" },
      { icon: Users, label: "Customers", path: "/customers" },
      { icon: Brain, label: "AI Insights", path: "/ai-insights" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ];

    switch (type) {
      case "Hospital":
        return [
          ...baseItems.slice(0, 1),
          { icon: Users, label: "Patients", path: "/patients" },
          { icon: Calendar, label: "Appointments", path: "/appointments" },
          { icon: FileText, label: "Medical Records", path: "/records" },
          { icon: Package, label: "Medical Supplies", path: "/supplies" },
          ...baseItems.slice(2),
        ];
      case "Medical Store":
        return [
          ...baseItems.slice(0, 2),
          { icon: Package, label: "Medicines", path: "/medicines" },
          { icon: FileText, label: "Prescriptions", path: "/prescriptions" },
          ...baseItems.slice(2),
        ];
      case "Warehouse":
        return [
          ...baseItems.slice(0, 2),
          { icon: Package, label: "Inventory", path: "/inventory" },
          { icon: MapPin, label: "Locations", path: "/locations" },
          { icon: FileText, label: "Orders", path: "/orders" },
          ...baseItems.slice(2),
        ];
      case "Retail Store":
        return [
          ...baseItems.slice(0, 2),
          { icon: Package, label: "Products", path: "/products" },
          { icon: FileText, label: "Sales", path: "/sales" },
          { icon: TrendingUp, label: "Analytics", path: "/analytics" },
          ...baseItems.slice(2),
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getBusinessSpecificMenuItems(businessType);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">
          {businessType} CRM
        </h2>
        <p className="text-sm text-gray-500">AI-Powered Management</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            className="w-full justify-start text-left"
            onClick={() => setIsSidebarOpen(false)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>
      
      <div className="p-4 border-t">
        <p className="text-xs text-gray-500">
          Powered by AI • Version 1.0
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{businessType} CRM</h1>
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white shadow-sm border-r min-h-screen">
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
