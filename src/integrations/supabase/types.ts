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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          display_order: number | null
          id: string
          question: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          question: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          question?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          notes: string | null
          referral_source: string | null
          services: string[] | null
          status: Database["public"]["Enums"]["lead_status"]
          timeline: string | null
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          notes?: string | null
          referral_source?: string | null
          services?: string[] | null
          status?: Database["public"]["Enums"]["lead_status"]
          timeline?: string | null
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          notes?: string | null
          referral_source?: string | null
          services?: string[] | null
          status?: Database["public"]["Enums"]["lead_status"]
          timeline?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pricing_packages: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          features: string[] | null
          highlighted: boolean | null
          id: string
          name: string
          price: string | null
          price_suffix: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlighted?: boolean | null
          id?: string
          name: string
          price?: string | null
          price_suffix?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: string[] | null
          highlighted?: boolean | null
          id?: string
          name?: string
          price?: string | null
          price_suffix?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          description: string | null
          display_order: number | null
          featured: boolean | null
          id: string
          image_url: string | null
          slug: string | null
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          client_name: string
          company: string | null
          content: string
          created_at: string
          display_order: number | null
          featured: boolean | null
          id: string
          rating: number | null
          role: string | null
          status: Database["public"]["Enums"]["content_status"]
        }
        Insert: {
          avatar_url?: string | null
          client_name: string
          company?: string | null
          content: string
          created_at?: string
          display_order?: number | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          role?: string | null
          status?: Database["public"]["Enums"]["content_status"]
        }
        Update: {
          avatar_url?: string | null
          client_name?: string
          company?: string | null
          content?: string
          created_at?: string
          display_order?: number | null
          featured?: boolean | null
          id?: string
          rating?: number | null
          role?: string | null
          status?: Database["public"]["Enums"]["content_status"]
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
      app_role: "admin" | "user"
      content_status: "draft" | "published"
      lead_status: "new" | "read" | "contacted" | "converted" | "closed"
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
      app_role: ["admin", "user"],
      content_status: ["draft", "published"],
      lead_status: ["new", "read", "contacted", "converted", "closed"],
    },
  },
} as const
