const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const he = require('he');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CATEGORIES = [
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Technology' },
    { id: 23, name: 'History' },
    { id: 11, name: 'Film' },
    { id: 12, name: 'Music' },
    { id: 9, name: 'General Knowledge' },
    { id: 20, name: 'Mythology' },
    { id: 22, name: 'Geography' },
    { id: 21, name: 'Sports' }
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

async function populateQuestions() {
  console.log('Cleaning existing questions...');
  const { error: deleteError } = await supabase
    .from('quizzes')
    .delete()
    .neq('text', ''); // Delete all rows

  if (deleteError) {
    console.error('Error cleaning table:', deleteError);
    return;
  }

  const allInsertedQuestions = [];

  for (const category of CATEGORIES) {
    console.log(`Fetching 50 questions for ${category.name}...`);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=50&category=${category.id}&type=multiple`);
      const data = await response.json();

      if (data.response_code !== 0) {
        console.error(`OTDB returned error code ${data.response_code} for ${category.name}`);
        continue;
      }

      const questions = data.results.map(q => {
        const decodedQuestion = he.decode(q.question);
        const decodedCorrect = he.decode(q.correct_answer);
        const decodedIncorrect = q.incorrect_answers.map(ans => he.decode(ans));
        
        const options = shuffle([...decodedIncorrect, decodedCorrect]);
        const correctIndex = options.indexOf(decodedCorrect);

        return {
          text: decodedQuestion,
          options: options,
          correct_answer_index: correctIndex,
          category: category.name,
          difficulty: q.difficulty,
          points: q.difficulty === 'hard' ? 2000 : (q.difficulty === 'medium' ? 1000 : 500)
        };
      });

      allInsertedQuestions.push(...questions);
      
      // Add a small delay between categories to avoid rate limiting
      await sleep(2000);
    } catch (err) {
      console.error(`Failed to fetch for ${category.name}:`, err);
    }
  }

  console.log(`Total questions to insert: ${allInsertedQuestions.length}`);

  // Insert in chunks of 50
  const chunkSize = 50;
  for (let i = 0; i < allInsertedQuestions.length; i += chunkSize) {
    const chunk = allInsertedQuestions.slice(i, i + chunkSize);
    const { error } = await supabase.from('quizzes').insert(chunk);
    
    if (error) {
      console.error(`Error inserting chunk ${i/chunkSize + 1}:`, error.message);
    } else {
      console.log(`Inserted chunk ${i/chunkSize + 1}...`);
    }
  }

  console.log('Successfully populated database with real questions!');
}

populateQuestions();
