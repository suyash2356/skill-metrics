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
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
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
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
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
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          is_muted: boolean
          joined_at: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          is_muted?: boolean
          joined_at?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          is_muted?: boolean
          joined_at?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      external_community_links: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          link: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          link: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          link?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      follow_requests: {
        Row: {
          created_at: string
          id: string
          requested_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          requested_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          requested_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
          status?: string | null
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
          status?: string | null
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
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string
          id: string
          is_deleted: boolean
          is_edited: boolean
          message_type: string
          reply_to_id: string | null
          sender_id: string
          shared_post_id: string | null
          shared_resource_id: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_id: string
          shared_post_id?: string | null
          shared_resource_id?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_edited?: boolean
          message_type?: string
          reply_to_id?: string | null
          sender_id?: string
          shared_post_id?: string | null
          shared_resource_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_shared_post_id_fkey"
            columns: ["shared_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_shared_resource_id_fkey"
            columns: ["shared_resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
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
      post_preferences: {
        Row: {
          created_at: string
          id: string
          post_id: string
          preference_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          preference_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          preference_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_preferences_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          post_id: string
          reason: string
          reporter_id: string
          status: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          post_id: string
          reason: string
          reporter_id: string
          status?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          post_id?: string
          reason?: string
          reporter_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "post_reports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string | null
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
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      resource_ratings: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          stars: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          stars: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          stars?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_ratings_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_review_helpful: {
        Row: {
          created_at: string
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_review_helpful_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "resource_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_reviews: {
        Row: {
          created_at: string
          helpful_count: number
          id: string
          is_verified: boolean
          resource_id: string
          review_text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          helpful_count?: number
          id?: string
          is_verified?: boolean
          resource_id: string
          review_text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          helpful_count?: number
          id?: string
          is_verified?: boolean
          resource_id?: string
          review_text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_reviews_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_votes: {
        Row: {
          created_at: string
          id: string
          resource_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          resource_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          resource_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_votes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          avg_rating: number | null
          category: string
          color: string | null
          created_at: string
          description: string
          difficulty: string
          duration: string | null
          education_levels: string[] | null
          estimated_time: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_free: boolean
          link: string
          prerequisites: string[] | null
          provider: string | null
          rating: number | null
          recommend_percent: number | null
          related_skills: string[] | null
          relevant_backgrounds: string[] | null
          resource_type: string
          section_type: string
          target_countries: string[] | null
          title: string
          total_ratings: number | null
          total_reviews: number | null
          total_votes: number | null
          updated_at: string
          weighted_rating: number | null
        }
        Insert: {
          avg_rating?: number | null
          category: string
          color?: string | null
          created_at?: string
          description: string
          difficulty?: string
          duration?: string | null
          education_levels?: string[] | null
          estimated_time?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_free?: boolean
          link: string
          prerequisites?: string[] | null
          provider?: string | null
          rating?: number | null
          recommend_percent?: number | null
          related_skills?: string[] | null
          relevant_backgrounds?: string[] | null
          resource_type?: string
          section_type?: string
          target_countries?: string[] | null
          title: string
          total_ratings?: number | null
          total_reviews?: number | null
          total_votes?: number | null
          updated_at?: string
          weighted_rating?: number | null
        }
        Update: {
          avg_rating?: number | null
          category?: string
          color?: string | null
          created_at?: string
          description?: string
          difficulty?: string
          duration?: string | null
          education_levels?: string[] | null
          estimated_time?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_free?: boolean
          link?: string
          prerequisites?: string[] | null
          provider?: string | null
          rating?: number | null
          recommend_percent?: number | null
          related_skills?: string[] | null
          relevant_backgrounds?: string[] | null
          resource_type?: string
          section_type?: string
          target_countries?: string[] | null
          title?: string
          total_ratings?: number | null
          total_reviews?: number | null
          total_votes?: number | null
          updated_at?: string
          weighted_rating?: number | null
        }
        Relationships: []
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
          difficulty: string | null
          duration: string | null
          id: string
          step_id: string
          title: string
          type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          difficulty?: string | null
          duration?: string | null
          id?: string
          step_id: string
          title: string
          type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: string | null
          duration?: string | null
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
          assessment_criteria: Json | null
          common_pitfalls: Json | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          duration: string | null
          estimated_hours: number | null
          id: string
          learning_objectives: Json | null
          milestones: Json | null
          notes: string | null
          order_index: number
          prerequisites: Json | null
          real_world_examples: Json | null
          roadmap_id: string
          task: string | null
          tasks: Json | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          assessment_criteria?: Json | null
          common_pitfalls?: Json | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration?: string | null
          estimated_hours?: number | null
          id?: string
          learning_objectives?: Json | null
          milestones?: Json | null
          notes?: string | null
          order_index: number
          prerequisites?: Json | null
          real_world_examples?: Json | null
          roadmap_id: string
          task?: string | null
          tasks?: Json | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          assessment_criteria?: Json | null
          common_pitfalls?: Json | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          duration?: string | null
          estimated_hours?: number | null
          id?: string
          learning_objectives?: Json | null
          milestones?: Json | null
          notes?: string | null
          order_index?: number
          prerequisites?: Json | null
          real_world_examples?: Json | null
          roadmap_id?: string
          task?: string | null
          tasks?: Json | null
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
          masked_ip: string | null
          os: string | null
          security_notes: string | null
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
          masked_ip?: string | null
          os?: string | null
          security_notes?: string | null
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
          masked_ip?: string | null
          os?: string | null
          security_notes?: string | null
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
      calculate_weighted_rating: {
        Args: { p_resource_id: string }
        Returns: number
      }
      can_message_user: {
        Args: { _recipient_id: string; _sender_id: string }
        Returns: boolean
      }
      can_view_profile: {
        Args: { _profile_user_id: string; _viewer_id: string }
        Returns: boolean
      }
      check_rating_rate_limit: { Args: { p_user_id: string }; Returns: boolean }
      cleanup_old_activity: { Args: never; Returns: undefined }
      create_default_collections_for_existing_users: {
        Args: never
        Returns: undefined
      }
      create_default_preferences_for_existing_users: {
        Args: never
        Returns: undefined
      }
      delete_user_account: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      find_or_create_conversation: {
        Args: { _user1: string; _user2: string }
        Returns: string
      }
      get_basic_profile_info: {
        Args: { target_user_id: string }
        Returns: Json
      }
      get_my_sessions: {
        Args: never
        Returns: {
          browser: string
          country: string
          created_at: string
          device_type: string
          id: string
          is_active: boolean
          last_activity: string
          os: string
        }[]
      }
      get_post_author_info: {
        Args: { _author_id: string; _viewer_id: string }
        Returns: Json
      }
      get_profile_stats: { Args: { target_user_id: string }; Returns: Json }
      get_site_average_rating: { Args: never; Returns: number }
      has_community_role: {
        Args: {
          _community_id: string
          _role: Database["public"]["Enums"]["community_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_uuid: string }; Returns: boolean }
      is_conversation_participant: {
        Args: { _conversation_id: string; _user_id: string }
        Returns: boolean
      }
      mask_ip_address: { Args: { ip: unknown }; Returns: string }
      migrate_profile_data: { Args: never; Returns: undefined }
      register_first_admin: {
        Args: { admin_email: string; admin_user_id: string }
        Returns: boolean
      }
      search_profiles: {
        Args: { result_limit?: number; search_query: string }
        Returns: {
          avatar_url: string
          full_name: string
          user_id: string
        }[]
      }
      send_comment_notification: {
        Args: {
          p_comment_text: string
          p_post_id: string
          p_post_owner_id: string
          p_post_title: string
        }
        Returns: undefined
      }
      send_follow_accepted_notification: {
        Args: { p_requester_id: string }
        Returns: undefined
      }
      send_follow_notification: {
        Args: { p_followed_user_id: string }
        Returns: undefined
      }
      send_follow_request_notification: {
        Args: { p_requested_user_id: string }
        Returns: undefined
      }
      send_like_notification: {
        Args: {
          p_post_id: string
          p_post_owner_id: string
          p_post_title: string
        }
        Returns: undefined
      }
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
