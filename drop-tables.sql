
-- First drop all tables with foreign key constraints
DROP TABLE IF EXISTS public.agent_insights CASCADE;
DROP TABLE IF EXISTS public.agent_tasks CASCADE;
DROP TABLE IF EXISTS public.project_collaborators CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.agent_batches CASCADE;
DROP TABLE IF EXISTS public.agent_interactions CASCADE;
DROP TABLE IF EXISTS public.agent_collaborations CASCADE;
DROP TABLE IF EXISTS public.insight_feedback CASCADE;
DROP TABLE IF EXISTS public.exports CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Then drop parent tables
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.agent_personas CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;

-- Drop any functions and triggers
DROP FUNCTION IF EXISTS public.update_modified_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop extensions if needed (usually not recommended unless you're completely starting over)
-- DROP EXTENSION IF EXISTS vector;
