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
      ai_config: {
        Row: {
          custom_prompts: Json
          id: string
          preferred_languages: string[] | null
          tone: string | null
          user_id: string
        }
        Insert: {
          custom_prompts?: Json
          id?: string
          preferred_languages?: string[] | null
          tone?: string | null
          user_id: string
        }
        Update: {
          custom_prompts?: Json
          id?: string
          preferred_languages?: string[] | null
          tone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_config_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      connections: {
        Row: {
          created_at: string | null
          id: string
          provider: string
          provider_username: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          provider: string
          provider_username: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          provider?: string
          provider_username?: string
          user_id?: string | null
        }
        Relationships: []
      }
      cv_data: {
        Row: {
          created_at: string
          cv_data: Json
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cv_data?: Json
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cv_data?: Json
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pdf_exports: {
        Row: {
          created_at: string | null
          id: string
          pdf_url: string
          portfolio_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          pdf_url: string
          portfolio_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pdf_url?: string
          portfolio_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pdf_exports_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pdf_exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_analytics: {
        Row: {
          last_accessed: string | null
          popular_sections: string[] | null
          portfolio_id: string
          unique_visitors: number | null
          views: number | null
        }
        Insert: {
          last_accessed?: string | null
          popular_sections?: string[] | null
          portfolio_id: string
          unique_visitors?: number | null
          views?: number | null
        }
        Update: {
          last_accessed?: string | null
          popular_sections?: string[] | null
          portfolio_id?: string
          unique_visitors?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_analytics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: true
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_templates: {
        Row: {
          id: string
          name: string
          preview_image: string | null
          structure: Json
          template_type: Database["public"]["Enums"]["template_type"]
        }
        Insert: {
          id?: string
          name: string
          preview_image?: string | null
          structure: Json
          template_type: Database["public"]["Enums"]["template_type"]
        }
        Update: {
          id?: string
          name?: string
          preview_image?: string | null
          structure?: Json
          template_type?: Database["public"]["Enums"]["template_type"]
        }
        Relationships: []
      }
      portfolio_versions: {
        Row: {
          content_snapshot: Json
          created_at: string | null
          id: string
          portfolio_id: string
          version_notes: string | null
        }
        Insert: {
          content_snapshot: Json
          created_at?: string | null
          id?: string
          portfolio_id: string
          version_notes?: string | null
        }
        Update: {
          content_snapshot?: Json
          created_at?: string | null
          id?: string
          portfolio_id?: string
          version_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_versions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          ai_model: Database["public"]["Enums"]["ai_model"]
          created_at: string | null
          cv_data_id: string | null
          edited_content: Json | null
          generated_content: Json
          id: string
          status: Database["public"]["Enums"]["content_status"] | null
          template_id: string | null
          updated_at: string | null
          user_id: string
          version: number | null
        }
        Insert: {
          ai_model: Database["public"]["Enums"]["ai_model"]
          created_at?: string | null
          cv_data_id?: string | null
          edited_content?: Json | null
          generated_content: Json
          id?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
          version?: number | null
        }
        Update: {
          ai_model?: Database["public"]["Enums"]["ai_model"]
          created_at?: string | null
          cv_data_id?: string | null
          edited_content?: Json | null
          generated_content?: Json
          id?: string
          status?: Database["public"]["Enums"]["content_status"] | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_cv_data_id_fkey"
            columns: ["cv_data_id"]
            isOneToOne: false
            referencedRelation: "cv_data"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "portfolio_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_enabled: boolean | null
          avatar_url: string | null
          bio: string | null
          connected_providers: string[] | null
          created_at: string | null
          default_template_id: string | null
          email: string | null
          github_data: Json | null
          github_url: string | null
          id: string
          linkedin_data: Json | null
          linkedin_url: string | null
          portfolio_slug: string | null
          username: string
        }
        Insert: {
          ai_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          connected_providers?: string[] | null
          created_at?: string | null
          default_template_id?: string | null
          email?: string | null
          github_data?: Json | null
          github_url?: string | null
          id?: string
          linkedin_data?: Json | null
          linkedin_url?: string | null
          portfolio_slug?: string | null
          username: string
        }
        Update: {
          ai_enabled?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          connected_providers?: string[] | null
          created_at?: string | null
          default_template_id?: string | null
          email?: string | null
          github_data?: Json | null
          github_url?: string | null
          id?: string
          linkedin_data?: Json | null
          linkedin_url?: string | null
          portfolio_slug?: string | null
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_default_template_id_fkey"
            columns: ["default_template_id"]
            isOneToOne: false
            referencedRelation: "portfolio_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          ai_generated: boolean | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          featured: boolean | null
          id: string
          repo_url: string | null
          showcase_order: number | null
          tech_stack: string[] | null
          title: string
          user_id: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          repo_url?: string | null
          showcase_order?: number | null
          tech_stack?: string[] | null
          title: string
          user_id?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          repo_url?: string | null
          showcase_order?: number | null
          tech_stack?: string[] | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_validation: {
        Row: {
          http_status: number | null
          last_checked: string | null
          status: Database["public"]["Enums"]["validation_status"] | null
          url: string
        }
        Insert: {
          http_status?: number | null
          last_checked?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          url: string
        }
        Update: {
          http_status?: number | null
          last_checked?: string | null
          status?: Database["public"]["Enums"]["validation_status"] | null
          url?: string
        }
        Relationships: []
      }
      themes: {
        Row: {
          dark_mode: boolean | null
          font_family: string | null
          id: string
          primary_color: string | null
          secondary_color: string | null
          user_id: string | null
        }
        Insert: {
          dark_mode?: boolean | null
          font_family?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          user_id?: string | null
        }
        Update: {
          dark_mode?: boolean | null
          font_family?: string | null
          id?: string
          primary_color?: string | null
          secondary_color?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "themes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_model: "gpt-4-turbo" | "claude-3-opus" | "gemini-pro"
      content_status: "draft" | "published" | "archived"
      template_type: "minimalist" | "modern" | "classic" | "custom"
      validation_status: "valid" | "broken" | "unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
