export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          appointed_to: string | null
          appointment_date: string
          appointment_number: string
          appointment_type: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string | null
          customer_id: string
          diagnosis: string | null
          duration_minutes: number | null
          follow_up_date: string | null
          id: string
          notes: string | null
          prescription: string | null
          status: string | null
          symptoms: string | null
          treatment: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appointed_to?: string | null
          appointment_date: string
          appointment_number: string
          appointment_type?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          customer_id: string
          diagnosis?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          prescription?: string | null
          status?: string | null
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appointed_to?: string | null
          appointment_date?: string
          appointment_number?: string
          appointment_type?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          customer_id?: string
          diagnosis?: string | null
          duration_minutes?: number | null
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          prescription?: string | null
          status?: string | null
          symptoms?: string | null
          treatment?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      business_settings: {
        Row: {
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          city: string | null
          created_at: string | null
          customer_code: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          gender: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          city?: string | null
          created_at?: string | null
          customer_code: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          city?: string | null
          created_at?: string | null
          customer_code?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          gender?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          discount_percentage: number | null
          id: string
          line_total: number
          notes: string | null
          order_id: string
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          line_total: number
          notes?: string | null
          order_id: string
          product_id?: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number | null
          id?: string
          line_total?: number
          notes?: string | null
          order_id?: string
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_to: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string | null
          customer_id: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          notes: string | null
          order_date: string | null
          order_number: string
          order_type: string
          payment_method: string | null
          payment_status: string | null
          priority: string | null
          status: string | null
          subtotal: number | null
          supplier_id: string | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number: string
          order_type: string
          payment_method?: string | null
          payment_status?: string | null
          priority?: string | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          customer_id?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          notes?: string | null
          order_date?: string | null
          order_number?: string
          order_type?: string
          payment_method?: string | null
          payment_status?: string | null
          priority?: string | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          batch_number: string | null
          brand: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          dimensions: string | null
          expiry_date: string | null
          id: string
          location: string | null
          minimum_stock_level: number | null
          name: string
          prescription_required: boolean | null
          product_code: string
          quantity_in_stock: number | null
          status: string | null
          subcategory: string | null
          supplier_id: string | null
          unit_of_measure: string | null
          unit_price: number | null
          updated_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          minimum_stock_level?: number | null
          name: string
          prescription_required?: boolean | null
          product_code: string
          quantity_in_stock?: number | null
          status?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
          unit_price?: number | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          dimensions?: string | null
          expiry_date?: string | null
          id?: string
          location?: string | null
          minimum_stock_level?: number | null
          name?: string
          prescription_required?: boolean | null
          product_code?: string
          quantity_in_stock?: number | null
          status?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          unit_of_measure?: string | null
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_supplier"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          city: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          payment_terms: string | null
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          supplier_code: string
          tax_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          supplier_code: string
          tax_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          city?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          payment_terms?: string | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          supplier_code?: string
          tax_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_type:
        | "Hospital"
        | "Medical Store"
        | "Warehouse"
        | "Retail Store"
        | "Automotive"
        | "General Business"
      user_role: "admin" | "manager" | "employee" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      business_type: [
        "Hospital",
        "Medical Store",
        "Warehouse",
        "Retail Store",
        "Automotive",
        "General Business",
      ],
      user_role: ["admin", "manager", "employee", "user"],
    },
  },
} as const
