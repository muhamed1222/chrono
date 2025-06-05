import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

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
  res.json(data);
});

app.post('/api/clients', async (req, res) => {
  const { data, error } = await supabase
    .from('clients')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('clients')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

// Posts endpoints
app.get('/api/posts', async (_req, res) => {
  const { data, error } = await supabase.from('posts').select('*').order('scheduledFor');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/posts', async (req, res) => {
  const { data, error } = await supabase
    .from('posts')
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('posts')
    .update(req.body)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
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
