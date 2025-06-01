
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Package, 
  DollarSign,
  Calendar,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface DashboardStatsProps {
  businessType: string;
}

const DashboardStats = ({ businessType }: DashboardStatsProps) => {
  const getBusinessSpecificStats = (type: string) => {
    switch (type) {
      case "Hospital":
        return [
          {
            title: "Total Patients",
            value: "2,847",
            change: "+12%",
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Today's Appointments",
            value: "156",
            change: "+8",
            changeType: "positive" as const,
            icon: Calendar,
            color: "text-green-600"
          },
          {
            title: "Medical Supplies",
            value: "1,234",
            change: "-23",
            changeType: "negative" as const,
            icon: Package,
            color: "text-orange-600"
          },
          {
            title: "Revenue",
            value: "$45,678",
            change: "+15%",
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];
      
      case "Medical Store":
        return [
          {
            title: "Total Customers",
            value: "1,456",
            change: "+18%",
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Medicines in Stock",
            value: "3,247",
            change: "+156",
            changeType: "positive" as const,
            icon: Package,
            color: "text-green-600"
          },
          {
            title: "Prescriptions Today",
            value: "89",
            change: "+12",
            changeType: "positive" as const,
            icon: Activity,
            color: "text-orange-600"
          },
          {
            title: "Daily Revenue",
            value: "$2,345",
            change: "+8%",
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];

      case "Warehouse":
        return [
          {
            title: "Total Items",
            value: "15,678",
            change: "+234",
            changeType: "positive" as const,
            icon: Package,
            color: "text-blue-600"
          },
          {
            title: "Orders Today",
            value: "127",
            change: "+15%",
            changeType: "positive" as const,
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "Low Stock Items",
            value: "23",
            change: "+5",
            changeType: "negative" as const,
            icon: AlertTriangle,
            color: "text-red-600"
          },
          {
            title: "Revenue",
            value: "$78,456",
            change: "+22%",
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];

      default:
        return [
          {
            title: "Total Customers",
            value: "2,456",
            change: "+14%",
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Sales Today",
            value: "145",
            change: "+12%",
            changeType: "positive" as const,
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "Products",
            value: "1,789",
            change: "+56",
            changeType: "positive" as const,
            icon: Package,
            color: "text-orange-600"
          },
          {
            title: "Revenue",
            value: "$34,567",
            change: "+18%",
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];
    }
  };

  const stats = getBusinessSpecificStats(businessType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="flex items-center mt-1">
              <Badge 
                variant={stat.changeType === "positive" ? "default" : "destructive"}
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <p className="text-xs text-gray-500 ml-2">from last month</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
