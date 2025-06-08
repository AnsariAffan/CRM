import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Download, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useProducts, useDeleteMutation, useCreateMutation } from '@/hooks/useSupabaseQuery';
import ProductForm from './ProductForm';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface ProductListProps {
  businessType: BusinessType;
}

const ProductList = ({ businessType }: ProductListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: products, isLoading } = useProducts(businessType);
  const deleteMutation = useDeleteMutation('products', ['products']);
  const createMutation = useCreateMutation('products', ['products']);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleExport = () => {
    if (!products || products.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no products to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Product Code', 'Name', 'Category', 'Stock', 'Unit Price', 'Status', 'Description', 'Brand', 'Location'];
    const csvContent = [
      headers.join(','),
      ...products.map(product => [
        product.product_code,
        `"${product.name}"`,
        product.category || '',
        product.quantity_in_stock || 0,
        product.unit_price || 0,
        product.status || '',
        `"${product.description || ''}"`,
        product.brand || '',
        product.location || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products_${businessType}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export successful",
      description: "Products exported to CSV successfully",
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
          const product = {
            product_code: values[0] || `PROD${Date.now()}${i}`,
            name: values[1]?.replace(/"/g, '') || `Product ${i}`,
            category: values[2] || 'General',
            quantity_in_stock: parseInt(values[3]) || 0,
            unit_price: parseFloat(values[4]) || 0,
            status: values[5] || 'active',
            description: values[6]?.replace(/"/g, '') || '',
            brand: values[7] || '',
            location: values[8] || '',
            business_type: businessType
          };

          await createMutation.mutateAsync(product);
        }

        toast({
          title: "Import successful",
          description: `${lines.length - 1} products imported successfully`,
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import products. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  const getBusinessSpecificColumns = () => {
    switch (businessType) {
      case 'Medical Store':
        return ['Code', 'Name', 'Category', 'Stock', 'Expiry', 'Prescription Required', 'Status', 'Actions'];
      case 'Hospital':
        return ['Code', 'Name', 'Category', 'Stock', 'Location', 'Min Level', 'Status', 'Actions'];
      case 'Warehouse':
        return ['Code', 'Name', 'Category', 'Stock', 'Location', 'Weight', 'Status', 'Actions'];
      default:
        return ['Code', 'Name', 'Category', 'Stock', 'Price', 'Status', 'Actions'];
    }
  };

  if (isLoading) return <div>Loading products...</div>;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {businessType === 'Medical Store' ? 'Medicines' : 
             businessType === 'Hospital' ? 'Medical Supplies' :
             businessType === 'Warehouse' ? 'Inventory Items' : 'Products'}
          </CardTitle>
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
                id="import-products"
              />
              <Button variant="outline" asChild>
                <label htmlFor="import-products" className="cursor-pointer flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </label>
              </Button>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add {businessType === 'Medical Store' ? 'Medicine' : 'Product'}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
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
              {getBusinessSpecificColumns().map((column) => (
                <TableHead key={column} className={column === 'Actions' ? 'text-right' : ''}>
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.product_code}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity_in_stock}</TableCell>
                {businessType === 'Medical Store' && (
                  <>
                    <TableCell>{product.expiry_date}</TableCell>
                    <TableCell>
                      <Badge variant={product.prescription_required ? 'destructive' : 'default'}>
                        {product.prescription_required ? 'Required' : 'Not Required'}
                      </Badge>
                    </TableCell>
                  </>
                )}
                {businessType === 'Hospital' && (
                  <>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>{product.minimum_stock_level}</TableCell>
                  </>
                )}
                {businessType === 'Warehouse' && (
                  <>
                    <TableCell>{product.location}</TableCell>
                    <TableCell>{product.weight}</TableCell>
                  </>
                )}
                {businessType === 'General Business' && (
                  <TableCell>${product.unit_price}</TableCell>
                )}
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No products found. Add your first product to get started.
          </div>
        )}
      </CardContent>

      <ProductForm
        open={showForm}
        onClose={handleCloseForm}
        businessType={businessType}
        product={editingProduct}
      />
    </Card>
  );
};

export default ProductList;