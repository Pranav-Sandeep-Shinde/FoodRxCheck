import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://njuuiiwafdfbsyyzdowj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdXVpaXdhZmRmYnN5eXpkb3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxOTAyOTAsImV4cCI6MjA1MDc2NjI5MH0.iysWrx9ikAnScIgne5U6X3l9QoH-94CSVCotZcEuvEE'

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;