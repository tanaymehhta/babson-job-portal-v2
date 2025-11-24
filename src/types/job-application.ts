export type ApplicationStatus =
    | 'saved'
    | 'preparing'
    | 'applied'
    | 'interview_round_1'
    | 'interview_round_2'
    | 'interview_round_3'
    | 'interview_final'
    | 'offer_received'
    | 'accepted'
    | 'rejected'
    | 'withdrawn';

export interface JobApplication {
    id: string;
    user_id: string;
    role: string;
    company: string;
    location: string;
    pay: string | null;
    status: ApplicationStatus;
    date_applied: string | null;
    application_deadline: string | null;
    next_steps: string | null;
    link: string | null;
    resume_version: string | null;
    contact_person: string | null;
    interview_stage: string | null;
    comments: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateJobApplicationDTO {
    role: string;
    company: string;
    location: string;
    pay?: string | null;
    status: ApplicationStatus;
    date_applied?: string | null;
    application_deadline?: string | null;
    next_steps?: string | null;
    link?: string | null;
    resume_version?: string | null;
    contact_person?: string | null;
    interview_stage?: string | null;
    comments?: string | null;
}

export interface UpdateJobApplicationDTO extends Partial<CreateJobApplicationDTO> { }
