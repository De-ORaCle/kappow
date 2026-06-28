import { supabase } from '../lib/supabase';
import { Question } from '../types';

export const quizService = {
  /**
   * Fetch a set of questions from the 'quizzes' table.
   */
  async getQuestions(categories: string[] = ['All'], excludeIds: string[] = []): Promise<Question[]> {
    let query = supabase.from('quizzes').select('*');
    
    if (!categories.includes('All')) {
      query = query.in('category', categories);
    }

    let { data, error } = await query.limit(2000);

    if (error) {
      console.error('Error fetching quizzes:', error.message);
      return [];
    }

    // Filter out excluded IDs
    let filteredData = (data || []).filter(q => !excludeIds.includes(q.id));

    // Fallback/Padding: If we don't have enough questions for the specific categories, pad from everything
    if (filteredData.length < 10) {
      console.warn(`Only ${filteredData.length} new questions found for categories: ${categories.join(', ')}. Padding to reach 10.`);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('quizzes')
        .select('*')
        .limit(2000);
      
      if (!fallbackError && fallbackData) {
        const existingIds = filteredData.map(q => q.id);
        const needed = 10 - existingIds.length;
        
        // Grab extra questions that aren't already in the list AND haven't been excluded
        const extraQuestions = fallbackData
          .filter(q => !existingIds.includes(q.id) && !excludeIds.includes(q.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, needed);
          
        // If we STILL don't have enough (exhausted all new questions globally), 
        // we might have to allow repeats as a last resort to not break the game.
        if (extraQuestions.length < needed) {
          console.warn('Exhausted all unplayed questions in the database. Allowing repeats to pad the game.');
          const stillNeeded = needed - extraQuestions.length;
          const repeatQuestions = fallbackData
             .filter(q => !existingIds.includes(q.id) && !extraQuestions.map(eq => eq.id).includes(q.id))
             .sort(() => Math.random() - 0.5)
             .slice(0, stillNeeded);
          
          extraQuestions.push(...repeatQuestions);
        }

        filteredData = [...filteredData, ...extraQuestions];
      }
    }

    // Shuffle and pick exactly 10 random ones for the session
    return filteredData
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(item => ({
        id: item.id,
        text: item.text,
        options: item.options,
        correctAnswerIndex: item.correct_answer_index,
        points: item.points,
        timeLimit: item.time_limit,
        category: item.category,
        difficulty: item.difficulty || 'medium'
      }));
  },

  /**
   * Fetch a specific set of questions by their IDs.
   */
  async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    if (!ids || ids.length === 0) return [];

    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .in('id', ids);

    if (error) {
      console.error('Error fetching questions by IDs:', error.message);
      return [];
    }

    // Ensure they are returned in the order of the provided IDs
    return ids.map(id => {
      const q = data.find(item => item.id === id);
      if (!q) return null;
      return {
        id: q.id,
        text: q.text,
        options: q.options,
        correctAnswerIndex: q.correct_answer_index,
        points: q.points,
        timeLimit: q.time_limit,
        category: q.category,
        difficulty: q.difficulty || 'medium'
      };
    }).filter((q): q is Question => q !== null);
  },

  /**
   * Push a final team score to the 'leaderboard' table.
   */
  async pushLeaderboardScore(teamName: string, score: number) {
    const { error } = await supabase
      .from('leaderboard')
      .insert([{ team_name: teamName, score }]);

    if (error) {
      console.error('Error pushing to leaderboard:', error.message);
      throw error;
    }
  }
};
