import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSuppliers, useDeleteMutation, useCreateMutation } from '@/hooks/useSupabaseQuery';
import SupplierForm from './SupplierForm';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';


type BusinessType = Database['public']['Enums']['business_type'];

interface SupplierListProps {
  businessType: BusinessType;
}

const SupplierList = ({ businessType }: SupplierListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: suppliers, isLoading } = useSuppliers(businessType);
  const deleteMutation = useDeleteMutation('suppliers', ['suppliers']);
  const createMutation = useCreateMutation('suppliers', ['suppliers']);

  const filteredSuppliers = suppliers?.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.supplier_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleExport = () => {
    if (!suppliers || suppliers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no suppliers to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Supplier Code', 'Name', 'Contact Person', 'Email', 'Phone', 'City', 'Status', 'Address'];
    const csvContent = [
      headers.join(','),
      ...suppliers.map(supplier => [
        supplier.supplier_code,
        `"${supplier.name}"`,
        supplier.contact_person || '',
        supplier.email || '',
        supplier.phone || '',
        supplier.city || '',
        supplier.status || '',
        `"${supplier.address || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `suppliers_${businessType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Suppliers exported to CSV successfully",
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const supplier = {
            supplier_code: values[0] || `SUP${Date.now()}${i}`,
            name: values[1]?.replace(/"/g, '') || `Supplier ${i}`,
            contact_person: values[2] || '',
            email: values[3] || '',
            phone: values[4] || '',
            city: values[5] || '',
            status: values[6] || 'active',
            address: values[7]?.replace(/"/g, '') || '',
            business_type: businessType
          };

          await createMutation.mutateAsync(supplier);
        }

        toast({
          title: "Import successful",
          description: `${lines.length - 1} suppliers imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import suppliers. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  if (isLoading) return <div>Loading suppliers...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Suppliers</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="import-suppliers"
              />
              <Button variant="outline" asChild>
                <label htmlFor="import-suppliers" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.supplier_code}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact_person}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.city}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                    {supplier.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suppliers found. Add your first supplier to get started.
          </div>
        )}
      </CardContent>

      <SupplierForm
        open={showForm}
        onClose={handleCloseForm}
        businessType={businessType}
        supplier={editingSupplier}
      />
    </Card>
  );
};

export default SupplierList;
