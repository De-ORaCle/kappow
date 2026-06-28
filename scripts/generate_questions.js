import fs from 'fs';
import path from 'path';

// This script generates exactly 250 questions: 125 Math and 125 English
// It outputs them in scripts/batches/batch_11.json

const mathQuestions = [];
const englishQuestions = [];

// ==========================================
// 1. GENERATE MATH QUESTIONS (125 total)
// ==========================================

// Helper: Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper: Generate unique options (1 correct + 3 unique distractors)
function createMathOptions(correctVal, diffRange = 10, relativeDistractors = []) {
  const correctStr = String(correctVal);
  const distractors = new Set();
  
  // Add predefined relative distractors if available
  relativeDistractors.forEach(val => {
    if (val !== correctVal) distractors.add(String(val));
  });

  // Supplement with random distractors near the correct answer
  while (distractors.size < 3) {
    const offset = Math.floor(Math.random() * (diffRange * 2 + 1)) - diffRange;
    if (offset !== 0) {
      const option = correctVal + offset;
      if (option >= 0) distractors.add(String(option));
    }
  }

  const optionsList = Array.from(distractors).slice(0, 3);
  optionsList.push(correctStr);
  
  const shuffled = shuffle(optionsList);
  const correctIdx = shuffled.indexOf(correctStr);
  return { options: shuffled, correctIndex: correctIdx };
}

// --- Math Easy: 50 Questions (20s limit, 1000 pts) ---
const generatedMathEasy = new Set();

// 1. Addition (15 questions)
while (mathQuestions.length < 15) {
  const a = Math.floor(Math.random() * 80) + 10;
  const b = Math.floor(Math.random() * 80) + 10;
  const qText = `What is ${a} + ${b}?`;
  if (generatedMathEasy.has(qText)) continue;
  generatedMathEasy.add(qText);
  
  const correct = a + b;
  const { options, correctIndex } = createMathOptions(correct, 12, [correct + 10, correct - 10, correct + 2, correct - 2]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1000,
    time_limit: 20,
    category: "Math",
    difficulty: "easy"
  });
}

// 2. Subtraction (15 questions)
while (mathQuestions.length < 30) {
  const a = Math.floor(Math.random() * 100) + 30;
  const b = Math.floor(Math.random() * (a - 10)) + 5;
  const qText = `What is ${a} - ${b}?`;
  if (generatedMathEasy.has(qText)) continue;
  generatedMathEasy.add(qText);
  
  const correct = a - b;
  const { options, correctIndex } = createMathOptions(correct, 12, [correct + 10, correct - 10, correct + 1, correct - 1]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1000,
    time_limit: 20,
    category: "Math",
    difficulty: "easy"
  });
}

// 3. Multiplication (10 questions)
while (mathQuestions.length < 40) {
  const a = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const b = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const qText = `What is ${a} × ${b}?`;
  if (generatedMathEasy.has(qText)) continue;
  generatedMathEasy.add(qText);
  
  const correct = a * b;
  const { options, correctIndex } = createMathOptions(correct, 10, [correct + a, correct - b, correct + 5, correct + 10]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1000,
    time_limit: 20,
    category: "Math",
    difficulty: "easy"
  });
}

// 4. Division (10 questions)
while (mathQuestions.length < 50) {
  const b = Math.floor(Math.random() * 8) + 2; // divisor: 2 to 9
  const correct = Math.floor(Math.random() * 8) + 2; // quotient: 2 to 9
  const a = b * correct; // dividend
  const qText = `What is ${a} ÷ ${b}?`;
  if (generatedMathEasy.has(qText)) continue;
  generatedMathEasy.add(qText);
  
  const { options, correctIndex } = createMathOptions(correct, 5, [correct + 1, correct - 1, correct + 2]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1000,
    time_limit: 20,
    category: "Math",
    difficulty: "easy"
  });
}

// --- Math Medium: 50 Questions (30s limit, 1200 pts) ---
const generatedMathMedium = new Set();

// 1. Algebra: Ax + B = C (15 questions)
while (mathQuestions.length < 65) {
  const a = Math.floor(Math.random() * 6) + 2; // 2 to 7
  const x = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const b = Math.floor(Math.random() * 12) + 2; // 2 to 13
  const isPlus = Math.random() > 0.5;
  
  let c, qText;
  if (isPlus) {
    c = a * x + b;
    qText = `Solve for x: ${a}x + ${b} = ${c}`;
  } else {
    c = a * x - b;
    qText = `Solve for x: ${a}x - ${b} = ${c}`;
  }
  
  if (generatedMathMedium.has(qText)) continue;
  generatedMathMedium.add(qText);
  
  const { options, correctIndex } = createMathOptions(x, 4, [x + 1, x - 1, x + 2, x * 2]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1200,
    time_limit: 30,
    category: "Math",
    difficulty: "medium"
  });
}

