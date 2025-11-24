-- Add application_requirements column to jobs table
ALTER TABLE jobs 
ADD COLUMN application_requirements JSONB DEFAULT '{"resume": true, "cover_letter": false, "transcript": false, "portfolio": false, "references": false, "writing_sample": false}'::jsonb;

-- Comment on column
COMMENT ON COLUMN jobs.application_requirements IS 'JSON object storing boolean flags for required application documents';
