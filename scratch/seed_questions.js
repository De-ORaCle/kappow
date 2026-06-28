
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bmgwcgtaagbqvfsjdnby.supabase.co';
const supabaseAnonKey = 'sb_publishable_J_C_orH2PVY5IUUBaN_Sbw_knJZoCWv';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const NEW_QUESTIONS = [
  // Science & Nature
  { text: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "What is the hardest natural substance on Earth?", options: ["Gold", "Iron", "Diamond", "Quartz"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "Which planet is closest to the Sun?", options: ["Venus", "Mars", "Mercury", "Earth"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "What gas do plants absorb from the atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "How many teeth does an adult human normally have?", options: ["28", "30", "32", "34"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "What is the largest organ in the human body?", options: ["Heart", "Liver", "Skin", "Lungs"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "What is the chemical symbol for Gold?", options: ["Ag", "Gd", "Au", "Pb"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "Which animal is known as the 'King of the Jungle'?", options: ["Tiger", "Elephant", "Lion", "Gorilla"], correct_answer_index: 2, category: "Science & Nature" },
  { text: "What is the speed of light approximately?", options: ["150,000 km/s", "200,000 km/s", "300,000 km/s", "400,000 km/s"], correct_answer_index: 2, category: "Science & Nature" },

  // Technology
  { text: "Who is the co-founder of Microsoft?", options: ["Steve Jobs", "Mark Zuckerberg", "Bill Gates", "Jeff Bezos"], correct_answer_index: 2, category: "Technology" },
  { text: "What does 'WWW' stand for?", options: ["Wild Wide Web", "World Wired Web", "World Wide Web", "Web World Wide"], correct_answer_index: 2, category: "Technology" },
  { text: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], correct_answer_index: 2, category: "Technology" },
  { text: "Which company created the Android OS?", options: ["Apple", "Microsoft", "Google", "Samsung"], correct_answer_index: 2, category: "Technology" },
  { text: "What does CPU stand for?", options: ["Core Processing Unit", "Computer Personal Unit", "Central Processing Unit", "Central Power Unit"], correct_answer_index: 2, category: "Technology" },
  { text: "Who is known as the 'Father of the Computer'?", options: ["Alan Turing", "Ada Lovelace", "Charles Babbage", "Bill Gates"], correct_answer_index: 2, category: "Technology" },
  { text: "Which programming language is predominantly used for Data Science?", options: ["Java", "C++", "Python", "Swift"], correct_answer_index: 2, category: "Technology" },
  { text: "What does 'HTTP' stand for?", options: ["Hypertext Transfer Plus", "Hypertext Type Protocol", "Hypertext Transfer Protocol", "High Transfer Tech Protocol"], correct_answer_index: 2, category: "Technology" },
  { text: "What is the largest social media platform by user count?", options: ["Instagram", "Twitter", "Facebook", "TikTok"], correct_answer_index: 2, category: "Technology" },

  // History
  { text: "Who was the first President of the United States?", options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], correct_answer_index: 2, category: "History" },
  { text: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], correct_answer_index: 2, category: "History" },
  { text: "Who built the Great Pyramid of Giza?", options: ["Tutankhamun", "Ramses II", "Khufu", "Cleopatra"], correct_answer_index: 2, category: "History" },
  { text: "What was the name of the ship that sank in 1912?", options: ["Britannic", "Olympic", "Titanic", "Lusitania"], correct_answer_index: 2, category: "History" },
  { text: "Who was the first woman to win a Nobel Prize?", options: ["Mother Teresa", "Rosa Parks", "Marie Curie", "Jane Addams"], correct_answer_index: 2, category: "History" },
  { text: "In which country did the Renaissance begin?", options: ["France", "Spain", "Italy", "Greece"], correct_answer_index: 2, category: "History" },
  { text: "Who was the leader of the Soviet Union during WWII?", options: ["Vladimir Lenin", "Leon Trotsky", "Joseph Stalin", "Nikita Khrushchev"], correct_answer_index: 2, category: "History" },
  { text: "What year did the Berlin Wall fall?", options: ["1987", "1988", "1989", "1990"], correct_answer_index: 2, category: "History" },
  { text: "Who was the primary author of the U.S. Declaration of Independence?", options: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "Alexander Hamilton"], correct_answer_index: 2, category: "History" },

  // Pop Culture
  { text: "Who played Iron Man in the Marvel Cinematic Universe?", options: ["Chris Evans", "Chris Hemsworth", "Robert Downey Jr.", "Mark Ruffalo"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "What is the highest-grossing film of all time?", options: ["Titanic", "Avengers: Endgame", "Avatar", "Star Wars: Ep VII"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "Which artist released the album 'Thriller'?", options: ["Prince", "Elvis Presley", "Michael Jackson", "Madonna"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "What is the name of the fictional city in 'The Simpsons'?", options: ["Quahog", "South Park", "Springfield", "Shelbyville"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "Who is known as the 'Queen of Pop'?", options: ["Beyoncé", "Lady Gaga", "Madonna", "Britney Spears"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "Which movie features the quote 'I'm the king of the world!'?", options: ["The Lion King", "Forrest Gump", "Titanic", "Braveheart"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "What is the most-streamed song on Spotify of all time?", options: ["Shape of You", "Starboy", "Blinding Lights", "Someone You Loved"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "Who won the very first season of American Idol?", options: ["Carrie Underwood", "Adam Lambert", "Kelly Clarkson", "Jennifer Hudson"], correct_answer_index: 2, category: "Pop Culture" },
  { text: "What is the name of Han Solo's ship?", options: ["Star Destroyer", "Enterprise", "Millennium Falcon", "X-Wing"], correct_answer_index: 2, category: "Pop Culture" },

  // Geography
  { text: "What is the smallest country in the world?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], correct_answer_index: 2, category: "Geography" },
  { text: "Which is the largest desert in the world?", options: ["Sahara Desert", "Gobi Desert", "Antarctic Desert", "Arabian Desert"], correct_answer_index: 2, category: "Geography" },
  { text: "What is the capital of Japan?", options: ["Kyoto", "Osaka", "Tokyo", "Hiroshima"], correct_answer_index: 2, category: "Geography" },
  { text: "Which river is the longest in the world?", options: ["Amazon", "Yangtze", "Nile", "Mississippi"], correct_answer_index: 2, category: "Geography" },
  { text: "What is the tallest mountain in the world?", options: ["K2", "Mount Kilimanjaro", "Mount Everest", "Mount Fuji"], correct_answer_index: 2, category: "Geography" },
  { text: "In which ocean is the Bermuda Triangle located?", options: ["Pacific Ocean", "Indian Ocean", "Atlantic Ocean", "Arctic Ocean"], correct_answer_index: 2, category: "Geography" },
  { text: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct_answer_index: 2, category: "Geography" },
  { text: "Which country has the most natural lakes?", options: ["USA", "Russia", "Canada", "China"], correct_answer_index: 2, category: "Geography" },
  { text: "What is the largest island in the world?", options: ["Australia", "New Guinea", "Greenland", "Borneo"], correct_answer_index: 2, category: "Geography" },

  // Sports
  { text: "How many players are on a soccer team on the field at once?", options: ["10", "12", "11", "9"], correct_answer_index: 2, category: "Sports" },
  { text: "Which country has won the most FIFA World Cups?", options: ["Germany", "Italy", "Brazil", "Argentina"], correct_answer_index: 2, category: "Sports" },
  { text: "Who is widely considered the G.O.A.T. of basketball?", options: ["LeBron James", "Kobe Bryant", "Michael Jordan", "Shaq"], correct_answer_index: 2, category: "Sports" },
  { text: "What is the diameter of a basketball hoop?", options: ["16 inches", "17 inches", "18 inches", "19 inches"], correct_answer_index: 2, category: "Sports" },
  { text: "In which city were the first modern Olympic Games held?", options: ["Paris", "London", "Athens", "Rome"], correct_answer_index: 2, category: "Sports" },
  { text: "How many rings are on the Olympic flag?", options: ["4", "6", "5", "7"], correct_answer_index: 2, category: "Sports" },
  { text: "Who holds the record for most Olympic Gold Medals?", options: ["Usain Bolt", "Carl Lewis", "Michael Phelps", "Larisa Latynina"], correct_answer_index: 2, category: "Sports" },
  { text: "In golf, what is the term for being three strokes under par?", options: ["Eagle", "Birdie", "Albatross", "Bogey"], correct_answer_index: 2, category: "Sports" },
  { text: "Which sport uses a shuttlecock?", options: ["Tennis", "Squash", "Badminton", "Table Tennis"], correct_answer_index: 2, category: "Sports" }
];

async function seed() {
  console.log(`Starting seed of ${NEW_QUESTIONS.length} questions...`);
  try {
    const { data, error } = await supabase.from('quizzes').insert(NEW_QUESTIONS);
    if (error) throw error;
    console.log('Seed successful!');
  } catch (err) {
    console.error('Seed failed:', err.message);
  }
}

seed();
