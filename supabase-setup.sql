
-- Create agents table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  methodology TEXT,
  framework TEXT,
  confidence FLOAT,
  status TEXT NOT NULL DEFAULT 'idle', -- 'idle', 'analyzing', 'complete', 'error'
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_personas table
CREATE TABLE public.agent_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  traits TEXT[] NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add persona relation to agents
ALTER TABLE public.agents 
ADD COLUMN persona_id UUID REFERENCES public.agent_personas(id);

-- Create agent_insights table (separate from agents for better performance)
CREATE TABLE public.agent_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  insight TEXT NOT NULL,
  relevance INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  methodologies TEXT[],
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in-progress', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_collaborators table for tracking collaborators
CREATE TABLE public.project_collaborators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL, -- This would reference your auth.users table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table for tracking uploaded documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_tasks table
CREATE TABLE public.agent_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- 'analyze', 'collaborate', etc.
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'complete', 'error'
  input JSONB,
  output JSONB,
  batch_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_batches table
CREATE TABLE public.agent_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  agent_ids UUID[] NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'complete', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create agent_interactions table
CREATE TABLE public.agent_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'message', 'action', etc.
  content TEXT NOT NULL,
  metadata JSONB,
  is_compressed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable vector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to agent_interactions
ALTER TABLE public.agent_interactions 
ADD COLUMN embedding vector(1536);

-- Create agent_collaborations table
CREATE TABLE public.agent_collaborations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  agents UUID[] NOT NULL,
  collaboration_level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'complete', 'error'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create insight_feedback table
CREATE TABLE public.insight_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_id UUID,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  insight TEXT NOT NULL,
  rating TEXT, -- 'positive', 'negative', null
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for user preferences and settings
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exports table for tracking exported reports
CREATE TABLE public.exports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  format TEXT, -- e.g. 'pdf', 'csv', 'markdown', 'json'
  status TEXT DEFAULT 'completed', -- 'pending', 'processing', 'completed', 'failed'
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_collaborations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exports ENABLE ROW LEVEL SECURITY;

-- Create basic read policies
CREATE POLICY "Users can read all agents" ON public.agents
  FOR SELECT USING (true);

CREATE POLICY "Users can read all personas" ON public.agent_personas
  FOR SELECT USING (true);

CREATE POLICY "Users can read all projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Project collaborators can read project data" ON public.project_collaborators
  FOR SELECT USING (true);

-- Expanded RLS policies for write access
CREATE POLICY "Project collaborators can read project documents" ON public.documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = documents.project_id AND pc.user_id = auth.uid()
    )
  );

-- Write policies for projects
CREATE POLICY "Users can insert their own projects" ON public.projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update projects they collaborate on" ON public.projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = projects.id AND pc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete projects they collaborate on" ON public.projects
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = projects.id AND pc.user_id = auth.uid()
    )
  );

-- Write policies for documents
CREATE POLICY "Users can insert documents to their projects" ON public.documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = documents.project_id AND pc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents in their projects" ON public.documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = documents.project_id AND pc.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents in their projects" ON public.documents
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.project_collaborators pc
      WHERE pc.project_id = documents.project_id AND pc.user_id = auth.uid()
    )
  );

-- Policies for insight feedback
CREATE POLICY "Users can insert their own feedback" ON public.insight_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own feedback" ON public.insight_feedback
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Policies for profiles
CREATE POLICY "Users can access their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policies for exports
CREATE POLICY "Users can view their own exports" ON public.exports
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exports" ON public.exports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert some initial data for agent personas - using UUID generation
INSERT INTO public.agent_personas (name, description, traits)
VALUES 
  ('Critical Theorist', 'Examines power structures and societal influences in the data', ARRAY['Critical', 'Analytical', 'Questioning']),
  ('Methodological Pragmatist', 'Focuses on practical implications and actionable insights', ARRAY['Practical', 'Results-oriented', 'Systematic']),
  ('Interpretive Phenomenologist', 'Explores lived experiences and subjective perspectives', ARRAY['Empathetic', 'Reflective', 'Detail-oriented']),
  ('Constructivist', 'Examines how meaning is constructed through social interaction', ARRAY['Contextual', 'Relational', 'Process-focused']),
  ('Post-Positivist', 'Balances objectivity with recognition of research limitations', ARRAY['Objective', 'Rigorous', 'Cautious']);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_agents_modtime
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_agent_personas_modtime
BEFORE UPDATE ON public.agent_personas
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_agent_tasks_modtime
BEFORE UPDATE ON public.agent_tasks
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_agent_batches_modtime
BEFORE UPDATE ON public.agent_batches
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Function to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url, preferences)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url', '{}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function whenever a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
