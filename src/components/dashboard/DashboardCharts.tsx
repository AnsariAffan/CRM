
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useDashboardData } from '@/hooks/useDashboardData';
import { Database } from "@/integration/supabase/types";


type BusinessType = Database['public']['Enums']['business_type'];

interface DashboardChartsProps {
  businessType: BusinessType;
}

const DashboardCharts = ({ businessType }: DashboardChartsProps) => {
  const { chartData, customers, products, orders, loading, error } = useDashboardData(businessType);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className={i === 2 ? "lg:col-span-2" : ""}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <CardContent className="flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-red-600">Error loading charts: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate chart data based on business type and actual data
  const getChartData = () => {
    switch (businessType) {
      case "Hospital":
        return {
          monthlyData: chartData.map(item => ({
            month: item.month,
            patients: Math.floor(item.value1 / 10),
            appointments: item.appointments,
            revenue: item.revenue
          })),
          departmentData: [
            { name: "Cardiology", value: 35, color: "#8884d8" },
            { name: "Neurology", value: 25, color: "#82ca9d" },
            { name: "Orthopedics", value: 20, color: "#ffc658" },
            { name: "Pediatrics", value: 15, color: "#ff7300" },
            { name: "Others", value: 5, color: "#8dd1e1" }
          ]
        };
      
      case "Medical Store":
        return {
          monthlyData: chartData.map(item => ({
            month: item.month,
            sales: item.revenue,
            prescriptions: Math.floor(item.orders * 1.5),
            customers: Math.floor(item.value1 / 5)
          })),
          categoryData: [
            { name: "Prescription", value: 45, color: "#8884d8" },
            { name: "OTC Medicines", value: 30, color: "#82ca9d" },
            { name: "Supplements", value: 15, color: "#ffc658" },
            { name: "Medical Devices", value: 10, color: "#ff7300" }
          ]
        };

      case "Warehouse":
        return {
          monthlyData: chartData.map(item => ({
            month: item.month,
            orders: item.orders,
            inventory: Math.floor(item.value1 * 2),
            fulfillment: Math.min(99, 90 + Math.floor(Math.random() * 9))
          })),
          locationData: [
            { name: "Zone A", value: 35, color: "#8884d8" },
            { name: "Zone B", value: 28, color: "#82ca9d" },
            { name: "Zone C", value: 22, color: "#ffc658" },
            { name: "Zone D", value: 15, color: "#ff7300" }
          ]
        };

      default:
        return {
          monthlyData: chartData.map(item => ({
            month: item.month,
            sales: item.revenue,
            customers: Math.floor(item.value1 / 10),
            orders: item.orders
          })),
          categoryData: [
            { name: "Products", value: 40, color: "#8884d8" },
            { name: "Services", value: 35, color: "#82ca9d" },
            { name: "Consulting", value: 15, color: "#ffc658" },
            { name: "Others", value: 10, color: "#ff7300" }
          ]
        };
    }
  };

  const data = getChartData();

  const chartConfig = {
    primary: { color: "#8884d8" },
    secondary: { color: "#82ca9d" },
    tertiary: { color: "#ffc658" }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>
            {businessType === "Hospital" ? "Patients, Appointments & Revenue" :
             businessType === "Medical Store" ? "Sales, Prescriptions & Customers" :
             businessType === "Warehouse" ? "Orders, Inventory & Fulfillment Rate" :
             "Sales, Customers & Orders"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey={businessType === "Hospital" ? "patients" : 
                          businessType === "Medical Store" ? "sales" :
                          businessType === "Warehouse" ? "orders" : "sales"} 
                  stroke="#8884d8" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey={businessType === "Hospital" ? "appointments" : 
                          businessType === "Medical Store" ? "prescriptions" :
                          businessType === "Warehouse" ? "inventory" : "customers"} 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {businessType === "Hospital" ? "Department Distribution" :
             businessType === "Medical Store" ? "Category Distribution" :
             businessType === "Warehouse" ? "Zone Distribution" :
             "Business Category Distribution"}
          </CardTitle>
          <CardDescription>
            Breakdown by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.categoryData || data.departmentData || data.locationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {(data.categoryData || data.departmentData || data.locationData)?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Performance Bar Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Monthly performance metrics based on your actual data</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey={businessType === "Hospital" ? "revenue" : 
                          businessType === "Medical Store" ? "sales" :
                          businessType === "Warehouse" ? "orders" : "sales"} 
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;