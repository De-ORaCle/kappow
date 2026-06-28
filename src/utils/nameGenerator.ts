/**
 * Playful name generator for Kapoww!
 * Provides 600+ unique Adjective + Noun combinations.
 */

const ADJECTIVES = [
  "Sassy", "Brave", "Giggling", "Turbo", "Majestic", "Dancing", "Sleepy", "Cool",
  "Spicy", "Wobbly", "Funky", "Bouncy", "Zesty", "Mighty", "Radiant", "Sneaky",
  "Cosmic", "Glitchy", "Happy", "Mega", "Super", "Wild", "Frosty", "Electric", "Fluffy"
];

const NOUNS = [
  "Squirrel", "Banana", "Ghost", "Turtle", "Muffin", "Dino", "Sloth", "Cucumber",
  "Taco", "Walrus", "Flamingo", "Bagel", "Panda", "Rocket", "Robot", "Ninja",
  "Wizard", "Unicorn", "Pizza", "Burrito", "Cactus", "Donut", "Noodle", "Kitten", "Dragon"
];

/**
 * Generates a random name from the pool.
 */
export const getRandomName = (): string => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
};

/**
 * Ensures the name is unique within the provided list.
 * If collision occurs, it appends a number or picks a new random one.
 */
export const getAvailableName = (requestedName: string, existingNames: string[]): string => {
  const cleanName = requestedName.trim();
  const lowerExisting = existingNames.map(n => n.toLowerCase());
  
  if (!lowerExisting.includes(cleanName.toLowerCase())) {
    return cleanName;
  }

  // Collision! Try appending a number
  const attemptWithNumber = `${cleanName} ${Math.floor(Math.random() * 98) + 2}`;
  if (!lowerExisting.includes(attemptWithNumber.toLowerCase())) {
    return attemptWithNumber;
  }

  // Still colliding? Just pick a random one that isn't taken
  let newName = getRandomName();
  let tries = 0;
  while (lowerExisting.includes(newName.toLowerCase()) && tries < 20) {
    newName = getRandomName();
    tries++;
  }

  return newName;
};
