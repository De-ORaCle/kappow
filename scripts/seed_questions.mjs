import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse environment variables (basic)
const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...val] = line.split('=');
  if (key && val) {
    env[key.trim()] = val.join('=').trim().replace(/['"]/g, '');
  }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const batchFile = process.argv[2];
  if (!batchFile) {
    console.error("Usage: node seed_questions.mjs <path-to-batch-json>");
    process.exit(1);
  }

  const filePath = path.resolve(process.cwd(), batchFile);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!Array.isArray(data)) {
    console.error("JSON file must contain an array of question objects.");
    process.exit(1);
  }

  console.log(`Read ${data.length} questions from ${batchFile}.`);
  
  // Clean up objects to match DB schema exactly
  const records = data.map(q => ({
    text: q.text,
    options: q.options,
    correct_answer_index: q.correct_answer_index,
    points: q.points || 1000,
    time_limit: q.time_limit || 20,
    category: q.category || 'General',
    difficulty: q.difficulty || 'medium'
  }));

  // Insert in chunks to avoid any request size limits
  const chunkSize = 50;
  for (let i = 0; i < records.length; i += chunkSize) {
    const chunk = records.slice(i, i + chunkSize);
    console.log(`Inserting chunk ${i / chunkSize + 1} (${chunk.length} questions)...`);
    
    const { error } = await supabase.from('quizzes').insert(chunk);
    if (error) {
      console.error("Error inserting chunk:", error.message);
      process.exit(1);
    }
  }

  console.log("Successfully seeded all questions!");
}

run();
