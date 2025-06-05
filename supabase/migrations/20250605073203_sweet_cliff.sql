/*
  # Initial Schema Setup for Chrono

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `industry` (text)
      - `logo` (text, optional)
      - `color` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `social_accounts`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `platform` (text)
      - `handle` (text)
      - `connected` (boolean)
      - `account_name` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `posts`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references clients)
      - `content` (text)
      - `media` (text[], optional)
      - `platforms` (text[])
      - `scheduled_for` (timestamp)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `templates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `content` (text)
      - `industry` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  industry text NOT NULL,
  logo text,
  color text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
  ON clients
  USING (auth.uid() = user_id);

-- Create social_accounts table
CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients ON DELETE CASCADE NOT NULL,
  platform text NOT NULL CHECK (platform IN ('telegram', 'vk', 'instagram')),
  handle text NOT NULL,
  connected boolean DEFAULT false,
  account_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage social accounts through clients"
  ON social_accounts
  USING (EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = social_accounts.client_id 
    AND clients.user_id = auth.uid()
  ));

-- Create posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  media text[],
  platforms text[] NOT NULL,
  scheduled_for timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('draft', 'scheduled', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage posts through clients"
  ON posts
  USING (EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = posts.client_id 
    AND clients.user_id = auth.uid()
  ));

-- Create templates table
CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  industry text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Templates are read-only for authenticated users
CREATE POLICY "Authenticated users can read templates"
  ON templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_social_accounts_client_id ON social_accounts(client_id);
CREATE INDEX idx_posts_client_id ON posts(client_id);
CREATE INDEX idx_posts_scheduled_for ON posts(scheduled_for);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();