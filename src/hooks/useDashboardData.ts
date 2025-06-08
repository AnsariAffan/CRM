
import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/integration/supabase/types';
import { supabase } from '@/integration/supabase/client';
// import type { Database } from '@/integrations/supabase/types';

type BusinessType = Database['public']['Enums']['business_type'];

interface DashboardData {
  customers: any[];
  products: any[];
  orders: any[];
  appointments: any[];
  suppliers: any[];
  stats: {
    totalCustomers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyGrowth: number;
  };
  chartData: any[];
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (businessType: BusinessType): DashboardData => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    customers: [],
    products: [],
    orders: [],
    appointments: [],
    suppliers: [],
    stats: {
      totalCustomers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      monthlyGrowth: 0
    },
    chartData: [],
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        setData(prev => ({ ...prev, loading: true, error: null }));

        // Fetch customers
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', user.id)
          .eq('business_type', businessType);

        if (customersError) throw customersError;

        // Fetch products
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .eq('business_type', businessType);

        if (productsError) throw productsError;

        // Fetch orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', user.id)
          .eq('business_type', businessType);

        if (ordersError) throw ordersError;

        // Fetch appointments
        const { data: appointments, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.id)
          .eq('business_type', businessType);

        if (appointmentsError) throw appointmentsError;

        // Fetch suppliers
        const { data: suppliers, error: suppliersError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('user_id', user.id)
          .eq('business_type', businessType);

        if (suppliersError) throw suppliersError;

        // Calculate stats
        const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
        const monthlyGrowth = Math.floor(Math.random() * 20) + 5; // Simulated growth

        // Generate chart data based on actual data
        const chartData = generateChartData(orders || [], appointments || []);

        setData({
          customers: customers || [],
          products: products || [],
          orders: orders || [],
          appointments: appointments || [],
          suppliers: suppliers || [],
          stats: {
            totalCustomers: customers?.length || 0,
            totalProducts: products?.length || 0,
            totalOrders: orders?.length || 0,
            totalRevenue,
            monthlyGrowth
          },
          chartData,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch data'
        }));
      }
    };

    fetchData();
  }, [user, businessType]);

  return data;
};

const generateChartData = (orders: any[], appointments: any[]) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, index) => {
    // Calculate actual data for each month if available
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate.getMonth() === (currentMonth - (5 - index)) % 12;
    });
    
    const monthAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.created_at);
      return appointmentDate.getMonth() === (currentMonth - (5 - index)) % 12;
    });

    return {
      month,
      orders: monthOrders.length,
      appointments: monthAppointments.length,
      revenue: monthOrders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0),
      value1: monthOrders.length * 100 + Math.floor(Math.random() * 500),
      value2: monthAppointments.length * 80 + Math.floor(Math.random() * 400)
    };
  });
};