// 2. Percentages (15 questions)
const percentageOptions = [10, 20, 25, 30, 40, 50, 75, 80, 90];
while (mathQuestions.length < 80) {
  const p = percentageOptions[Math.floor(Math.random() * percentageOptions.length)];
  // Choose value to be a multiple of 100 or a smart multiple
  const v = (Math.floor(Math.random() * 9) + 1) * (p % 25 === 0 ? 40 : 100);
  const qText = `What is ${p}% of ${v}?`;
  if (generatedMathMedium.has(qText)) continue;
  generatedMathMedium.add(qText);
  
  const correct = (p * v) / 100;
  const { options, correctIndex } = createMathOptions(correct, correct > 30 ? 20 : 5, [correct + 10, correct - 10, correct * 2, correct / 2]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1200,
    time_limit: 30,
    category: "Math",
    difficulty: "medium"
  });
}

// 3. Geometry: Rectangles and Squares (10 questions)
while (mathQuestions.length < 90) {
  const type = Math.random() > 0.5 ? 'area_rect' : 'perim_rect';
  let qText, correct, relativeList;
  
  if (type === 'area_rect') {
    const l = Math.floor(Math.random() * 8) + 5; // 5 to 12
    const w = Math.floor(Math.random() * (l - 2)) + 3; // 3 to l-1
    qText = `What is the area of a rectangle with length ${l} cm and width ${w} cm?`;
    correct = l * w;
    relativeList = [l + w, 2 * (l + w), correct + 5, correct - 5];
  } else {
    const l = Math.floor(Math.random() * 8) + 5;
    const w = Math.floor(Math.random() * (l - 2)) + 3;
    qText = `What is the perimeter of a rectangle with length ${l} cm and width ${w} cm?`;
    correct = 2 * (l + w);
    relativeList = [l * w, l + w, correct + 4, correct - 4];
  }
  
  if (generatedMathMedium.has(qText)) continue;
  generatedMathMedium.add(qText);
  
  const { options, correctIndex } = createMathOptions(correct, 15, relativeList);
  
  mathQuestions.push({
    text: qText,
    options: options.map(o => `${o} cm²`), // Add units dynamically
    correct_answer_index: correctIndex,
    points: 1200,
    time_limit: 30,
    category: "Math",
    difficulty: "medium"
  });
}

// 4. Fractions & Ratios (10 questions)
while (mathQuestions.length < 100) {
  const b = Math.floor(Math.random() * 5) + 3; // 3 to 7
  const a = Math.floor(Math.random() * (b - 1)) + 1; // 1 to b-1
  const multiplier = Math.floor(Math.random() * 6) + 3; // 3 to 8
  const c = b * multiplier;
  
  const qText = `What is ${a}/${b} of ${c}?`;
  if (generatedMathMedium.has(qText)) continue;
  generatedMathMedium.add(qText);
  
  const correct = a * multiplier;
  const { options, correctIndex } = createMathOptions(correct, 8, [correct + multiplier, correct - multiplier, correct + a, correct * 2]);
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIndex,
    points: 1200,
    time_limit: 30,
    category: "Math",
    difficulty: "medium"
  });
}

// --- Math Hard: 25 Questions (40s limit, 1500 pts) ---
const generatedMathHard = new Set();

// 1. Sequence Completion (8 questions)
const sequences = [
  { seq: "2, 4, 8, 16, ...", correct: 32, distractors: [24, 30, 64] },
  { seq: "3, 9, 27, 81, ...", correct: 243, distractors: [162, 108, 729] },
  { seq: "1, 4, 9, 16, 25, ...", correct: 36, distractors: [30, 35, 49] },
  { seq: "4, 9, 16, 25, 36, ...", correct: 49, distractors: [45, 48, 64] },
  { seq: "1, 1, 2, 3, 5, 8, ...", correct: 13, distractors: [10, 11, 12] },
  { seq: "1, 2, 3, 5, 8, 13, ...", correct: 21, distractors: [18, 19, 20] },
  { seq: "2, 3, 5, 7, 11, ...", correct: 13, distractors: [12, 14, 15] },
  { seq: "3, 5, 7, 11, 13, ...", correct: 17, distractors: [15, 16, 19] }
];

