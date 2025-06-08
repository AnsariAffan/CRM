
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateMutation, useUpdateMutation } from '@/hooks/useSupabaseQuery';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  businessType: BusinessType;
  product?: any;
}

const ProductForm = ({ open, onClose, businessType, product }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    product_code: '',
    name: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    unit_price: '',
    cost_price: '',
    quantity_in_stock: '',
    minimum_stock_level: '',
    unit_of_measure: '',
    location: '',
    barcode: '',
    batch_number: '',
    expiry_date: '',
    weight: '',
    dimensions: '',
    prescription_required: false,
    status: 'active'
  });

  const createMutation = useCreateMutation('products', ['products']);
  const updateMutation = useUpdateMutation('products', ['products']);

  useEffect(() => {
    if (product) {
      setFormData({ ...product, 
        unit_price: product.unit_price?.toString() || '',
        cost_price: product.cost_price?.toString() || '',
        quantity_in_stock: product.quantity_in_stock?.toString() || '',
        minimum_stock_level: product.minimum_stock_level?.toString() || '',
        weight: product.weight?.toString() || ''
      });
    } else {
      setFormData({
        product_code: `PRD-${Date.now()}`,
        name: '',
        description: '',
        category: '',
        subcategory: '',
        brand: '',
        unit_price: '',
        cost_price: '',
        quantity_in_stock: '',
        minimum_stock_level: '',
        unit_of_measure: '',
        location: '',
        barcode: '',
        batch_number: '',
        expiry_date: '',
        weight: '',
        dimensions: '',
        prescription_required: false,
        status: 'active'
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      business_type: businessType,
      unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
      cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
      quantity_in_stock: formData.quantity_in_stock ? parseInt(formData.quantity_in_stock) : null,
      minimum_stock_level: formData.minimum_stock_level ? parseInt(formData.minimum_stock_level) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null
    };

    if (product) {
      await updateMutation.mutateAsync({ id: product.id, data: dataToSubmit });
    } else {
      await createMutation.mutateAsync(dataToSubmit);
    }
    onClose();
  };

  const getTitle = () => {
    switch (businessType) {
      case 'Medical Store':
        return product ? 'Edit Medicine' : 'Add New Medicine';
      case 'Hospital':
        return product ? 'Edit Medical Supply' : 'Add New Medical Supply';
      case 'Warehouse':
        return product ? 'Edit Inventory Item' : 'Add New Inventory Item';
      default:
        return product ? 'Edit Product' : 'Add New Product';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="product_code">Product Code</Label>
              <Input
                id="product_code"
                value={formData.product_code}
                onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit_price">Unit Price</Label>
              <Input
                id="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cost_price">Cost Price</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="quantity_in_stock">Stock Quantity</Label>
              <Input
                id="quantity_in_stock"
                type="number"
                value={formData.quantity_in_stock}
                onChange={(e) => setFormData({ ...formData, quantity_in_stock: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="minimum_stock_level">Min Stock Level</Label>
              <Input
                id="minimum_stock_level"
                type="number"
                value={formData.minimum_stock_level}
                onChange={(e) => setFormData({ ...formData, minimum_stock_level: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="unit_of_measure">Unit of Measure</Label>
              <Input
                id="unit_of_measure"
                value={formData.unit_of_measure}
                onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>
          </div>

          {businessType === 'Medical Store' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batch_number">Batch Number</Label>
                  <Input
                    id="batch_number"
                    value={formData.batch_number}
                    onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescription_required"
                  checked={formData.prescription_required}
                  onCheckedChange={(checked) => setFormData({ ...formData, prescription_required: !!checked })}
                />
                <Label htmlFor="prescription_required">Prescription Required</Label>
              </div>
            </>
          )}

          {businessType === 'Warehouse' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="L x W x H"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;