// Hand-written to match supabase/migrations/0001_init.sql.
// If the schema changes, update this file to match.

export type UserRole = "owner" | "employee";
export type VehicleType = "car" | "motorcycle";
export type BookingStatus =
  | "pending"
  | "arrived"
  | "in_service"
  | "completed"
  | "cancelled";
export type OrderStatus =
  | "waiting"
  | "washing"
  | "cleaning"
  | "ready"
  | "completed"
  | "cancelled";
export type ExpenseCategory =
  | "supplies"
  | "salaries"
  | "utilities"
  | "maintenance"
  | "rent"
  | "other";
export type NotificationType =
  | "booking_confirmation"
  | "booking_reminder"
  | "order_ready";
export type NotificationStatus = "pending" | "sent" | "failed" | "skipped";

// Supabase's typed client requires every table to carry a `Relationships`
// array (even when empty) or its query builder falls back to `never`.
interface Table<Row, Insert, Update = Partial<Insert>> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          full_name: string;
          role: UserRole;
          phone: string | null;
          is_active: boolean;
          created_at: string;
        },
        {
          id: string;
          full_name: string;
          role?: UserRole;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
        }
      >;
      customers: Table<
        {
          id: string;
          name: string;
          phone: string;
          created_at: string;
        },
        {
          id?: string;
          name: string;
          phone: string;
          created_at?: string;
        }
      >;
      services: Table<
        {
          id: string;
          name: string;
          description: string | null;
          car_price: number;
          motorcycle_price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          id?: string;
          name: string;
          description?: string | null;
          car_price: number;
          motorcycle_price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        }
      >;
      settings: Table<
        {
          id: number;
          business_name: string;
          whatsapp_number: string | null;
          phone: string | null;
          address: string | null;
          currency: string;
          invoice_footer_text: string | null;
          updated_at: string;
        },
        {
          id?: number;
          business_name?: string;
          whatsapp_number?: string | null;
          phone?: string | null;
          address?: string | null;
          currency?: string;
          invoice_footer_text?: string | null;
          updated_at?: string;
        }
      >;
      bookings: Table<
        {
          id: string;
          customer_id: string;
          service_id: string;
          vehicle_type: VehicleType;
          booking_date: string;
          booking_time: string;
          status: BookingStatus;
          order_id: string | null;
          created_at: string;
        },
        {
          id?: string;
          customer_id: string;
          service_id: string;
          vehicle_type: VehicleType;
          booking_date: string;
          booking_time: string;
          status?: BookingStatus;
          order_id?: string | null;
          created_at?: string;
        }
      >;
      orders: Table<
        {
          id: string;
          order_number: number;
          customer_id: string;
          booking_id: string | null;
          service_id: string;
          service_name: string;
          vehicle_type: VehicleType;
          price: number;
          status: OrderStatus;
          created_by: string | null;
          created_at: string;
          completed_at: string | null;
        },
        {
          id?: string;
          customer_id: string;
          booking_id?: string | null;
          service_id: string;
          service_name: string;
          vehicle_type: VehicleType;
          price: number;
          status?: OrderStatus;
          created_by?: string | null;
          created_at?: string;
          completed_at?: string | null;
        }
      >;
      invoices: Table<
        {
          id: string;
          invoice_number: number;
          order_id: string;
          customer_id: string;
          service_name: string;
          vehicle_type: VehicleType;
          price: number;
          payment_method: string;
          created_at: string;
        },
        {
          id?: string;
          order_id: string;
          customer_id: string;
          service_name: string;
          vehicle_type: VehicleType;
          price: number;
          payment_method?: string;
          created_at?: string;
        }
      >;
      payments: Table<
        {
          id: string;
          invoice_id: string;
          amount: number;
          method: string;
          created_at: string;
        },
        {
          id?: string;
          invoice_id: string;
          amount: number;
          method?: string;
          created_at?: string;
        }
      >;
      expenses: Table<
        {
          id: string;
          description: string;
          amount: number;
          category: ExpenseCategory;
          expense_date: string;
          created_by: string | null;
          created_at: string;
        },
        {
          id?: string;
          description: string;
          amount: number;
          category?: ExpenseCategory;
          expense_date?: string;
          created_by?: string | null;
          created_at?: string;
        }
      >;
      notifications: Table<
        {
          id: string;
          type: NotificationType;
          channel: string;
          recipient_phone: string;
          booking_id: string | null;
          order_id: string | null;
          status: NotificationStatus;
          payload: Record<string, unknown>;
          error: string | null;
          created_at: string;
          sent_at: string | null;
        },
        {
          id?: string;
          type: NotificationType;
          channel?: string;
          recipient_phone: string;
          booking_id?: string | null;
          order_id?: string | null;
          status?: NotificationStatus;
          payload?: Record<string, unknown>;
          error?: string | null;
          created_at?: string;
          sent_at?: string | null;
        }
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
