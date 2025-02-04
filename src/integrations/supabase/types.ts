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
      activities: {
        Row: {
          activity_id: string
          activity_name: string
          approved_by_teacher_id: string | null
          approved_status: boolean | null
          club_id: string | null
          created_at: string | null
          date: string
          deadline: string | null
          document_url: string | null
          points: number | null
          student_usn: string | null
        }
        Insert: {
          activity_id?: string
          activity_name: string
          approved_by_teacher_id?: string | null
          approved_status?: boolean | null
          club_id?: string | null
          created_at?: string | null
          date: string
          deadline?: string | null
          document_url?: string | null
          points?: number | null
          student_usn?: string | null
        }
        Update: {
          activity_id?: string
          activity_name?: string
          approved_by_teacher_id?: string | null
          approved_status?: boolean | null
          club_id?: string | null
          created_at?: string | null
          date?: string
          deadline?: string | null
          document_url?: string | null
          points?: number | null
          student_usn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_approved_by_teacher_id_fkey"
            columns: ["approved_by_teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      clubs: {
        Row: {
          club_head_usn: string | null
          club_id: string
          created_at: string | null
          faculty_coordinator_id: string | null
          no_of_activity: number | null
        }
        Insert: {
          club_head_usn?: string | null
          club_id?: string
          created_at?: string | null
          faculty_coordinator_id?: string | null
          no_of_activity?: number | null
        }
        Update: {
          club_head_usn?: string | null
          club_id?: string
          created_at?: string | null
          faculty_coordinator_id?: string | null
          no_of_activity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_faculty_coordinator_id_fkey"
            columns: ["faculty_coordinator_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      colleges: {
        Row: {
          college_id: string
          created_at: string | null
          name: string
        }
        Insert: {
          college_id?: string
          created_at?: string | null
          name: string
        }
        Update: {
          college_id?: string
          created_at?: string | null
          name?: string
        }
        Relationships: []
      }
      evaluators: {
        Row: {
          created_at: string | null
          dept: string
          evaluator_id: string
          teacher_id: string | null
        }
        Insert: {
          created_at?: string | null
          dept: string
          evaluator_id?: string
          teacher_id?: string | null
        }
        Update: {
          created_at?: string | null
          dept?: string
          evaluator_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evaluators_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      participations: {
        Row: {
          activity_id: string | null
          created_at: string | null
          document_url: string | null
          participation_id: string
          points: number | null
          position: string | null
          student_usn: string | null
        }
        Insert: {
          activity_id?: string | null
          created_at?: string | null
          document_url?: string | null
          participation_id?: string
          points?: number | null
          position?: string | null
          student_usn?: string | null
        }
        Update: {
          activity_id?: string | null
          created_at?: string | null
          document_url?: string | null
          participation_id?: string
          points?: number | null
          position?: string | null
          student_usn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["activity_id"]
          },
        ]
      }
      student_counseling: {
        Row: {
          counseling_id: string
          created_at: string | null
          student_usn: string | null
          teacher_id: string | null
        }
        Insert: {
          counseling_id?: string
          created_at?: string | null
          student_usn?: string | null
          teacher_id?: string | null
        }
        Update: {
          counseling_id?: string
          created_at?: string | null
          student_usn?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_counseling_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["teacher_id"]
          },
        ]
      }
      students: {
        Row: {
          college_id: string | null
          created_at: string | null
          dept: string
          dob: string
          email: string
          first_name: string
          last_name: string
          usn: string
          year: number
        }
        Insert: {
          college_id?: string | null
          created_at?: string | null
          dept: string
          dob: string
          email: string
          first_name: string
          last_name: string
          usn: string
          year: number
        }
        Update: {
          college_id?: string | null
          created_at?: string | null
          dept?: string
          dob?: string
          email?: string
          first_name?: string
          last_name?: string
          usn?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["college_id"]
          },
        ]
      }
      teachers: {
        Row: {
          college_id: string | null
          created_at: string | null
          dept: string
          email: string
          first_name: string
          last_name: string
          teacher_id: string
        }
        Insert: {
          college_id?: string | null
          created_at?: string | null
          dept: string
          email: string
          first_name: string
          last_name: string
          teacher_id?: string
        }
        Update: {
          college_id?: string | null
          created_at?: string | null
          dept?: string
          email?: string
          first_name?: string
          last_name?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["college_id"]
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
      [_ in never]: never
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
