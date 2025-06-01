
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  FileText, 
  Users, 
  Package, 
  Calendar,
  Phone,
  Mail,
  BarChart3
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface QuickActionsProps {
  businessType: string;
}

const QuickActions = ({ businessType }: QuickActionsProps) => {
  const getBusinessSpecificActions = (type: string) => {
    switch (type) {
      case "Hospital":
        return [
          { icon: Plus, label: "Add Patient", color: "bg-blue-500 hover:bg-blue-600" },
          { icon: Calendar, label: "Schedule Appointment", color: "bg-green-500 hover:bg-green-600" },
          { icon: FileText, label: "Medical Record", color: "bg-purple-500 hover:bg-purple-600" },
          { icon: Package, label: "Order Supplies", color: "bg-orange-500 hover:bg-orange-600" },
          { icon: Phone, label: "Emergency Contact", color: "bg-red-500 hover:bg-red-600" },
          { icon: BarChart3, label: "View Reports", color: "bg-indigo-500 hover:bg-indigo-600" }
        ];
      
      case "Medical Store":
        return [
          { icon: Plus, label: "Add Customer", color: "bg-blue-500 hover:bg-blue-600" },
          { icon: Package, label: "Add Medicine", color: "bg-green-500 hover:bg-green-600" },
          { icon: FileText, label: "Process Prescription", color: "bg-purple-500 hover:bg-purple-600" },
          { icon: BarChart3, label: "Sales Report", color: "bg-orange-500 hover:bg-orange-600" },
          { icon: Mail, label: "Send Reminder", color: "bg-pink-500 hover:bg-pink-600" },
          { icon: Users, label: "Supplier Contact", color: "bg-indigo-500 hover:bg-indigo-600" }
        ];

      case "Warehouse":
        return [
          { icon: Package, label: "Add Item", color: "bg-blue-500 hover:bg-blue-600" },
          { icon: FileText, label: "Create Order", color: "bg-green-500 hover:bg-green-600" },
          { icon: BarChart3, label: "Inventory Report", color: "bg-purple-500 hover:bg-purple-600" },
          { icon: Users, label: "Staff Assignment", color: "bg-orange-500 hover:bg-orange-600" },
          { icon: Plus, label: "New Location", color: "bg-pink-500 hover:bg-pink-600" },
          { icon: Phone, label: "Supplier Call", color: "bg-indigo-500 hover:bg-indigo-600" }
        ];

      default:
        return [
          { icon: Plus, label: "Add Customer", color: "bg-blue-500 hover:bg-blue-600" },
          { icon: FileText, label: "Create Order", color: "bg-green-500 hover:bg-green-600" },
          { icon: Package, label: "Add Product", color: "bg-purple-500 hover:bg-purple-600" },
          { icon: BarChart3, label: "View Analytics", color: "bg-orange-500 hover:bg-orange-600" },
          { icon: Mail, label: "Send Email", color: "bg-pink-500 hover:bg-pink-600" },
          { icon: Calendar, label: "Schedule Task", color: "bg-indigo-500 hover:bg-indigo-600" }
        ];
    }
  };

  const actions = getBusinessSpecificActions(businessType);

  const handleAction = (actionLabel: string) => {
    toast({
      title: "Action Initiated",
      description: `${actionLabel} functionality will be available after Supabase integration.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Common tasks for your {businessType.toLowerCase()} business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-16 flex flex-col items-center justify-center text-white border-0 ${action.color} hover:scale-105 transition-transform`}
              onClick={() => handleAction(action.label)}
            >
              <action.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
