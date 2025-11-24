export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            applications: {
                Row: {
                    cover_note: string | null
                    created_at: string
                    id: string
                    job_id: string
                    status: string | null
                    student_id: string
                }
                Insert: {
                    cover_note?: string | null
                    created_at?: string
                    id?: string
                    job_id: string
                    status?: string | null
                    student_id: string
                }
                Update: {
                    cover_note?: string | null
                    created_at?: string
                    id?: string
                    job_id?: string
                    status?: string | null
                    student_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "applications_job_id_fkey"
                        columns: ["job_id"]
                        isOneToOne: false
                        referencedRelation: "jobs"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "applications_student_id_fkey"
                        columns: ["student_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            events: {
                Row: {
                    created_at: string
                    date: string
                    description: string | null
                    embedding: string | null
                    event_type: string | null
                    id: string
                    industry: string | null
                    link: string | null
                    location_specifics: string | null
                    location_type: string | null
                    title: string
                }
                Insert: {
                    created_at?: string
                    date: string
                    description?: string | null
                    embedding?: string | null
                    event_type?: string | null
                    id?: string
                    industry?: string | null
                    link?: string | null
                    location_specifics?: string | null
                    location_type?: string | null
                    title: string
                }
                Update: {
                    created_at?: string
                    date?: string
                    description?: string | null
                    embedding?: string | null
                    event_type?: string | null
                    id?: string
                    industry?: string | null
                    link?: string | null
                    location_specifics?: string | null
                    location_type?: string | null
                    title?: string
                }
                Relationships: []
            }
            jobs: {
                Row: {
                    babson_connection: string | null
                    company_name: string
                    created_at: string
                    date_posted: string
                    embedding: string | null
                    id: string
                    is_paid: boolean | null
                    link: string | null
                    location_specifics: string | null
                    location_type: string | null
                    posted_by: string | null
                    requirements: string[] | null
                    application_requirements: {
                        resume: boolean
                        cover_letter: boolean
                        transcript: boolean
                        portfolio: boolean
                        references: boolean
                        writing_sample: boolean
                    } | null
                    salary_max: number | null
                    salary_min: number | null
                    status: string | null
                    title: string
                }
                Insert: {
                    babson_connection?: string | null
                    company_name: string
                    created_at?: string
                    date_posted?: string
                    embedding?: string | null
                    id?: string
                    is_paid?: boolean | null
                    link?: string | null
                    location_specifics?: string | null
                    location_type?: string | null
                    posted_by?: string | null
                    requirements?: string[] | null
                    application_requirements?: {
                        resume: boolean
                        cover_letter: boolean
                        transcript: boolean
                        portfolio: boolean
                        references: boolean
                        writing_sample: boolean
                    } | null
                    salary_max?: number | null
                    salary_min?: number | null
                    status?: string | null
                    title: string
                }
                Update: {
                    babson_connection?: string | null
                    company_name?: string
                    created_at?: string
                    date_posted?: string
                    embedding?: string | null
                    id?: string
                    is_paid?: boolean | null
                    link?: string | null
                    location_specifics?: string | null
                    location_type?: string | null
                    posted_by?: string | null
                    requirements?: string[] | null
                    application_requirements?: {
                        resume: boolean
                        cover_letter: boolean
                        transcript: boolean
                        portfolio: boolean
                        references: boolean
                        writing_sample: boolean
                    } | null
                    salary_max?: number | null
                    salary_min?: number | null
                    status?: string | null
                    title?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "jobs_posted_by_fkey"
                        columns: ["posted_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    bio: string | null
                    company_name: string | null
                    created_at: string
                    email: string | null
                    embedding: string | null
                    full_name: string | null
                    id: string
                    is_verified: boolean | null
                    linkedin_url: string | null
                    resume_text: string | null
                    role: string
                }
                Insert: {
                    bio?: string | null
                    company_name?: string | null
                    created_at?: string
                    email?: string | null
                    embedding?: string | null
                    full_name?: string | null
                    id: string
                    is_verified?: boolean | null
                    linkedin_url?: string | null
                    resume_text?: string | null
                    role: string
                }
                Update: {
                    bio?: string | null
                    company_name?: string | null
                    created_at?: string
                    email?: string | null
                    embedding?: string | null
                    full_name?: string | null
                    id?: string
                    is_verified?: boolean | null
                    linkedin_url?: string | null
                    resume_text?: string | null
                    role?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            match_events: {
                Args: {
                    query_embedding: string
                    match_threshold: number
                    match_count: number
                }
                Returns: {
                    id: string
                    title: string
                    event_type: string
                    similarity: number
                }[]
            }
            match_jobs: {
                Args: {
                    query_embedding: string
                    match_threshold: number
                    match_count: number
                }
                Returns: {
                    id: string
                    title: string
                    company_name: string
                    similarity: number
                }[]
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
