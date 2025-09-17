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
      leads: {
        Row: {
          id: string
          company_name: string
          status: string
          lead_source: string
          potential_mrr: number | null
          customization_fee: number | null
          subscription_package: string
          needs_customization: boolean | null
          priority: string | null
          lead_owner: string
          lead_owner_id: string
          assigned_team_id: string | null
          industry: string
          customization_notes: string | null
          client_health: string | null
          onboarding_info: Json | null
          created_by: string | null
          tags: Json | null
          contacts: Json | null
          activity_log: Json | null
          client_tasks: Json | null
          last_activity_at: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_name: string
          status?: string
          lead_source?: string
          potential_mrr?: number | null
          customization_fee?: number | null
          subscription_package?: string
          needs_customization?: boolean | null
          priority?: string | null
          lead_owner: string
          lead_owner_id: string
          assigned_team_id?: string | null
          industry: string
          customization_notes?: string | null
          client_health?: string | null
          onboarding_info?: Json | null
          created_by?: string | null
          tags?: Json | null
          contacts?: Json | null
          activity_log?: Json | null
          client_tasks?: Json | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_name?: string
          status?: string
          lead_source?: string
          potential_mrr?: number | null
          customization_fee?: number | null
          subscription_package?: string
          needs_customization?: boolean | null
          priority?: string | null
          lead_owner?: string
          lead_owner_id?: string
          assigned_team_id?: string | null
          industry?: string
          customization_notes?: string | null
          client_health?: string | null
          onboarding_info?: Json | null
          created_by?: string | null
          tags?: Json | null
          contacts?: Json | null
          activity_log?: Json | null
          client_tasks?: Json | null
          last_activity_at?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          display_name: string | null
          company: string | null
          avatar_url: string | null
          department: string | null
          phone: string | null
          last_login_at: string | null
          role: string
          timezone: string | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          display_name?: string | null
          company?: string | null
          avatar_url?: string | null
          department?: string | null
          phone?: string | null
          last_login_at?: string | null
          role?: string
          timezone?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          display_name?: string | null
          company?: string | null
          avatar_url?: string | null
          department?: string | null
          phone?: string | null
          last_login_at?: string | null
          role?: string
          timezone?: string | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      client_tasks: {
        Row: {
          id: string
          lead_id: string
          task_id: string
          title: string
          description: string | null
          assignee: string
          assignee_id: string
          due_date: string | null
          estimated_hours: number | null
          actual_hours: number | null
          notes: string | null
          created_by: string
          status: string
          priority: string
          category: string
          tags: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          lead_id: string
          task_id: string
          title: string
          description?: string | null
          assignee: string
          assignee_id: string
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          notes?: string | null
          created_by: string
          status?: string
          priority?: string
          category?: string
          tags?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          lead_id?: string
          task_id?: string
          title?: string
          description?: string | null
          assignee?: string
          assignee_id?: string
          due_date?: string | null
          estimated_hours?: number | null
          actual_hours?: number | null
          notes?: string | null
          created_by?: string
          status?: string
          priority?: string
          category?: string
          tags?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
