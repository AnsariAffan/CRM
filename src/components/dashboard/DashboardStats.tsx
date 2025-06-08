
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
import { useDashboardData } from '@/hooks/useDashboardData';
import { Database } from "@/integration/supabase/types";


type BusinessType = Database['public']['Enums']['business_type'];

interface DashboardStatsProps {
  businessType: BusinessType;
}

const DashboardStats = ({ businessType }: DashboardStatsProps) => {
  const { stats, loading, error } = useDashboardData(businessType);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="col-span-full">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <p className="text-red-600">Error loading dashboard stats: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBusinessSpecificStats = (type: BusinessType) => {
    const baseStats = {
      totalCustomers: stats.totalCustomers,
      totalProducts: stats.totalProducts,
      totalOrders: stats.totalOrders,
      totalRevenue: stats.totalRevenue,
      monthlyGrowth: stats.monthlyGrowth
    };

    switch (type) {
      case "Hospital":
        return [
          {
            title: "Total Patients",
            value: baseStats.totalCustomers.toString(),
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Today's Appointments",
            value: Math.floor(baseStats.totalOrders / 30).toString(),
            change: "+8",
            changeType: "positive" as const,
            icon: Calendar,
            color: "text-green-600"
          },
          {
            title: "Medical Supplies",
            value: baseStats.totalProducts.toString(),
            change: baseStats.totalProducts > 100 ? "+23" : "-5",
            changeType: baseStats.totalProducts > 100 ? "positive" as const : "negative" as const,
            icon: Package,
            color: "text-orange-600"
          },
          {
            title: "Revenue",
            value: `$${baseStats.totalRevenue.toLocaleString()}`,
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];
      
      case "Medical Store":
        return [
          {
            title: "Total Customers",
            value: baseStats.totalCustomers.toString(),
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Medicines in Stock",
            value: baseStats.totalProducts.toString(),
            change: baseStats.totalProducts > 50 ? "+156" : "+12",
            changeType: "positive" as const,
            icon: Package,
            color: "text-green-600"
          },
          {
            title: "Prescriptions Today",
            value: Math.floor(baseStats.totalOrders / 10).toString(),
            change: "+12",
            changeType: "positive" as const,
            icon: Activity,
            color: "text-orange-600"
          },
          {
            title: "Daily Revenue",
            value: `$${Math.floor(baseStats.totalRevenue / 30).toLocaleString()}`,
            change: `+${Math.floor(baseStats.monthlyGrowth / 2)}%`,
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];

      case "Warehouse":
        return [
          {
            title: "Total Items",
            value: baseStats.totalProducts.toString(),
            change: `+${Math.floor(baseStats.monthlyGrowth * 10)}`,
            changeType: "positive" as const,
            icon: Package,
            color: "text-blue-600"
          },
          {
            title: "Orders Today",
            value: Math.floor(baseStats.totalOrders / 7).toString(),
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "Low Stock Items",
            value: Math.floor(baseStats.totalProducts / 10).toString(),
            change: "+5",
            changeType: "negative" as const,
            icon: AlertTriangle,
            color: "text-red-600"
          },
          {
            title: "Revenue",
            value: `$${baseStats.totalRevenue.toLocaleString()}`,
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];

      default:
        return [
          {
            title: "Total Customers",
            value: baseStats.totalCustomers.toString(),
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: Users,
            color: "text-blue-600"
          },
          {
            title: "Sales Today",
            value: Math.floor(baseStats.totalOrders / 7).toString(),
            change: `+${Math.floor(baseStats.monthlyGrowth / 2)}%`,
            changeType: "positive" as const,
            icon: TrendingUp,
            color: "text-green-600"
          },
          {
            title: "Products",
            value: baseStats.totalProducts.toString(),
            change: `+${Math.floor(baseStats.totalProducts / 10)}`,
            changeType: "positive" as const,
            icon: Package,
            color: "text-orange-600"
          },
          {
            title: "Revenue",
            value: `$${baseStats.totalRevenue.toLocaleString()}`,
            change: `+${baseStats.monthlyGrowth}%`,
            changeType: "positive" as const,
            icon: DollarSign,
            color: "text-purple-600"
          }
        ];
    }
  };

  const statsData = getBusinessSpecificStats(businessType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
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