import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useOrders, useDeleteMutation, useCreateMutation } from '@/hooks/useSupabaseQuery';
import OrderForm from './OrderForm';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';


type BusinessType = Database['public']['Enums']['business_type'];

interface OrderListProps {
  businessType: BusinessType;
}

const OrderList = ({ businessType }: OrderListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: orders, isLoading } = useOrders(businessType);
  const deleteMutation = useDeleteMutation('orders', ['orders']);
  const createMutation = useCreateMutation('orders', ['orders']);

  const filteredOrders = orders?.filter(order =>
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (order: any) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this order?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleExport = () => {
    if (!orders || orders.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no orders to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Order Number', 'Customer', 'Type', 'Date', 'Total Amount', 'Status', 'Payment Status'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => [
        order.order_number,
        `"${order.customers?.name || 'N/A'}"`,
        order.order_type,
        order.order_date || '',
        order.total_amount || 0,
        order.status || '',
        order.payment_status || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${businessType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Orders exported to CSV successfully",
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
          const order = {
            order_number: values[0] || `ORD${Date.now()}${i}`,
            order_type: values[2] || 'sale',
            order_date: values[3] || new Date().toISOString().split('T')[0],
            total_amount: parseFloat(values[4]) || 0,
            status: values[5] || 'pending',
            payment_status: values[6] || 'pending',
            business_type: businessType
          };

          await createMutation.mutateAsync(order);
        }

        toast({
          title: "Import successful",
          description: `${lines.length - 1} orders imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import orders. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  const getBusinessSpecificTitle = () => {
    switch (businessType) {
      case 'Medical Store':
        return 'Prescriptions & Sales';
      case 'Hospital':
        return 'Medical Orders';
      case 'Warehouse':
        return 'Inventory Orders';
      case 'Retail Store':
        return 'Sales Orders';
      default:
        return 'Orders';
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{getBusinessSpecificTitle()}</CardTitle>
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
                id="import-orders"
              />
              <Button variant="outline" asChild>
                <label htmlFor="import-orders" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Order
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
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
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.order_number}</TableCell>
                <TableCell>{order.customers?.name || 'N/A'}</TableCell>
                <TableCell>{order.order_type}</TableCell>
                <TableCell>{order.order_date}</TableCell>
                <TableCell>${order.total_amount}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'destructive'}>
                    {order.payment_status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No orders found. Create your first order to get started.
          </div>
        )}
      </CardContent>

      <OrderForm
        open={showForm}
        onClose={handleCloseForm}
        businessType={businessType}
        order={editingOrder}
      />
    </Card>
  );
};

export default OrderList;