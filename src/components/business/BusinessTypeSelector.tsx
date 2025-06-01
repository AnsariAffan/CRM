
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Package, 
  Stethoscope, 
  Pill, 
  Warehouse, 
  ShoppingBag,
  Car,
  Briefcase
} from "lucide-react";

interface BusinessTypeSelectorProps {
  onSelect: (businessType: string) => void;
}

const BusinessTypeSelector = ({ onSelect }: BusinessTypeSelectorProps) => {
  const businessTypes = [
    {
      id: "Hospital",
      name: "Hospital & Healthcare",
      description: "Patient management, appointments, medical records",
      icon: Stethoscope,
      color: "border-red-200 hover:border-red-300",
      features: ["Patient Records", "Appointments", "Medical Supplies", "Staff Management"]
    },
    {
      id: "Medical Store",
      name: "Medical Store & Pharmacy",
      description: "Medicine inventory, prescriptions, customer health records",
      icon: Pill,
      color: "border-green-200 hover:border-green-300",
      features: ["Medicine Inventory", "Prescription Tracking", "Customer Health", "Supplier Management"]
    },
    {
      id: "Warehouse",
      name: "Warehouse & Storage",
      description: "Inventory management, location tracking, order fulfillment",
      icon: Warehouse,
      color: "border-blue-200 hover:border-blue-300",
      features: ["Inventory Control", "Location Mapping", "Order Processing", "Asset Tracking"]
    },
    {
      id: "Retail Store",
      name: "Retail & E-commerce",
      description: "Product catalog, sales tracking, customer management",
      icon: ShoppingBag,
      color: "border-purple-200 hover:border-purple-300",
      features: ["Product Catalog", "Sales Analytics", "Customer Loyalty", "Multi-channel Sales"]
    },
    {
      id: "Automotive",
      name: "Automotive Business",
      description: "Vehicle inventory, service records, customer maintenance",
      icon: Car,
      color: "border-orange-200 hover:border-orange-300",
      features: ["Vehicle Inventory", "Service History", "Parts Management", "Customer Service"]
    },
    {
      id: "General Business",
      name: "General Business",
      description: "Customizable CRM for any business type",
      icon: Briefcase,
      color: "border-gray-200 hover:border-gray-300",
      features: ["Custom Fields", "Flexible Workflow", "Generic Templates", "Full Customization"]
    }
  ];

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Business Type
        </h2>
        <p className="text-gray-600">
          Select the option that best describes your business to get started with customized features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {businessTypes.map((business) => (
          <Card 
            key={business.id} 
            className={`cursor-pointer transition-all duration-200 ${business.color} hover:shadow-lg`}
            onClick={() => onSelect(business.id)}
          >
            <CardHeader className="text-center pb-2">
              <business.icon className="h-12 w-12 mx-auto mb-3 text-gray-700" />
              <CardTitle className="text-lg">{business.name}</CardTitle>
              <CardDescription className="text-sm">
                {business.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {business.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
              <Button className="w-full" variant="outline">
                Select {business.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BusinessTypeSelector;
