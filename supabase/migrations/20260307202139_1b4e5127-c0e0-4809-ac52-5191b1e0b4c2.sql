
-- Timestamp updater function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  category TEXT NOT NULL DEFAULT 'Web',
  language TEXT NOT NULL DEFAULT 'JavaScript',
  tags TEXT[] DEFAULT '{}',
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  stars INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_from_github BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Projects are viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Blogs table
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published blogs are viewable by everyone" ON public.blogs FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage blogs" ON public.blogs FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certifications are viewable by everyone" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage certifications" ON public.certifications FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Experiences table
CREATE TABLE public.experiences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Experiences are viewable by everyone" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage experiences" ON public.experiences FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON public.experiences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view submissions" ON public.contact_submissions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update submissions" ON public.contact_submissions FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50,
  display_order INTEGER DEFAULT 0
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage skills" ON public.skills FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Seed initial data
INSERT INTO public.projects (name, description, category, language, tags, github_url, stars, is_featured) VALUES
  ('Smart Resume Generator', 'AI-powered resume builder with intelligent formatting and keyword optimization.', 'AI', 'Python', ARRAY['Python', 'NLP', 'FastAPI'], 'https://github.com/manideep395', 5, true),
  ('Twitter Sentiment Analysis', 'Real-time sentiment analysis using NLP transformers and ML classification.', 'AI', 'Python', ARRAY['Python', 'ML', 'NLP'], 'https://github.com/manideep395', 8, true),
  ('Weather Forecast Dashboard', 'Interactive weather dashboard with real-time data visualization.', 'Web', 'JavaScript', ARRAY['React', 'API', 'Charts'], 'https://github.com/manideep395', 3, true),
  ('SQL Injection Detection Tool', 'Security tool detecting SQL injection using pattern matching and ML.', 'Tools', 'Python', ARRAY['Python', 'Security', 'ML'], 'https://github.com/manideep395', 12, true),
  ('Building Construction Cost Tool', 'Data-driven construction cost estimation application.', 'Data', 'Python', ARRAY['Python', 'Data', 'Analytics'], 'https://github.com/manideep395', 4, true);

INSERT INTO public.experiences (role, company, duration, description, technologies, display_order) VALUES
  ('Python Developer Intern', 'Codec Technologies', '2023', 'Built Python applications and automation scripts. Worked on data processing pipelines and API development.', ARRAY['Python', 'FastAPI', 'SQL'], 1),
  ('Java Developer Intern', 'Codec Technologies', '2023', 'Developed Java-based applications, implemented OOP design patterns, and worked on backend services.', ARRAY['Java', 'Spring', 'MySQL'], 2),
  ('Data Analytics Virtual Intern', 'Deloitte', '2024', 'Completed data analytics projects involving data cleaning, visualization, and business insights generation.', ARRAY['Python', 'Pandas', 'Tableau'], 3);

INSERT INTO public.certifications (title, issuer, display_order) VALUES
  ('Data Structures and Algorithms using Java', 'Infosys Springboard', 1),
  ('Data Analytics Virtual Internship', 'Deloitte', 2);

INSERT INTO public.skills (name, category, level, display_order) VALUES
  ('Python', 'Languages', 90, 1), ('Java', 'Languages', 80, 2), ('C', 'Languages', 70, 3), ('JavaScript', 'Languages', 85, 4),
  ('React', 'Web Development', 85, 1), ('HTML/CSS', 'Web Development', 90, 2), ('FastAPI', 'Web Development', 75, 3), ('Tailwind CSS', 'Web Development', 85, 4),
  ('Machine Learning', 'AI & Data', 80, 1), ('NLP', 'AI & Data', 75, 2), ('Pandas', 'AI & Data', 85, 3), ('Scikit-learn', 'AI & Data', 78, 4),
  ('MySQL', 'Databases & Tools', 80, 1), ('MongoDB', 'Databases & Tools', 75, 2), ('Git/GitHub', 'Databases & Tools', 88, 3), ('Docker', 'Databases & Tools', 65, 4);
