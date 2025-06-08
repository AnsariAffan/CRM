
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AIInsightsProps {
  businessType: string;
}

const AIInsights = ({ businessType }: AIInsightsProps) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateAIInsights = (type: string) => {
    const baseInsights = {
      "Hospital": [
        {
          type: "trend",
          title: "Patient Volume Increasing",
          description: "30% increase in patient appointments detected in cardiology department",
          priority: "high",
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
          recommendation: "Consider adding evening slots to accommodate demand"
        },
        {
          type: "alert",
          title: "Medical Supply Alert",
          description: "Critical medications running low: 5 items below minimum threshold",
          priority: "urgent",
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          recommendation: "Reorder supplies immediately to avoid stockouts"
        },
        {
          type: "insight",
          title: "Optimal Scheduling Opportunity",
          description: "Tuesday mornings show 40% lower appointment rates",
          priority: "medium",
          icon: Lightbulb,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          recommendation: "Schedule routine checkups during this time slot"
        }
      ],
      "Medical Store": [
        {
          type: "trend",
          title: "Seasonal Demand Pattern",
          description: "25% increase in cold medicine sales - flu season approaching",
          priority: "high",
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
          recommendation: "Stock up on flu medications and immune boosters"
        },
        {
          type: "alert",
          title: "Expiry Date Warning",
          description: "12 medicine batches expiring within 30 days",
          priority: "urgent",
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          recommendation: "Implement discount pricing to move inventory quickly"
        },
        {
          type: "insight",
          title: "Customer Loyalty Opportunity",
          description: "Repeat customers make 60% of purchases - loyalty program potential",
          priority: "medium",
          icon: Target,
          color: "text-purple-600",
          bgColor: "bg-purple-50",
          recommendation: "Launch customer loyalty program with health tracking"
        }
      ],
      "Warehouse": [
        {
          type: "trend",
          title: "Inventory Velocity Analysis",
          description: "Fast-moving items identified: Electronics category up 45%",
          priority: "high",
          icon: TrendingUp,
          color: "text-green-600",
          bgColor: "bg-green-50",
          recommendation: "Increase storage allocation for electronics section"
        },
        {
          type: "alert",
          title: "Storage Capacity Warning",
          description: "Warehouse 85% full - approaching maximum capacity",
          priority: "urgent",
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-50",
          recommendation: "Plan for additional storage or optimize current layout"
        },
        {
          type: "insight",
          title: "Pick Path Optimization",
          description: "Current picking routes can be optimized to save 20% time",
          priority: "medium",
          icon: Lightbulb,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          recommendation: "Reorganize item placement based on frequency analysis"
        }
      ]
    };

    return baseInsights[type] || baseInsights["Hospital"];
  };

  const refreshInsights = async () => {
    setIsLoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInsights = generateAIInsights(businessType);
    setInsights(newInsights);
    setIsLoading(false);
    
    toast({
      title: "AI Insights Updated",
      description: "Latest insights generated based on your data patterns.",
    });
  };

  useEffect(() => {
    const initialInsights = generateAIInsights(businessType);
    setInsights(initialInsights);
  }, [businessType]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">AI Insights</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshInsights}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          AI-powered insights and recommendations for your {businessType.toLowerCase()} business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          insights.map((insight, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${insight.bgColor} border-opacity-50`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <insight.icon className={`h-4 w-4 ${insight.color}`} />
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                </div>
                <Badge variant={getPriorityColor(insight.priority)}>
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <p className="text-xs text-gray-500 italic">
                💡 {insight.recommendation}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsights;