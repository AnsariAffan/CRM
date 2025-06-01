import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integration/supabase/client';

// Restrict businessType to specific strings
type BusinessType =
  | 'Hospital'
  | 'Medical Store'
  | 'Warehouse'
  | 'Retail Store'
  | 'Automotive'
  | 'General Business';

// Restrict tableName to your Supabase tables
type TableName =
  | 'customers'
  | 'appointments'
  | 'business_settings'
  | 'inventory_transactions'
  | 'products'
  | 'order_items'
  | 'orders'
  | 'suppliers'
  | 'profiles';

// Queries

export const useCustomers = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['customers', businessType],
    queryFn: async () => {
      let query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (businessType) {
        query = query.eq('business_type', businessType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useProducts = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['products', businessType],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (businessType) {
        query = query.eq('business_type', businessType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useOrders = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['orders', businessType],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          customers (name),
          suppliers (name)
        `)
        .order('created_at', { ascending: false });

      if (businessType) {
        query = query.eq('business_type', businessType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useSuppliers = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['suppliers', businessType],
    queryFn: async () => {
      let query = supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (businessType) {
        query = query.eq('business_type', businessType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useAppointments = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['appointments', businessType],
    queryFn: async () => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          customers (name)
        `)
        .order('appointment_date', { ascending: true });

      if (businessType) {
        query = query.eq('business_type', businessType);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

// Mutations

export const useCreateMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from(tableName).insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: 'Success',
        description: 'Record created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create record',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase.from(tableName).update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: 'Success',
        description: 'Record updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update record',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: 'Success',
        description: 'Record deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete record',
        variant: 'destructive',
      });
    },
  });
};
