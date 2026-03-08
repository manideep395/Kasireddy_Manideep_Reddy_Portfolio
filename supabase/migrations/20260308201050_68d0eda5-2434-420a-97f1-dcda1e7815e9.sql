CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read site_settings" ON public.site_settings FOR SELECT USING (true);

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);

-- Seed the resume URL
INSERT INTO public.site_settings (key, value) VALUES ('resume_url', 'https://drive.google.com/file/d/1zAgpoC17EI6hJm1Dw-Fi5eTNFo_IbWo4/view?usp=sharing');
