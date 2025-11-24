-- Run this SQL command in your Supabase SQL Editor or via CLI to update the constraint
ALTER TABLE jobs DROP CONSTRAINT jobs_location_type_check;
ALTER TABLE jobs ADD CONSTRAINT jobs_location_type_check CHECK (location_type IN ('Virtual', 'Hybrid', 'Onsite', 'On Campus'));
