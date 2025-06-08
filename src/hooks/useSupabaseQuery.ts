
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/integration/supabase/types';
import { supabase } from '@/integration/supabase/client';
// import type { Database } from '@/integrations/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];
type TableName = keyof Database['public']['Tables'];

export const useCustomers = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['customers', businessType],
    queryFn: async () => {
      console.log('Fetching customers for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching customers:', error);
        throw error;
      }
      console.log('Customers data:', data);
      return data;
    },
  });
};

export const useProducts = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['products', businessType],
    queryFn: async () => {
      console.log('Fetching products for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      console.log('Products data:', data);
      return data;
    },
  });
};

export const useOrders = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['orders', businessType],
    queryFn: async () => {
      console.log('Fetching orders for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('orders')
        .select(`
          *,
          customers (name),
          suppliers (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      console.log('Orders data:', data);
      return data;
    },
  });
};

export const useSuppliers = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['suppliers', businessType],
    queryFn: async () => {
      console.log('Fetching suppliers for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching suppliers:', error);
        throw error;
      }
      console.log('Suppliers data:', data);
      return data;
    },
  });
};

export const useAppointments = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['appointments', businessType],
    queryFn: async () => {
      console.log('Fetching appointments for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('appointments')
        .select(`
          *,
          customers (name)
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching appointments:', error);
        throw error;
      }
      console.log('Appointments data:', data);
      return data;
    },
  });
};

export const useMedicalRecords = (businessType?: BusinessType) => {
  return useQuery({
    queryKey: ['medical_records', businessType],
    queryFn: async () => {
      console.log('Fetching medical records for business type:', businessType);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let query = supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (businessType) {
        query = query.eq('business_type', businessType);
      }
      
      const { data, error } = await query;
      if (error) {
        console.error('Error fetching medical records:', error);
        throw error;
      }
      console.log('Medical records data:', data);
      return data;
    },
  });
};

export const useSystemLogs = () => {
  return useQuery({
    queryKey: ['system_logs'],
    queryFn: async () => {
      console.log('Fetching system logs');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error('Error fetching system logs:', error);
        throw error;
      }
      console.log('System logs data:', data);
      return data;
    },
  });
};

export const useLoginHistory = () => {
  return useQuery({
    queryKey: ['login_history'],
    queryFn: async () => {
      console.log('Fetching login history');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', user.id)
        .order('login_time', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Error fetching login history:', error);
        throw error;
      }
      console.log('Login history data:', data);
      return data;
    },
  });
};

export const useCreateMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      console.log(`Creating ${tableName} with data:`, data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const dataWithUser = { ...data, user_id: user.id };
      
      const { error } = await supabase.from(tableName as any).insert(dataWithUser);
      if (error) {
        console.error(`Error creating ${tableName}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: "Success",
        description: "Record created successfully",
      });
    },
    onError: (error: any) => {
      console.error(`Mutation error for ${tableName}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to create record",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log(`Updating ${tableName} with id ${id} and data:`, data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from(tableName as any)
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error(`Error updating ${tableName}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: "Success",
        description: "Record updated successfully",
      });
    },
    onError: (error: any) => {
      console.error(`Update mutation error for ${tableName}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to update record",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteMutation = (tableName: TableName, invalidateKeys: string[]) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log(`Deleting ${tableName} with id:`, id);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      invalidateKeys.forEach(key => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error(`Delete mutation error for ${tableName}:`, error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete record",
        variant: "destructive",
      });
    },
  });
};
