import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCustomers, useDeleteMutation, useCreateMutation } from '@/hooks/useSupabaseQuery';
import CustomerForm from './CustomerForm';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface CustomerListProps {
  businessType: BusinessType;
}

const CustomerList = ({ businessType }: CustomerListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: customers, isLoading } = useCustomers(businessType);
  const deleteMutation = useDeleteMutation('customers', ['customers']);
  const createMutation = useCreateMutation('customers', ['customers']);

  const filteredCustomers = customers?.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.customer_code.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleExport = () => {
    if (!customers || customers.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no customers to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Customer Code', 'Name', 'Email', 'Phone', 'City', 'Status', 'Address', 'Date of Birth', 'Gender'];
    const csvContent = [
      headers.join(','),
      ...customers.map(customer => [
        customer.customer_code,
        `"${customer.name}"`,
        customer.email || '',
        customer.phone || '',
        customer.city || '',
        customer.status || '',
        `"${customer.address || ''}"`,
        customer.date_of_birth || '',
        customer.gender || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${businessType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Customers exported to CSV successfully",
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
        const headers = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',');
          const customer = {
            customer_code: values[0] || `CUST${Date.now()}${i}`,
            name: values[1]?.replace(/"/g, '') || `Customer ${i}`,
            email: values[2] || '',
            phone: values[3] || '',
            city: values[4] || '',
            status: values[5] || 'active',
            address: values[6]?.replace(/"/g, '') || '',
            date_of_birth: values[7] || '',
            gender: values[8] || '',
            business_type: businessType
          };

          await createMutation.mutateAsync(customer);
        }

        toast({
          title: "Import successful",
          description: `${lines.length - 1} customers imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import customers. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  if (isLoading) return <div>Loading customers...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Customers</CardTitle>
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
                id="import-customers"
              />
              <Button variant="outline" asChild>
                <label htmlFor="import-customers" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search customers..."
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
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.customer_code}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(customer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No customers found. Add your first customer to get started.
          </div>
        )}
      </CardContent>

      <CustomerForm
        open={showForm}
        onClose={handleCloseForm}
        businessType={businessType}
        customer={editingCustomer}
      />
    </Card>
  );
};

export default CustomerList;