sequences.forEach(s => {
  const qText = `What is the next number in the sequence: ${s.seq}?`;
  const options = shuffle([...s.distractors.map(String), String(s.correct)]);
  const correctIdx = options.indexOf(String(s.correct));
  
  mathQuestions.push({
    text: qText,
    options,
    correct_answer_index: correctIdx,
    points: 1500,
    time_limit: 40,
    category: "Math",
    difficulty: "hard"
  });
  generatedMathHard.add(qText);
});

// 2. Square roots, quadratics, and exponents (8 questions)
const hardExponents = [
  { q: "If x² = 144, what is the positive value of x?", ans: 12, range: 4, extra: [14, 10, 24] },
  { q: "If x² = 169, what is the positive value of x?", ans: 13, range: 4, extra: [14, 15, 17] },
  { q: "If x² = 225, what is the positive value of x?", ans: 15, range: 4, extra: [25, 5, 12] },
  { q: "Solve for x: x² - 10 = 26", ans: 6, range: 3, extra: [8, 4, 36] },
  { q: "Solve for x: x² - 5 = 95", ans: 10, range: 3, extra: [9, 11, 100] },
  { q: "If 2^x = 64, what is the value of x?", ans: 6, range: 3, extra: [5, 7, 8] },
  { q: "If 2^x = 128, what is the value of x?", ans: 7, range: 3, extra: [6, 8, 9] },
  { q: "If 3^x = 81, what is the value of x?", ans: 4, range: 2, extra: [3, 5, 9] }
];

hardExponents.forEach(he => {
  const { options, correctIndex } = createMathOptions(he.ans, he.range, he.extra);
  mathQuestions.push({
    text: he.q,
    options,
    correct_answer_index: correctIndex,
    points: 1500,
    time_limit: 40,
    category: "Math",
    difficulty: "hard"
  });
  generatedMathHard.add(he.q);
});

// 3. Logic and Word Problems (9 questions)
const hardWordProblems = [
  {
    q: "A shirt is discounted by 20%. If the sale price is $40, what was the original price?",
    ans: "$50",
    opts: ["$48", "$50", "$60", "$45"]
  },
  {
    q: "A laptop is discounted by 15%. If the sale price is $340, what was the original price?",
    ans: "$400",
    opts: ["$380", "$390", "$400", "$420"]
  },
  {
    q: "A bag contains 3 red balls and 5 blue balls. If you draw one ball at random, what is the probability of drawing a red ball?",
    ans: "3/8",
    opts: ["3/5", "3/8", "5/8", "1/2"]
  },
  {
    q: "If a car travels at a constant speed of 60 mph, how many miles does it travel in 45 minutes?",
    ans: "45 miles",
    opts: ["40 miles", "45 miles", "50 miles", "30 miles"]
  },
  {
    q: "If a car travels at a constant speed of 80 mph, how many miles does it travel in 45 minutes?",
    ans: "60 miles",
    opts: ["50 miles", "60 miles", "70 miles", "40 miles"]
  },
  {
    q: "What is the sum of the first 10 positive integers?",
    ans: "55",
    opts: ["45", "50", "55", "60"]
  },
  {
    q: "What is the sum of the first 20 positive integers?",
    ans: "210",
    opts: ["190", "200", "210", "220"]
  },
  {
    q: "If 3x + 5 = 20, what is the value of 6x + 10?",
    ans: "40",
    opts: ["30", "35", "40", "50"]
  },
  {
    q: "What is the average (mean) of the numbers: 12, 15, 18, 21, and 24?",
    ans: "18",
    opts: ["16", "17", "18", "19"]
  }
];

hardWordProblems.forEach(wp => {
  const shuffledOpts = shuffle(wp.opts);
  const correctIdx = shuffledOpts.indexOf(wp.ans);
  
  mathQuestions.push({
    text: wp.q,
    options: shuffledOpts,
    correct_answer_index: correctIdx,
    points: 1500,
    time_limit: 40,
    category: "Math",
    difficulty: "hard"
  });
  generatedMathHard.add(wp.q);
});


// ==========================================
// 2. DEFINE ENGLISH QUESTIONS (125 total)
// ==========================================

