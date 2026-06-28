
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmgwcgtaagbqvfsjdnby.supabase.co';
const supabaseAnonKey = 'sb_publishable_J_C_orH2PVY5IUUBaN_Sbw_knJZoCWv';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  try {
    const { data, error } = await supabase.from('quizzes').select('category');
    if (error) {
      console.error('Error:', error.message);
      return;
    }
    const cats = Array.from(new Set(data.map(d => d.category)));
    console.log('Categories in DB found:', cats);
  } catch (e) {
    console.error('Exception:', e.message);
  }
}

check();
