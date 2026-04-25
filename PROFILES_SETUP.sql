-- 1. Profiles-Tabelle erstellen, um Abo-Status zu speichern
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_status TEXT DEFAULT 'none', -- 'none', 'active', 'canceled', 'past_due'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS auf Profiles-Tabelle aktivieren
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Nutzer können ihr eigenes Profil sehen
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 4. Policy: System/Service Role kann Profile aktualisieren (für Webhooks)
-- (Supabase Service Role umgeht RLS sowieso, aber zur Dokumentation)

-- 5. Trigger: Automatisch ein Profil erstellen, wenn ein neuer User sich registriert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
