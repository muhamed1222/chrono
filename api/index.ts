import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const camelToSnake = (str: string): string =>
  str.replace(/([A-Z])/g, (_, c) => `_${c.toLowerCase()}`);

const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

const convertKeys = (
  obj: unknown,
  converter: (key: string) => string
): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeys(v, converter));
  }
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        converter(k),
        convertKeys(v, converter)
      ])
    );
  }
  return obj;
};

const toSnake = (obj: unknown): unknown => convertKeys(obj, camelToSnake);
const toCamel = (obj: unknown): unknown => convertKeys(obj, snakeToCamel);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const app = express();
app.use(express.json());

// Clients endpoints
app.get('/api/clients', async (_req, res) => {
  const { data, error } = await supabase.from('clients').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.post('/api/clients', async (req, res) => {
  const payload = toSnake(req.body);
  const { data, error } = await supabase
    .from('clients')
    .insert(payload)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const payload = toSnake(req.body);
  const { data, error } = await supabase
    .from('clients')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Posts endpoints
app.get('/api/posts', async (_req, res) => {
  const { data, error } = await supabase.from('posts').select('*').order('scheduled_for');
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.post('/api/posts', async (req, res) => {
  const payload = toSnake(req.body);
  const { data, error } = await supabase
    .from('posts')
    .insert(payload)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const payload = toSnake(req.body);
  const { data, error } = await supabase
    .from('posts')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(toCamel(data));
});

app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Templates endpoints
app.get('/api/templates', async (_req, res) => {
  const { data, error } = await supabase.from('templates').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/templates', async (req, res) => {
  const { data, error } = await supabase
    .from('templates')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('templates')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/templates/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('templates').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
