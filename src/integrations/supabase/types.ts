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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookmarks: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          roadmap_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          roadmap_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          roadmap_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      communities: {
        Row: {
          banner: string | null
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          image: string | null
          is_private: boolean | null
          logo: string | null
          members_count: number
          name: string
          posts_count: number
        }
        Insert: {
          banner?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_private?: boolean | null
          logo?: string | null
          members_count?: number
          name: string
          posts_count?: number
        }
        Update: {
          banner?: string | null
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_private?: boolean | null
          logo?: string | null
          members_count?: number
          name?: string
          posts_count?: number
        }
        Relationships: []
      }
      community_answers: {
        Row: {
          answer: string | null
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          answer?: string | null
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          answer?: string | null
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "community_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_leaderboard: {
        Row: {
          community_id: string | null
          id: string
          last_update: string | null
          points: number | null
          streak_days: number | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          id?: string
          last_update?: string | null
          points?: number | null
          streak_days?: number | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          id?: string
          last_update?: string | null
          points?: number | null
          streak_days?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_leaderboard_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_leaderboard_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_member_roles: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          community_id: string
          id: string
          role: Database["public"]["Enums"]["community_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          community_id: string
          id?: string
          role?: Database["public"]["Enums"]["community_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          community_id?: string
          id?: string
          role?: Database["public"]["Enums"]["community_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_member_roles_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      community_members: {
        Row: {
          community_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          community_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          community_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_projects: {
        Row: {
          community_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          community_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          community_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_projects_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_questions: {
        Row: {
          community_id: string | null
          created_at: string | null
          id: string
          question: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          created_at?: string | null
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          created_at?: string | null
          id?: string
          question?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_questions_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_resources: {
        Row: {
          community_id: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          link: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          link?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_resources_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_resources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string | null
          community_id: string | null
          content: string | null
          created_at: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          community_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          community_id?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      progress_updates: {
        Row: {
          community_id: string | null
          created_at: string | null
          id: string
          update_text: string | null
          user_id: string | null
        }
        Insert: {
          community_id?: string | null
          created_at?: string | null
          id?: string
          update_text?: string | null
          user_id?: string | null
        }
        Update: {
          community_id?: string | null
          created_at?: string | null
          id?: string
          update_text?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_updates_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      project_team_members: {
        Row: {
          id: string
          joined_at: string | null
          project_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          project_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_team_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "community_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_skills: {
        Row: {
          created_at: string
          id: string
          is_checked: boolean
          roadmap_id: string
          skill_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_checked?: boolean
          roadmap_id: string
          skill_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_checked?: boolean
          roadmap_id?: string
          skill_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_skills_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_step_resources: {
        Row: {
          created_at: string
          id: string
          step_id: string
          title: string
          type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          step_id: string
          title: string
          type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          step_id?: string
          title?: string
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_step_resources_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "roadmap_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_steps: {
        Row: {
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          duration: string | null
          id: string
          notes: string | null
          order_index: number
          roadmap_id: string
          task: string | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          order_index: number
          roadmap_id: string
          task?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration?: string | null
          id?: string
          notes?: string | null
          order_index?: number
          roadmap_id?: string
          task?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_steps_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmap_templates: {
        Row: {
          created_at: string
          id: string
          is_public: boolean | null
          name: string | null
          roadmap_id: string
          template_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          name?: string | null
          roadmap_id: string
          template_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean | null
          name?: string | null
          roadmap_id?: string
          template_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_templates_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      roadmaps: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_time: string | null
          id: string
          is_public: boolean
          progress: number
          status: string
          technologies: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          id?: string
          is_public?: boolean
          progress?: number
          status?: string
          technologies?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: string | null
          id?: string
          is_public?: boolean
          progress?: number
          status?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_posts: {
        Row: {
          collection_id: string | null
          created_at: string
          id: string
          notes: string | null
          post_id: string
          user_id: string
        }
        Insert: {
          collection_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          post_id: string
          user_id: string
        }
        Update: {
          collection_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_posts_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "saved_posts_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_posts_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_posts_collections: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: string
          message: string
          status: string
          subject: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_type: string
          community_id: string | null
          created_at: string
          device_type: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          post_id: string | null
          roadmap_id: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          community_id?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          post_id?: string | null
          roadmap_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          community_id?: string | null
          created_at?: string
          device_type?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          post_id?: string | null
          roadmap_id?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_activity_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          allow_follow_requests: boolean | null
          created_at: string
          display_name: string | null
          email_notifications: boolean | null
          id: string
          language: string | null
          login_notifications: boolean | null
          marketing_emails: boolean | null
          profile_visibility: string | null
          push_notifications: boolean | null
          show_online_status: boolean | null
          theme: string | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          allow_follow_requests?: boolean | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          login_notifications?: boolean | null
          marketing_emails?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          allow_follow_requests?: boolean | null
          created_at?: string
          display_name?: string | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          login_notifications?: boolean | null
          marketing_emails?: boolean | null
          profile_visibility?: string | null
          push_notifications?: boolean | null
          show_online_status?: boolean | null
          theme?: string | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      user_profile_details: {
        Row: {
          achievements: Json | null
          bio: string | null
          company: string | null
          created_at: string
          experience_level: string | null
          id: string
          job_title: string | null
          join_date: string | null
          learning_path: Json | null
          location: string | null
          portfolio_url: string | null
          skills: Json | null
          social_links: Json | null
          total_comments_received: number | null
          total_likes_received: number | null
          total_posts: number | null
          total_roadmaps: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          bio?: string | null
          company?: string | null
          created_at?: string
          experience_level?: string | null
          id?: string
          job_title?: string | null
          join_date?: string | null
          learning_path?: Json | null
          location?: string | null
          portfolio_url?: string | null
          skills?: Json | null
          social_links?: Json | null
          total_comments_received?: number | null
          total_likes_received?: number | null
          total_posts?: number | null
          total_roadmaps?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievements?: Json | null
          bio?: string | null
          company?: string | null
          created_at?: string
          experience_level?: string | null
          id?: string
          job_title?: string | null
          join_date?: string | null
          learning_path?: Json | null
          location?: string | null
          portfolio_url?: string | null
          skills?: Json | null
          social_links?: Json | null
          total_comments_received?: number | null
          total_likes_received?: number | null
          total_posts?: number | null
          total_roadmaps?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string
          device_name: string | null
          device_type: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string
          os: string | null
          timezone: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string
          os?: string | null
          timezone?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string
          os?: string | null
          timezone?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          channel: string | null
          channel_avatar: string | null
          created_at: string
          duration: string | null
          id: string
          thumbnail: string | null
          title: string
          upload_time: string | null
          views: string | null
        }
        Insert: {
          category?: string | null
          channel?: string | null
          channel_avatar?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          thumbnail?: string | null
          title: string
          upload_time?: string | null
          views?: string | null
        }
        Update: {
          category?: string | null
          channel?: string | null
          channel_avatar?: string | null
          created_at?: string
          duration?: string | null
          id?: string
          thumbnail?: string | null
          title?: string
          upload_time?: string | null
          views?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_activity: { Args: never; Returns: undefined }
      create_default_collections_for_existing_users: {
        Args: never
        Returns: undefined
      }
      create_default_preferences_for_existing_users: {
        Args: never
        Returns: undefined
      }
      has_community_role: {
        Args: {
          _community_id: string
          _role: Database["public"]["Enums"]["community_role"]
          _user_id: string
        }
        Returns: boolean
      }
      migrate_profile_data: { Args: never; Returns: undefined }
    }
    Enums: {
      community_role: "admin" | "moderator" | "member"
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
      community_role: ["admin", "moderator", "member"],
    },
  },
} as const
