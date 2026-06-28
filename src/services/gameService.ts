import { supabase } from '../lib/supabase';
import { Player } from '../types';

export const gameService = {
  /**
   * Create a new game session in Supabase.
   */
  async createSession(code: string, hostId: string, questionIds: string[] = []) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert([{ 
        code, 
        host_id: hostId, 
        status: 'lobby', 
        current_question_index: 0,
        question_ids: questionIds 
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating session:', error.message);
      throw error;
    }
    return data;
  },

  /**
   * Find a session by its unique room code.
   */
  async getSessionByCode(code: string) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();

    if (error) {
      console.error('Error finding session:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Find a session by its UUID.
   */
  async getSessionById(sessionId: string) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) {
      console.error('Error finding session by ID:', error.message);
      return null;
    }
    return data;
  },

  /**
   * Fetch all players currently in a session.
   */
  async getPlayers(sessionId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      console.error('Error fetching players:', error.message);
      return [];
    }

    return data.map(p => ({
      id: p.external_id,
      name: p.name,
      score: p.score,
      isHost: p.is_host,
      lastAnswerCorrect: p.last_answer_correct
    }));
  },

  /**
   * Add a player to an existing session.
   */
  async joinSession(sessionId: string, player: Player) {
    const { error } = await supabase
      .from('players')
      .insert([{ 
        session_id: sessionId, 
        external_id: player.id,
        name: player.name,
        is_host: player.isHost,
        score: player.score
      }]);

    if (error) {
      console.error('Error joining session:', error.message);
      throw error;
    }
  },

  /**
   * Update a player's score and status.
   */
  async updatePlayerScore(sessionId: string, externalId: string, updates: { score?: number; last_answer_correct?: boolean | null }) {
    const { error } = await supabase
      .from('players')
      .update(updates)
      .eq('session_id', sessionId)
      .eq('external_id', externalId);

    if (error) {
      console.error('Error updating player score:', error.message);
      throw error;
    }
  },

  /**
   * Update the game state (Host only).
   */
  async updateGameState(sessionId: string, updates: { current_question_index?: number; status?: string; question_ids?: string[] }) {
    const { error } = await supabase
      .from('game_sessions')
      .update(updates)
      .eq('id', sessionId);

    if (error) {
      console.error('Error updating game state:', error.message);
      throw error;
    }
  },

  /**
   * Subscribe to real-time changes in a game session.
   */
  subscribeToSession(sessionId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'game_sessions', filter: `id=eq.${sessionId}` },
        onUpdate
      )
      .subscribe();
  },

  /**
   * Subscribe to players joining a session.
   */
  subscribeToPlayers(sessionId: string, onUpdate: (payload: any) => void) {
    return supabase
      .channel(`players:${sessionId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players', filter: `session_id=eq.${sessionId}` },
        onUpdate
      )
      .subscribe();
  }
};
