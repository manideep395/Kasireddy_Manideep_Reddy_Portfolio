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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          content: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      certifications: {
        Row: {
          created_at: string
          credential_url: string | null
          display_order: number | null
          id: string
          image_url: string | null
          issue_date: string | null
          issuer: string
          title: string
        }
        Insert: {
          created_at?: string
          credential_url?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer: string
          title: string
        }
        Update: {
          created_at?: string
          credential_url?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuer?: string
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          company: string
          created_at: string
          description: string | null
          display_order: number | null
          duration: string
          id: string
          role: string
          technologies: string[] | null
          updated_at: string
        }
        Insert: {
          company: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration: string
          id?: string
          role: string
          technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          company?: string
          created_at?: string
          description?: string | null
          display_order?: number | null
          duration?: string
          id?: string
          role?: string
          technologies?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          demo_url: string | null
          description: string | null
          display_order: number | null
          github_url: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_from_github: boolean | null
          language: string
          long_description: string | null
          name: string
          stars: number | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_from_github?: boolean | null
          language?: string
          long_description?: string | null
          name: string
          stars?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          demo_url?: string | null
          description?: string | null
          display_order?: number | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_from_github?: boolean | null
          language?: string
          long_description?: string | null
          name?: string
          stars?: number | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          display_order: number | null
          id: string
          level: number
          name: string
        }
        Insert: {
          category: string
          display_order?: number | null
          id?: string
          level?: number
          name: string
        }
        Update: {
          category?: string
          display_order?: number | null
          id?: string
          level?: number
          name?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
