
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Download, Calendar, TrendingUp, Users, Package, DollarSign, FileText, Mail, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Database } from "@/integration/supabase/types";


type BusinessType = Database['public']['Enums']['business_type'];

interface ReportsPageProps {
  businessType: BusinessType;
}

const ReportsPage = ({ businessType }: ReportsPageProps) => {
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("overview");
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setLoading(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get actual report data
      const reportData = getBusinessSpecificReports();
      const chartData = getChartData();
      
      // Create comprehensive export data
      const exportData = {
        businessType,
        reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        keyMetrics: reportData.keyMetrics,
        chartData: chartData,
        summary: {
          totalRecords: Math.floor(Math.random() * 1000) + 500,
          dateGenerated: new Date().toLocaleDateString(),
          reportScope: `Last ${dateRange} days`
        }
      };

      if (format === 'pdf') {
        // Create a simple HTML string for PDF-like content
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${businessType} Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
              .chart-data { margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${businessType} Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>Report Type: ${reportType} | Date Range: Last ${dateRange} days</p>
            </div>
            <div class="metrics">
              <h2>Key Metrics</h2>
              ${reportData.keyMetrics.map(metric => `
                <div class="metric">
                  <strong>${metric.title}:</strong> ${metric.value}
                </div>
              `).join('')}
            </div>
            <div class="chart-data">
              <h2>Chart Data</h2>
              <pre>${JSON.stringify(chartData, null, 2)}</pre>
            </div>
          </body>
          </html>
        `;
        
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${businessType}_Report_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        // Create CSV format for Excel
        const csvContent = [
          ['Business Type', 'Report Type', 'Date Range', 'Generated At'],
          [businessType, reportType, `Last ${dateRange} days`, new Date().toISOString()],
          [],
          ['Key Metrics'],
          ['Metric', 'Value'],
          ...reportData.keyMetrics.map(metric => [metric.title, metric.value]),
          [],
          ['Chart Data'],
          ['Month', 'Value 1', 'Value 2'],
          ...chartData.map(item => [item.month, item.value1, item.value2])
        ].map(row => row.join(',')).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${businessType}_Report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }

      toast({
        title: "Export successful",
        description: `Report exported to ${format.toUpperCase()} successfully`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailShare = async () => {
    setLoading(true);
    try {
      // Simulate email preparation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const reportData = getBusinessSpecificReports();
      const subject = `${businessType} Report - ${new Date().toLocaleDateString()}`;
      const body = `Dear Team,

Please find the ${businessType} report summary below:

REPORT DETAILS:
- Business Type: ${businessType}
- Report Type: ${reportType}
- Date Range: Last ${dateRange} days
- Generated: ${new Date().toLocaleString()}

KEY METRICS:
${reportData.keyMetrics.map(metric => `• ${metric.title}: ${metric.value}`).join('\n')}

INSIGHTS:
- Strong performance indicators across key areas
- Positive growth trends observed
- Recommended actions available in full report

Best regards,
${businessType} Analytics Team

---
This is an automated report. For detailed charts and analysis, please access the dashboard.`;
      
      // Open default email client
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);

      toast({
        title: "Email prepared",
        description: "Report summary prepared for email sharing",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Failed to prepare email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBusinessSpecificReports = () => {
    switch (businessType) {
      case "Hospital":
        return {
          reportTypes: [
            { id: "overview", name: "Hospital Overview" },
            { id: "patients", name: "Patient Analytics" },
            { id: "appointments", name: "Appointment Reports" },
            { id: "departments", name: "Department Performance" },
            { id: "revenue", name: "Revenue Analysis" }
          ],
          keyMetrics: [
            { title: "Total Patients", value: "2,847", icon: Users, color: "text-blue-600" },
            { title: "Avg Daily Appointments", value: "156", icon: Calendar, color: "text-green-600" },
            { title: "Monthly Revenue", value: "$245,678", icon: DollarSign, color: "text-purple-600" },
            { title: "Patient Satisfaction", value: "94%", icon: TrendingUp, color: "text-orange-600" }
          ]
        };

      case "Medical Store":
        return {
          reportTypes: [
            { id: "overview", name: "Store Overview" },
            { id: "sales", name: "Sales Analytics" },
            { id: "inventory", name: "Inventory Reports" },
            { id: "prescriptions", name: "Prescription Analysis" },
            { id: "customers", name: "Customer Reports" }
          ],
          keyMetrics: [
            { title: "Monthly Sales", value: "$45,234", icon: DollarSign, color: "text-blue-600" },
            { title: "Prescriptions Filled", value: "1,234", icon: Package, color: "text-green-600" },
            { title: "Active Customers", value: "567", icon: Users, color: "text-purple-600" },
            { title: "Stock Turnover", value: "8.2x", icon: TrendingUp, color: "text-orange-600" }
          ]
        };

      case "Warehouse":
        return {
          reportTypes: [
            { id: "overview", name: "Warehouse Overview" },
            { id: "inventory", name: "Inventory Analytics" },
            { id: "orders", name: "Order Processing" },
            { id: "locations", name: "Location Performance" },
            { id: "efficiency", name: "Efficiency Reports" }
          ],
          keyMetrics: [
            { title: "Total Items", value: "15,678", icon: Package, color: "text-blue-600" },
            { title: "Orders Processed", value: "2,456", icon: TrendingUp, color: "text-green-600" },
            { title: "Fulfillment Rate", value: "98.5%", icon: TrendingUp, color: "text-purple-600" },
            { title: "Avg Processing Time", value: "2.3h", icon: Calendar, color: "text-orange-600" }
          ]
        };

      default:
        return {
          reportTypes: [
            { id: "overview", name: "Business Overview" },
            { id: "sales", name: "Sales Reports" },
            { id: "customers", name: "Customer Analytics" },
            { id: "products", name: "Product Performance" },
            { id: "financial", name: "Financial Reports" }
          ],
          keyMetrics: [
            { title: "Total Revenue", value: "$78,456", icon: DollarSign, color: "text-blue-600" },
            { title: "Active Customers", value: "1,234", icon: Users, color: "text-green-600" },
            { title: "Products Sold", value: "5,678", icon: Package, color: "text-purple-600" },
            { title: "Growth Rate", value: "+12%", icon: TrendingUp, color: "text-orange-600" }
          ]
        };
    }
  };

  const reportData = getBusinessSpecificReports();

  // Sample chart data - in a real app, this would come from your database
  const getChartData = () => {
    return [
      { month: "Jan", value1: 2400, value2: 1800 },
      { month: "Feb", value1: 3000, value2: 2200 },
      { month: "Mar", value1: 2800, value2: 2000 },
      { month: "Apr", value1: 3200, value2: 2400 },
      { month: "May", value1: 3500, value2: 2800 },
      { month: "Jun", value1: 3800, value2: 3000 }
    ];
  };

  const chartData = getChartData();

  const pieData = [
    { name: "Category A", value: 35, color: "#8884d8" },
    { name: "Category B", value: 25, color: "#82ca9d" },
    { name: "Category C", value: 20, color: "#ffc658" },
    { name: "Category D", value: 20, color: "#ff7300" }
  ];

  const chartConfig = {
    primary: { color: "#8884d8" },
    secondary: { color: "#82ca9d" }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights for your {businessType.toLowerCase()}</p>
        </div>
        <div className="flex gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportData.reportTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => handleExport('pdf')}
            disabled={loading}
          >
            <FileText className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export PDF"}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => handleExport('excel')}
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            {loading ? "Exporting..." : "Export Excel"}
          </Button>

          <Button 
            variant="outline" 
            onClick={handleEmailShare}
            disabled={loading}
          >
            <Mail className="h-4 w-4 mr-2" />
            {loading ? "Preparing..." : "Share via Email"}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportData.keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="value1" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="value2" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value1" fill="#8884d8" />
                  <Bar dataKey="value2" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Report Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
          <CardDescription>Key insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-green-700">Strong Performance</h4>
                <p className="text-sm text-gray-600">
                  {businessType === "Hospital" ? "Patient satisfaction rates are above industry average" :
                   businessType === "Medical Store" ? "Prescription fulfillment rate exceeds expectations" :
                   businessType === "Warehouse" ? "Order processing efficiency is optimal" :
                   "Sales growth is trending positively"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-yellow-700">Areas for Improvement</h4>
                <p className="text-sm text-gray-600">
                  {businessType === "Hospital" ? "Consider optimizing appointment scheduling during peak hours" :
                   businessType === "Medical Store" ? "Monitor slow-moving inventory items" :
                   businessType === "Warehouse" ? "Review storage efficiency in Zone D" :
                   "Focus on customer retention strategies"}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-semibold text-blue-700">Recommendations</h4>
                <p className="text-sm text-gray-600">
                  {businessType === "Hospital" ? "Implement predictive analytics for resource planning" :
                   businessType === "Medical Store" ? "Establish automated reorder points for high-volume items" :
                   businessType === "Warehouse" ? "Consider implementing IoT sensors for real-time tracking" :
                   "Expand digital marketing efforts to reach new customers"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;