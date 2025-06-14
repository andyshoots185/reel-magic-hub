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
      bookings: {
        Row: {
          adults: number
          check_in_date: string
          check_out_date: string
          children: number
          created_at: string
          email: string
          id: string
          name: string
          payment_id: string | null
          phone: string
          room_type: string | null
          status: string
          total_amount: number | null
          user_id: string | null
        }
        Insert: {
          adults: number
          check_in_date: string
          check_out_date: string
          children: number
          created_at?: string
          email: string
          id?: string
          name: string
          payment_id?: string | null
          phone: string
          room_type?: string | null
          status?: string
          total_amount?: number | null
          user_id?: string | null
        }
        Update: {
          adults?: number
          check_in_date?: string
          check_out_date?: string
          children?: number
          created_at?: string
          email?: string
          id?: string
          name?: string
          payment_id?: string | null
          phone?: string
          room_type?: string | null
          status?: string
          total_amount?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_participants: {
        Row: {
          chat_id: string | null
          id: string
          is_admin: boolean | null
          joined_at: string | null
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          id?: string
          is_admin?: boolean | null
          joined_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_participants_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_group: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_group?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chats_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      download_queue: {
        Row: {
          completed_at: string | null
          created_at: string | null
          download_url: string | null
          file_size: number | null
          id: string
          movie_id: number
          quality: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          download_url?: string | null
          file_size?: number | null
          id?: string
          movie_id: number
          quality?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          download_url?: string | null
          file_size?: number | null
          id?: string
          movie_id?: number
          quality?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_reads: {
        Row: {
          id: string
          message_id: string | null
          read_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          read_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string | null
          content: string | null
          created_at: string | null
          disappear_at: string | null
          id: string
          is_forwarded: boolean | null
          media_url: string | null
          message_type: string | null
          sender_id: string | null
          updated_at: string | null
        }
        Insert: {
          chat_id?: string | null
          content?: string | null
          created_at?: string | null
          disappear_at?: string | null
          id?: string
          is_forwarded?: boolean | null
          media_url?: string | null
          message_type?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Update: {
          chat_id?: string | null
          content?: string | null
          created_at?: string | null
          disappear_at?: string | null
          id?: string
          is_forwarded?: boolean | null
          media_url?: string | null
          message_type?: string | null
          sender_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      movie: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      movie_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          movie_id: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          movie_id: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          movie_id?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      movie_likes: {
        Row: {
          created_at: string | null
          id: string
          is_liked: boolean
          movie_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_liked: boolean
          movie_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_liked?: boolean
          movie_id?: number
          user_id?: string
        }
        Relationships: []
      }
      movie_shares: {
        Row: {
          created_at: string | null
          id: string
          movie_id: number
          share_message: string | null
          shared_with_email: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          movie_id: number
          share_message?: string | null
          shared_with_email?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          movie_id?: number
          share_message?: string | null
          shared_with_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      movies: {
        Row: {
          backdrop_path: string | null
          category: string
          created_at: string | null
          genre_ids: Json | null
          id: number
          overview: string | null
          popularity: number | null
          poster_path: string | null
          release_date: string | null
          title: string
          vote_average: number | null
          vote_count: number | null
        }
        Insert: {
          backdrop_path?: string | null
          category: string
          created_at?: string | null
          genre_ids?: Json | null
          id: number
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_date?: string | null
          title: string
          vote_average?: number | null
          vote_count?: number | null
        }
        Update: {
          backdrop_path?: string | null
          category?: string
          created_at?: string | null
          genre_ids?: Json | null
          id?: number
          overview?: string | null
          popularity?: number | null
          poster_path?: string | null
          release_date?: string | null
          title?: string
          vote_average?: number | null
          vote_count?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          created_at: string
          id: string
          rating: number
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          amount_paid: number | null
          created_at: string
          currency: string | null
          email: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_start: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          email: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          created_at?: string
          currency?: string | null
          email?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_start?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          auto_play_next: boolean | null
          created_at: string | null
          default_quality: string | null
          default_subtitle_language: string | null
          id: string
          parental_controls: Json | null
          preferred_genres: Json | null
          preferred_languages: string[] | null
          subtitles_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_play_next?: boolean | null
          created_at?: string | null
          default_quality?: string | null
          default_subtitle_language?: string | null
          id?: string
          parental_controls?: Json | null
          preferred_genres?: Json | null
          preferred_languages?: string[] | null
          subtitles_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_play_next?: boolean | null
          created_at?: string | null
          default_quality?: string | null
          default_subtitle_language?: string | null
          id?: string
          parental_controls?: Json | null
          preferred_genres?: Json | null
          preferred_languages?: string[] | null
          subtitles_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_watchlists: {
        Row: {
          added_at: string | null
          id: string
          movie_id: number
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          movie_id: number
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          movie_id?: number
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          is_online: boolean | null
          last_seen: string | null
          phone: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          is_online?: boolean | null
          last_seen?: string | null
          phone?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_online?: boolean | null
          last_seen?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      watch_history: {
        Row: {
          completed: boolean | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          last_watched_at: string | null
          movie_id: number
          progress_seconds: number | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          last_watched_at?: string | null
          movie_id: number
          progress_seconds?: number | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          last_watched_at?: string | null
          movie_id?: number
          progress_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_expired_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
