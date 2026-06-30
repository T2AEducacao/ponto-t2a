export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clock_records: {
        Row: {
          accuracy_meters: number | null
          approximate_address: string | null
          browser: string | null
          created_at: string
          device: string | null
          employee_id: string
          event_type: Database["public"]["Enums"]["clock_event_type"]
          id: string
          ip_address: unknown
          latitude: number | null
          location_status: Database["public"]["Enums"]["location_status"]
          longitude: number | null
          notes: string | null
          operating_system: string | null
          recorded_at: string
          user_id: string
          work_site_id: string | null
        }
        Insert: {
          accuracy_meters?: number | null
          approximate_address?: string | null
          browser?: string | null
          created_at?: string
          device?: string | null
          employee_id: string
          event_type: Database["public"]["Enums"]["clock_event_type"]
          id?: string
          ip_address?: unknown
          latitude?: number | null
          location_status?: Database["public"]["Enums"]["location_status"]
          longitude?: number | null
          notes?: string | null
          operating_system?: string | null
          recorded_at?: string
          user_id: string
          work_site_id?: string | null
        }
        Update: {
          accuracy_meters?: number | null
          approximate_address?: string | null
          browser?: string | null
          created_at?: string
          device?: string | null
          employee_id?: string
          event_type?: Database["public"]["Enums"]["clock_event_type"]
          id?: string
          ip_address?: unknown
          latitude?: number | null
          location_status?: Database["public"]["Enums"]["location_status"]
          longitude?: number | null
          notes?: string | null
          operating_system?: string | null
          recorded_at?: string
          user_id?: string
          work_site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clock_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clock_records_work_site_id_fkey"
            columns: ["work_site_id"]
            isOneToOne: false
            referencedRelation: "work_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string
          email: string
          full_name: string
          hire_date: string | null
          id: string
          notes: string | null
          position: string
          status: Database["public"]["Enums"]["employee_status"]
          updated_at: string
          user_id: string | null
          work_site_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          hire_date?: string | null
          id?: string
          notes?: string | null
          position: string
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id?: string | null
          work_site_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          hire_date?: string | null
          id?: string
          notes?: string | null
          position?: string
          status?: Database["public"]["Enums"]["employee_status"]
          updated_at?: string
          user_id?: string | null
          work_site_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_work_site_id_fkey"
            columns: ["work_site_id"]
            isOneToOne: false
            referencedRelation: "work_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          must_change_password: boolean
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          must_change_password?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          must_change_password?: boolean
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      work_sites: {
        Row: {
          active: boolean
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          radius_meters: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          radius_meters: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          radius_meters?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "employee"
      clock_event_type: "entry" | "lunch_start" | "lunch_end" | "exit"
      employee_status: "active" | "inactive"
      location_status: "inside" | "outside" | "unavailable"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "employee"],
      clock_event_type: ["entry", "lunch_start", "lunch_end", "exit"],
      employee_status: ["active", "inactive"],
      location_status: ["inside", "outside", "unavailable"],
    },
  },
} as const