// --- English Easy: 50 Questions (20s limit, 1000 pts) ---
const rawEnglishEasy = [
  { q: "Which of the following is the correct spelling?", ans: "Receipt", opts: ["Reciept", "Receipt", "Receit", "Recept"] },
  { q: "Which of the following is the correct spelling?", ans: "Definitely", opts: ["Definately", "Definitely", "Definitley", "Definitly"] },
  { q: "Which of the following is the correct spelling?", ans: "Separate", opts: ["Seperate", "Separate", "Seprate", "Saparate"] },
  { q: "Which of the following is the correct spelling?", ans: "Accommodate", opts: ["Acomodate", "Accomodate", "Acommodate", "Accommodate"] },
  { q: "Which of the following is the correct spelling?", ans: "Necessary", opts: ["Neccesary", "Necessary", "Necessery", "Neccessary"] },
  { q: "Which of the following is the correct spelling?", ans: "Calendar", opts: ["Calender", "Calendar", "Calandar", "Calander"] },
  { q: "Which of the following is the correct spelling?", ans: "Embarrass", opts: ["Embaras", "Embarass", "Embarras", "Embarrass"] },
  { q: "Which of the following is the correct spelling?", ans: "Until", opts: ["Untill", "Until", "Untle", "Untal"] },
  { q: "Which of the following is the correct spelling?", ans: "Bizarre", opts: ["Bizarre", "Bizzare", "Bisarre", "Bissare"] },
  { q: "Which of the following is the correct spelling?", ans: "Liaison", opts: ["Liason", "Liaison", "Liasion", "Liaisonn"] },

  { q: "What is a synonym of 'Happy'?", ans: "Cheerful", opts: ["Sad", "Gloomy", "Cheerful", "Angry"] },
  { q: "What is a synonym of 'Angry'?", ans: "Furious", opts: ["Furious", "Calm", "Peaceful", "Happy"] },
  { q: "What is a synonym of 'Large'?", ans: "Huge", opts: ["Tiny", "Huge", "Small", "Short"] },
  { q: "What is a synonym of 'Quick'?", ans: "Rapid", opts: ["Slow", "Rapid", "Heavy", "Steady"] },
  { q: "What is a synonym of 'Smart'?", ans: "Intelligent", opts: ["Dull", "Foolish", "Intelligent", "Slow"] },
  { q: "What is a synonym of 'Brave'?", ans: "Courageous", opts: ["Cowardly", "Timid", "Fearful", "Courageous"] },
  { q: "What is a synonym of 'Beautiful'?", ans: "Gorgeous", opts: ["Ugly", "Plain", "Gorgeous", "Rough"] },
  { q: "What is a synonym of 'Tired'?", ans: "Exhausted", opts: ["Energetic", "Exhausted", "Active", "Fresh"] },
  { q: "What is a synonym of 'Quiet'?", ans: "Silent", opts: ["Loud", "Noisy", "Silent", "Rowdy"] },
  { q: "What is a synonym of 'Sincere'?", ans: "Genuine", opts: ["Fake", "Genuine", "Dishonest", "False"] },

  { q: "What is the antonym of 'Generous'?", ans: "Stingy", opts: ["Kind", "Stingy", "Helpful", "Giving"] },
  { q: "What is the antonym of 'Ancient'?", ans: "Modern", opts: ["Old", "Historic", "Modern", "Classic"] },
  { q: "What is the antonym of 'Victory'?", ans: "Defeat", opts: ["Win", "Success", "Triumph", "Defeat"] },
  { q: "What is the antonym of 'Ascend'?", ans: "Descend", opts: ["Climb", "Rise", "Descend", "Soar"] },
  { q: "What is the antonym of 'Fragile'?", ans: "Sturdy", opts: ["Weak", "Delicate", "Brittle", "Sturdy"] },
  { q: "What is the antonym of 'Optimistic'?", ans: "Pessimistic", opts: ["Pessimistic", "Cheerful", "Positive", "Hopeful"] },
  { q: "What is the antonym of 'Vague'?", ans: "Clear", opts: ["Unclear", "Blurry", "Fuzzy", "Clear"] },
  { q: "What is the antonym of 'Hostile'?", ans: "Friendly", opts: ["Aggressive", "Friendly", "Angry", "Mean"] },
  { q: "What is the antonym of 'Arrogant'?", ans: "Humble", opts: ["Proud", "Humble", "Boastful", "Conceited"] },
  { q: "What is the antonym of 'Bold'?", ans: "Timid", opts: ["Brave", "Daring", "Fearless", "Timid"] },

  { q: "Identify the pronoun in the sentence: 'She walked to the grocery store.'", ans: "She", opts: ["walked", "She", "store", "grocery"] },
  { q: "Identify the pronoun in the sentence: 'They bought a new house.'", ans: "They", opts: ["bought", "house", "new", "They"] },
  { q: "Identify the verb in the sentence: 'The children laughed out loud.'", ans: "laughed", opts: ["children", "loud", "laughed", "out"] },
  { q: "Identify the adjective in the sentence: 'A beautiful bird sang a song.'", ans: "beautiful", opts: ["beautiful", "bird", "sang", "song"] },
  { q: "Identify the noun in the sentence: 'Happiness is important.'", ans: "Happiness", opts: ["important", "is", "Happiness", "very"] },
  { q: "Identify the adverb in the sentence: 'He runs very quickly.'", ans: "quickly", opts: ["runs", "very", "quickly", "He"] },
  { q: "Choose the correct plural form of 'Child'.", ans: "Children", opts: ["Childs", "Children", "Childrens", "Childes"] },
  { q: "Choose the correct plural form of 'Mouse'.", ans: "Mice", opts: ["Mouses", "Mice", "Mices", "Mousees"] },
  { q: "Choose the correct plural form of 'Tooth'.", ans: "Teeth", opts: ["Tooths", "Teeth", "Teeths", "Toothes"] },
  { q: "Choose the correct plural form of 'Goose'.", ans: "Geese", opts: ["Gooses", "Geese", "Geeses", "Goosees"] },

  { q: "Complete the sentence: 'Neither of the boys ___ finished his homework.'", ans: "has", opts: ["have", "has", "are", "were"] },
  { q: "Complete the sentence: 'Each of the students ___ received a booklet.'", ans: "has", opts: ["have", "has", "are", "were"] },
  { q: "Complete the sentence: 'The group of players ___ training hard.'", ans: "is", opts: ["are", "is", "were", "be"] },
  { q: "Choose the correct article: 'She has ___ unique style.'", ans: "a", opts: ["a", "an", "the", "no article needed"] },
  { q: "Choose the correct article: 'He wants to buy ___ honest dog.'", ans: "an", opts: ["a", "an", "the", "no article needed"] },
  { q: "Complete the sentence: 'I am looking forward to ___ you.'", ans: "meeting", opts: ["meet", "met", "meeting", "have met"] },
  { q: "Complete the sentence: 'She went to the store ___ buy some milk.'", ans: "to", opts: ["for", "to", "at", "by"] },
  { q: "Complete the sentence: 'They have been living here ___ five years.'", ans: "for", opts: ["since", "for", "during", "while"] },
  { q: "Complete the sentence: 'He has been sick ___ last Monday.'", ans: "since", opts: ["for", "since", "from", "during"] },
  { q: "Identify the conjunction in: 'I wanted to go, but it was raining.'", ans: "but", opts: ["wanted", "but", "it", "raining"] }
];

