-- Add roles table
CREATE TABLE public.roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('viewer','editor','admin'))
);

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their role" ON public.roles
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger to create default role entry on new user
CREATE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.roles (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER create_role_after_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Update policies for clients
DROP POLICY IF EXISTS "Users can manage their own clients" ON public.clients;

CREATE POLICY "Select own clients or admin" ON public.clients
  FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  );

CREATE POLICY "Modify own clients" ON public.clients
  FOR INSERT, UPDATE, DELETE USING (
    (auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role IN ('editor','admin')
    )) OR EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  ) WITH CHECK (
    (auth.uid() = user_id AND EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role IN ('editor','admin')
    )) OR EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  );

-- Update policies for posts
DROP POLICY IF EXISTS "Users can manage posts through clients" ON public.posts;

CREATE POLICY "Select own posts or admin" ON public.posts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = posts.client_id AND (c.user_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
      ))
    )
  );

CREATE POLICY "Modify own posts" ON public.posts
  FOR INSERT, UPDATE, DELETE USING (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = posts.client_id AND ((c.user_id = auth.uid() AND EXISTS (
        SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role IN ('editor','admin')
      )) OR EXISTS (
        SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
      ))
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients c
      WHERE c.id = posts.client_id AND ((c.user_id = auth.uid() AND EXISTS (
        SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role IN ('editor','admin')
      )) OR EXISTS (
        SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
      ))
    )
  );

-- Update policies for templates
DROP POLICY IF EXISTS "Authenticated users can read templates" ON public.templates;

CREATE POLICY "Read templates" ON public.templates
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Manage templates as admin" ON public.templates
  FOR INSERT, UPDATE, DELETE USING (
    EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'
    )
  );
