
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateMutation, useUpdateMutation } from '@/hooks/useSupabaseQuery';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface OrderFormProps {
  open: boolean;
  onClose: () => void;
  businessType: BusinessType;
  order?: any;
}

const OrderForm = ({ open, onClose, businessType, order }: OrderFormProps) => {
  const [formData, setFormData] = useState({
    order_number: '',
    order_type: '',
    order_date: '',
    due_date: '',
    customer_id: '',
    supplier_id: '',
    subtotal: '',
    tax_amount: '',
    discount_amount: '',
    total_amount: '',
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: '',
    assigned_to: '',
    priority: 'medium',
    notes: ''
  });

  const createMutation = useCreateMutation('orders', ['orders']);
  const updateMutation = useUpdateMutation('orders', ['orders']);

  useEffect(() => {
    if (order) {
      setFormData({ 
        ...order,
        subtotal: order.subtotal?.toString() || '',
        tax_amount: order.tax_amount?.toString() || '',
        discount_amount: order.discount_amount?.toString() || '',
        total_amount: order.total_amount?.toString() || ''
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        order_number: `ORD-${Date.now()}`,
        order_type: getDefaultOrderType(),
        order_date: today,
        due_date: '',
        customer_id: '',
        supplier_id: '',
        subtotal: '',
        tax_amount: '',
        discount_amount: '',
        total_amount: '',
        status: 'pending',
        payment_status: 'unpaid',
        payment_method: '',
        assigned_to: '',
        priority: 'medium',
        notes: ''
      });
    }
  }, [order, open, businessType]);

  const getDefaultOrderType = () => {
    switch (businessType) {
      case 'Medical Store':
        return 'prescription';
      case 'Hospital':
        return 'medical_supply';
      case 'Warehouse':
        return 'inventory';
      case 'Retail Store':
        return 'sales';
      default:
        return 'general';
    }
  };

  const getOrderTypes = () => {
    switch (businessType) {
      case 'Medical Store':
        return [
          { value: 'prescription', label: 'Prescription' },
          { value: 'otc_sale', label: 'OTC Sale' },
          { value: 'bulk_order', label: 'Bulk Order' }
        ];
      case 'Hospital':
        return [
          { value: 'medical_supply', label: 'Medical Supply' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'pharmacy', label: 'Pharmacy' }
        ];
      case 'Warehouse':
        return [
          { value: 'inventory', label: 'Inventory' },
          { value: 'transfer', label: 'Transfer' },
          { value: 'return', label: 'Return' }
        ];
      default:
        return [
          { value: 'sales', label: 'Sales' },
          { value: 'purchase', label: 'Purchase' },
          { value: 'return', label: 'Return' }
        ];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      business_type: businessType,
      subtotal: formData.subtotal ? parseFloat(formData.subtotal) : null,
      tax_amount: formData.tax_amount ? parseFloat(formData.tax_amount) : null,
      discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
      total_amount: formData.total_amount ? parseFloat(formData.total_amount) : null,
      customer_id: formData.customer_id || null,
      supplier_id: formData.supplier_id || null
    };

    if (order) {
      await updateMutation.mutateAsync({ id: order.id, data: dataToSubmit });
    } else {
      await createMutation.mutateAsync(dataToSubmit);
    }
    onClose();
  };

  const getTitle = () => {
    switch (businessType) {
      case 'Medical Store':
        return order ? 'Edit Prescription/Sale' : 'Add New Prescription/Sale';
      case 'Hospital':
        return order ? 'Edit Medical Order' : 'Add New Medical Order';
      case 'Warehouse':
        return order ? 'Edit Inventory Order' : 'Add New Inventory Order';
      default:
        return order ? 'Edit Order' : 'Add New Order';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_number">Order Number</Label>
              <Input
                id="order_number"
                value={formData.order_number}
                onChange={(e) => setFormData({ ...formData, order_number: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="order_type">Order Type</Label>
              <Select value={formData.order_type} onValueChange={(value) => setFormData({ ...formData, order_type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  {getOrderTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order_date">Order Date</Label>
              <Input
                id="order_date"
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                value={formData.subtotal}
                onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tax_amount">Tax Amount</Label>
              <Input
                id="tax_amount"
                type="number"
                step="0.01"
                value={formData.tax_amount}
                onChange={(e) => setFormData({ ...formData, tax_amount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount_amount">Discount Amount</Label>
              <Input
                id="discount_amount"
                type="number"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => setFormData({ ...formData, discount_amount: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount</Label>
              <Input
                id="total_amount"
                type="number"
                step="0.01"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment_status">Payment Status</Label>
              <Select value={formData.payment_status} onValueChange={(value) => setFormData({ ...formData, payment_status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select value={formData.payment_method} onValueChange={(value) => setFormData({ ...formData, payment_method: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="assigned_to">Assigned To</Label>
            <Input
              id="assigned_to"
              value={formData.assigned_to}
              onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {order ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;