rawEnglishEasy.forEach(item => {
  const shuffledOpts = shuffle(item.opts);
  const correctIdx = shuffledOpts.indexOf(item.ans);
  englishQuestions.push({
    text: item.q,
    options: shuffledOpts,
    correct_answer_index: correctIdx,
    points: 1000,
    time_limit: 20,
    category: "English",
    difficulty: "easy"
  });
});

// --- English Medium: 50 Questions (25s limit, 1200 pts) ---
const rawEnglishMedium = [
  { q: "What is the meaning of the word 'Meticulous'?", ans: "Showing great attention to detail", opts: ["Extremely dirty", "Showing great attention to detail", "Fast and careless", "Always late"] },
  { q: "What is the meaning of the word 'Ephemeral'?", ans: "Lasting for a very short time", opts: ["Lasting for a very short time", "Strong and durable", "Highly emotional", "Intelligent"] },
  { q: "What is the meaning of the word 'Ubiquitous'?", ans: "Found everywhere", opts: ["Found everywhere", "Extremely rare", "Highly dangerous", "Very quiet"] },
  { q: "What is the meaning of the word 'Redundant'?", ans: "No longer needed or useful", opts: ["Extremely valuable", "No longer needed or useful", "Highly creative", "Boring"] },
  { q: "What is the meaning of the word 'Volatile'?", ans: "Liable to change rapidly and unpredictably", opts: ["Liable to change rapidly and unpredictably", "Extremely calm", "Very heavy", "Slow-moving"] },
  { q: "What is the meaning of the word 'Benevolent'?", ans: "Well-meaning and kindly", opts: ["Cruel and hateful", "Well-meaning and kindly", "Highly intelligent", "Extremely wealthy"] },
  { q: "What is the meaning of the word 'Candid'?", ans: "Truthful and straightforward", opts: ["Deceitful and sneaky", "Sweet and sugary", "Truthful and straightforward", "Shy and quiet"] },
  { q: "What is the meaning of the word 'Scrutinize'?", ans: "Examine closely and thoroughly", opts: ["Ignore completely", "Examine closely and thoroughly", "Clean quickly", "Create beautifully"] },
  { q: "What is the meaning of the word 'Mitigate'?", ans: "Make less severe, serious, or painful", opts: ["Make worse", "Make less severe, serious, or painful", "Celebrate loudly", "Hide away"] },
  { q: "What is the meaning of the word 'Pragmatic'?", ans: "Dealing with things sensibly and realistically", opts: ["Highly emotional", "Dealing with things sensibly and realistically", "Extremely artistic", "Lazy"] },

  { q: "What is the meaning of the idiom 'Bite the bullet'?", ans: "Face a difficult situation with courage", opts: ["Make a foolish mistake", "Face a difficult situation with courage", "Eat something hard", "Start a fight"] },
  { q: "What is the meaning of the idiom 'Spill the beans'?", ans: "Reveal a secret", opts: ["Cook a meal", "Reveal a secret", "Make a mess", "Tell a lie"] },
  { q: "What is the meaning of the idiom 'Break the ice'?", ans: "Relieve tension in a social setting", opts: ["Start an argument", "Relieve tension in a social setting", "Destroy property", "Go swimming"] },
  { q: "What is the meaning of the idiom 'Cost an arm and a leg'?", ans: "Be extremely expensive", opts: ["Be extremely painful", "Be extremely expensive", "Be a fair trade", "Be a medical emergency"] },
  { q: "What is the meaning of the idiom 'A blessing in disguise'?", ans: "A good thing that seemed bad at first", opts: ["A religious event", "A good thing that seemed bad at first", "A hidden danger", "A magic trick"] },
  { q: "What is the meaning of the idiom 'Under the weather'?", ans: "Feeling slightly unwell", opts: ["Standing in the rain", "Feeling slightly unwell", "Very happy", "In a safe place"] },
  { q: "What is the meaning of the idiom 'Burn the midnight oil'?", ans: "Work late into the night", opts: ["Waste electricity", "Work late into the night", "Start a fire", "Cook dinner"] },
  { q: "What is the meaning of the idiom 'Piece of cake'?", ans: "Something that is very easy", opts: ["A delicious dessert", "Something that is very easy", "A small portion", "A difficult task"] },
  { q: "What is the meaning of the idiom 'Through thick and thin'?", ans: "Under all circumstances, good or bad", opts: ["Losing weight", "Under all circumstances, good or bad", "Between two walls", "In a dense forest"] },
  { q: "What is the meaning of the idiom 'Beat around the bush'?", ans: "Avoid saying what you mean directly", opts: ["Clear some weeds", "Avoid saying what you mean directly", "Sing loudly", "Hit a target"] },

  { q: "Which figure of speech is: 'The stars danced playfully in the moonlit sky'?", ans: "Personification", opts: ["Metaphor", "Simile", "Personification", "Alliteration"] },
  { q: "Which figure of speech is: 'He was a lion in the fight'?", ans: "Metaphor", opts: ["Simile", "Metaphor", "Hyperbole", "Onomatopoeia"] },
  { q: "Which figure of speech is: 'Her cheeks were red like a rose'?", ans: "Simile", opts: ["Metaphor", "Simile", "Alliteration", "Allusion"] },
  { q: "Which figure of speech is: 'Peter Piper picked a peck of pickled peppers'?", ans: "Alliteration", opts: ["Alliteration", "Assonance", "Simile", "Hyperbole"] },
  { q: "Which figure of speech is: 'I am so hungry I could eat a horse'?", ans: "Hyperbole", opts: ["Metaphor", "Hyperbole", "Simile", "Personification"] },
  { q: "Which figure of speech is: 'The buzzing bee flew away'?", ans: "Onomatopoeia", opts: ["Onomatopoeia", "Alliteration", "Metaphor", "Hyperbole"] },
  { q: "Which figure of speech is: 'This is a fine mess you've got us into'?", ans: "Irony", opts: ["Irony", "Simile", "Metaphor", "Alliteration"] },
  { q: "Which figure of speech is: 'Parting is such sweet sorrow'?", ans: "Oxymoron", opts: ["Hyperbole", "Oxymoron", "Simile", "Alliteration"] },
  { q: "Which figure of speech is: 'He was a good Samaritan'?", ans: "Allusion", opts: ["Simile", "Allusion", "Alliteration", "Onomatopoeia"] },
  { q: "Which figure of speech is: 'The wind whispered through the trees'?", ans: "Personification", opts: ["Metaphor", "Personification", "Simile", "Hyperbole"] },

  { q: "Identify the preposition in the sentence: 'She walked through the dense forest.'", ans: "through", opts: ["walked", "through", "dense", "forest"] },
  { q: "Identify the preposition in the sentence: 'The cat jumped over the fence.'", ans: "over", opts: ["cat", "jumped", "over", "fence"] },
  { q: "Identify the preposition in the sentence: 'He sat beside the fireplace.'", ans: "beside", opts: ["sat", "beside", "fireplace", "He"] },
  { q: "Identify the preposition in the sentence: 'The plane flew above the clouds.'", ans: "above", opts: ["plane", "flew", "above", "clouds"] },
  { q: "Identify the preposition in the sentence: 'We walked along the beach.'", ans: "along", opts: ["walked", "along", "beach", "We"] },
  { q: "Choose the correct preposition: 'She is good ___ playing chess.'", ans: "at", opts: ["in", "at", "on", "with"] },
  { q: "Choose the correct preposition: 'He is interested ___ studying history.'", ans: "in", opts: ["in", "at", "on", "with"] },
  { q: "Choose the correct preposition: 'They are accused ___ committing a crime.'", ans: "of", opts: ["of", "for", "with", "by"] },
  { q: "Choose the correct preposition: 'She is afraid ___ spiders.'", ans: "of", opts: ["of", "by", "from", "at"] },
  { q: "Choose the correct preposition: 'He congratulated me ___ my success.'", ans: "on", opts: ["for", "on", "at", "with"] },

  { q: "Complete the sentence: 'If I ___ you, I would take that offer.'", ans: "were", opts: ["was", "were", "am", "be"] },
  { q: "Complete the sentence: 'He speaks English very well, ___?'", ans: "doesn't he", opts: ["isn't he", "doesn't he", "hasn't he", "won't he"] },
  { q: "Complete the sentence: 'They had already left when we ___.'", ans: "arrived", opts: ["arrived", "had arrived", "arrive", "were arriving"] },
  { q: "Choose the correct word: 'The drug has a strong ___ on the body.'", ans: "effect", opts: ["affect", "effect", "effects", "affects"] },
  { q: "Choose the correct word: 'How will this decision ___ our future?'", ans: "affect", opts: ["affect", "effect", "effects", "affects"] },
  { q: "Choose the correct word: 'Please ___ down on the sofa.'", ans: "lie", opts: ["lay", "lie", "laid", "lain"] },
  { q: "Choose the correct word: 'She ___ the book on the table yesterday.'", ans: "laid", opts: ["lay", "lie", "laid", "lain"] },
  { q: "Choose the correct punctuation mark to join independent clauses: 'I have a big test tomorrow ___ I need to study.'", ans: ";", opts: [",", ";", ":", "-"] },
  { q: "Which sentence uses the apostrophe correctly?", ans: "The two girls' coats were wet.", opts: ["The two girl's coats were wet.", "The two girls' coats were wet.", "The two girls coats' were wet.", "The two girls coat's were wet."] },
  { q: "Which sentence uses the apostrophe correctly?", ans: "It's a beautiful day outside.", opts: ["Its' a beautiful day outside.", "It's a beautiful day outside.", "Its a beautiful day outside.", "It'es a beautiful day outside."] }
];

