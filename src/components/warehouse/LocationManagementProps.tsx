
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Search, Plus, Edit, Trash2, BarChart3 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface LocationManagementProps {
  businessType: string;
}

const LocationManagement = ({ businessType }: LocationManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const sampleLocations = [
    {
      id: "LOC001",
      name: "Zone A - Aisle 1",
      type: "Storage",
      capacity: 500,
      occupied: 350,
      status: "Active",
      temperature: "Room Temperature",
      items: 45,
      lastUpdate: "2024-01-20"
    },
    {
      id: "LOC002",
      name: "Zone A - Aisle 2",
      type: "Storage",
      capacity: 500,
      occupied: 480,
      status: "Nearly Full",
      temperature: "Room Temperature",
      items: 62,
      lastUpdate: "2024-01-20"
    },
    {
      id: "LOC003",
      name: "Cold Storage - Section 1",
      type: "Cold Storage",
      capacity: 200,
      occupied: 120,
      status: "Active",
      temperature: "2-8°C",
      items: 28,
      lastUpdate: "2024-01-19"
    },
    {
      id: "LOC004",
      name: "Loading Dock A",
      type: "Dock",
      capacity: 50,
      occupied: 15,
      status: "Active",
      temperature: "Ambient",
      items: 8,
      lastUpdate: "2024-01-20"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Nearly Full": return "bg-yellow-100 text-yellow-800";
      case "Full": return "bg-red-100 text-red-800";
      case "Maintenance": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getOccupancyPercentage = (occupied: number, capacity: number) => {
    return Math.round((occupied / capacity) * 100);
  };

  const handleSaveLocation = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Location saved",
        description: "The location has been saved successfully",
      });
      setShowAddForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = sampleLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || location.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600">Manage warehouse locations and storage areas</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Location
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="nearly full">Nearly Full</SelectItem>
            <SelectItem value="full">Full</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sampleLocations.length}</div>
            <p className="text-xs text-muted-foreground">
              Active storage areas
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">
              Storage units
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Currently Occupied</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">965</div>
            <p className="text-xs text-muted-foreground">
              77% utilization
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Space</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">285</div>
            <p className="text-xs text-muted-foreground">
              Storage units free
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <CardDescription>ID: {location.id}</CardDescription>
                </div>
                <Badge className={getStatusColor(location.status)}>
                  {location.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Type:</span>
                  <span className="font-medium">{location.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Temperature:</span>
                  <span className="font-medium">{location.temperature}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items Stored:</span>
                  <span className="font-medium">{location.items}</span>
                </div>
              </div>

              {/* Occupancy Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy:</span>
                  <span className="font-medium">
                    {location.occupied}/{location.capacity} ({getOccupancyPercentage(location.occupied, location.capacity)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      getOccupancyPercentage(location.occupied, location.capacity) > 90 
                        ? 'bg-red-500' 
                        : getOccupancyPercentage(location.occupied, location.capacity) > 75 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${getOccupancyPercentage(location.occupied, location.capacity)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Package className="h-3 w-3 mr-1" />
                  View Items
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Location Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Location</CardTitle>
            <CardDescription>Enter details for the new storage location</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input id="locationName" placeholder="Enter location name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationId">Location ID</Label>
                <Input id="locationId" placeholder="Enter location ID" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationType">Location Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="cold-storage">Cold Storage</SelectItem>
                    <SelectItem value="dock">Loading Dock</SelectItem>
                    <SelectItem value="staging">Staging Area</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="Enter capacity" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature Control</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambient">Ambient</SelectItem>
                    <SelectItem value="room-temp">Room Temperature</SelectItem>
                    <SelectItem value="cold">2-8°C (Cold)</SelectItem>
                    <SelectItem value="frozen">-18°C (Frozen)</SelectItem>
                    <SelectItem value="controlled">Climate Controlled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveLocation} disabled={loading}>
                {loading ? "Saving..." : "Save Location"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationManagement;