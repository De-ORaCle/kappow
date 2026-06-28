const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const he = require('he');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
  { id: 9, name: 'General Knowledge' },
  { id: 17, name: 'Science' },
  { id: 18, name: 'Tech' },
  { id: 23, name: 'History' },
  { id: 22, name: 'Geography' },
  { id: 21, name: 'Sports' },
  { id: 11, name: 'Film' },
  { id: 12, name: 'Music' }
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function populate() {
  console.log("Starting population...");
  let allQuestions = [];

  for (const cat of CATEGORIES) {
    console.log(`Fetching ${cat.name}...`);
    try {
      const res = await fetch(`https://opentdb.com/api.php?amount=40&category=${cat.id}&type=multiple`);
      const data = await res.json();
      
      if (data.response_code === 0) {
        const mapped = data.results.map(q => {
          const correct = he.decode(q.correct_answer);
          const incorrect = q.incorrect_answers.map(a => he.decode(a));
          const options = [...incorrect, correct].sort(() => Math.random() - 0.5);
          return {
            text: he.decode(q.question),
            options,
            correct_answer_index: options.indexOf(correct),
            category: cat.name,
            difficulty: q.difficulty,
            points: q.difficulty === 'hard' ? 2000 : (q.difficulty === 'medium' ? 1000 : 500),
            time_limit: 20
          };
        });
        allQuestions.push(...mapped);
        console.log(`Added ${mapped.length}. Total: ${allQuestions.length}`);
      } else {
        console.warn(`OTDB Code ${data.response_code} for ${cat.name}`);
      }
      await sleep(5000); // 5 sec delay to be safe
    } catch (e) {
      console.error(e);
    }
  }

  console.log(`Final count: ${allQuestions.length}. Inserting...`);
  
  // Try to insert one by one or in small batches to identify column errors
  for (let i = 0; i < allQuestions.length; i += 20) {
    const chunk = allQuestions.slice(i, i + 20);
    const { error } = await supabase.from('quizzes').insert(chunk);
    if (error) {
      console.error(`Error in chunk ${i}:`, error.message);
      if (error.message.includes("difficulty")) {
        console.warn("Retrying without difficulty/category columns...");
        const simplified = chunk.map(({ difficulty, category, ...rest }) => rest);
        const { error: error2 } = await supabase.from('quizzes').insert(simplified);
        if (error2) console.error("Retry failed:", error2.message);
        else console.log(`Inserted chunk ${i} (simplified)`);
      }
    } else {
      console.log(`Inserted chunk ${i}`);
    }
  }
}

populate();