rawEnglishMedium.forEach(item => {
  const shuffledOpts = shuffle(item.opts);
  const correctIdx = shuffledOpts.indexOf(item.ans);
  englishQuestions.push({
    text: item.q,
    options: shuffledOpts,
    correct_answer_index: correctIdx,
    points: 1200,
    time_limit: 25,
    category: "English",
    difficulty: "medium"
  });
});

// --- English Hard: 25 Questions (30s limit, 1500 pts) ---
const rawEnglishHard = [
  { q: "What is the synonym of 'Obsequious'?", ans: "Fawning", opts: ["Arrogant", "Fawning", "Aggressive", "Sincere"] },
  { q: "What is the synonym of 'Cacophony'?", ans: "Harsh sound", opts: ["Beautiful music", "Harsh sound", "Deep silence", "Loud conversation"] },
  { q: "What is the synonym of 'Egregious'?", ans: "Outstandingly bad", opts: ["Outstandingly bad", "Extremely intelligent", "Very helpful", "Unremarkable"] },
  { q: "What is the synonym of 'Loquacious'?", ans: "Talkative", opts: ["Quiet", "Talkative", "Fast-running", "Highly educated"] },
  { q: "What is the synonym of 'Fastidious'?", ans: "Very attentive to detail and accuracy", opts: ["Careless and messy", "Very attentive to detail and accuracy", "Extremely lazy", "Friendly"] },
  { q: "What is the synonym of 'Capricious'?", ans: "Fickle", opts: ["Fickle", "Steady", "Highly determined", "Angry"] },
  { q: "What is the synonym of 'Anachronism'?", ans: "Something out of its proper time", opts: ["Something out of its proper time", "A mathematical equation", "A severe illness", "A historical building"] },
  { q: "What is the synonym of 'Pernicious'?", ans: "Harmful", opts: ["Beneficial", "Harmful", "Rare", "Noisy"] },

  { q: "Complete the analogy: 'Aura is to Person as ___ is to Flower.'", ans: "Fragrance", opts: ["Petal", "Fragrance", "Stem", "Garden"] },
  { q: "Complete the analogy: 'Glance is to Look as ___ is to Speak.'", ans: "Whisper", opts: ["Whisper", "Shout", "Talk", "Sing"] },
  { q: "Complete the analogy: 'Odometer is to Distance as ___ is to Air Pressure.'", ans: "Barometer", opts: ["Thermometer", "Barometer", "Scale", "Altimeter"] },
  { q: "Complete the analogy: 'Malignant is to Harmful as ___ is to Harmless.'", ans: "Benign", opts: ["Benevolent", "Benign", "Malleable", "Obsolete"] },
  { q: "Complete the analogy: 'Penury is to Poverty as ___ is to Wealth.'", ans: "Affluence", opts: ["Affluence", "Greed", "Industry", "Sparsity"] },

  { q: "Who wrote the classic novel 'Moby-Dick'?", ans: "Herman Melville", opts: ["Nathaniel Hawthorne", "Herman Melville", "Mark Twain", "Edgar Allan Poe"] },
  { q: "Who wrote the dystopian novel '1984'?", ans: "George Orwell", opts: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "H.G. Wells"] },
  { q: "Who wrote 'The Great Gatsby'?", ans: "F. Scott Fitzgerald", opts: ["F. Scott Fitzgerald", "Ernest Hemingway", "William Faulkner", "John Steinbeck"] },
  { q: "Who wrote the epic poems 'The Iliad' and 'The Odyssey'?", ans: "Homer", opts: ["Virgil", "Homer", "Socrates", "Plato"] },
  { q: "Who is the author of 'Pride and Prejudice'?", ans: "Jane Austen", opts: ["Charlotte Bronte", "Emily Bronte", "Jane Austen", "Mary Shelley"] },
  { q: "In Shakespeare's 'Hamlet', what is the name of Hamlet's mother?", ans: "Gertrude", opts: ["Ophelia", "Gertrude", "Portia", "Desdemona"] },

  { q: "Choose the grammatically correct sentence.", ans: "Whom did you invite to the party?", opts: ["Who did you invite to the party?", "Whom did you invite to the party?", "To who did you invite to the party?", "Whom invited you to the party?"] },
  { q: "Choose the grammatically correct sentence.", ans: "She is taller than I.", opts: ["She is taller than me.", "She is taller than I.", "She is taller than myself.", "She is taller from me."] },
  { q: "Choose the grammatically correct sentence.", ans: "Everyone has to do his or her own work.", opts: ["Everyone has to do their own work.", "Everyone has to do his or her own work.", "Everyone has to do there own work.", "Everyone have to do their own work."] },
  { q: "Choose the grammatically correct sentence.", ans: "Between you and me, I don't trust him.", opts: ["Between you and I, I don't trust him.", "Between you and me, I don't trust him.", "Between you and myself, I don't trust him.", "Between we both, I don't trust him."] },
  { q: "Choose the grammatically correct sentence.", ans: "Having finished the report, he shut down the computer.", opts: ["Having finished the report, the computer was shut down.", "Having finished the report, he shut down the computer.", "Finishing the report, the computer was shut down by him.", "The report having finished, he shut down the computer."] },
  { q: "Which of the following describes a 'split infinitive'?", ans: "To boldly go", opts: ["To go boldly", "To boldly go", "Boldly to go", "Going boldly"] }
];

rawEnglishHard.forEach(item => {
  const shuffledOpts = shuffle(item.opts);
  const correctIdx = shuffledOpts.indexOf(item.ans);
  englishQuestions.push({
    text: item.q,
    options: shuffledOpts,
    correct_answer_index: correctIdx,
    points: 1500,
    time_limit: 30,
    category: "English",
    difficulty: "hard"
  });
});

// ==========================================
// 3. COMBINE AND WRITE TO BATCH_11.JSON
// ==========================================

const allQuestions = [...mathQuestions, ...englishQuestions];

const targetDir = path.resolve(process.cwd(), 'scripts', 'batches');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targetFile = path.join(targetDir, 'batch_11.json');
fs.writeFileSync(targetFile, JSON.stringify(allQuestions, null, 2), 'utf8');

console.log(`Generated ${mathQuestions.length} Math and ${englishQuestions.length} English questions.`);
console.log(`Successfully wrote ${allQuestions.length} questions to ${targetFile}`);
