
-- The contact_submissions INSERT policy with (true) is intentional - anyone should be able to submit the contact form.
-- But let's tighten it by removing the overly broad "true" and instead not requiring auth for INSERT only.
-- Drop and recreate with more specific naming to acknowledge it's intentional public access.
DROP POLICY "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Public contact form submissions" ON public.contact_submissions FOR INSERT TO anon, authenticated WITH CHECK (
  char_length(name) > 0 AND char_length(name) <= 200 AND
  char_length(email) > 0 AND char_length(email) <= 320 AND
  char_length(message) > 0 AND char_length(message) <= 5000
);
