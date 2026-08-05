/**
 * Supabase service for cloud data persistence
 * 
 * This service provides integration with Supabase for:
 * - Lead synchronization
 * - Leaderboard storage
 * - Cloud statistics
 * - Real-time updates
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables (set these in .env or deployment settings)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (lazy initialization)
let supabase = null;

function getClient() {
  if (!supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabase;
}

/**
 * Check if Supabase is configured
 * @returns {boolean}
 */
export function isConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY);
}

// ============ Leads ============

/**
 * Sync leads to Supabase
 * @param {Array} leads - Array of lead objects
 * @returns {Promise<Object>} Result
 */
export async function syncLeads(leads) {
  const client = getClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await client
      .from('leads')
      .upsert(leads, { onConflict: 'id' });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase syncLeads error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch leads from Supabase
 * @param {number} limit - Max number of leads to fetch
 * @returns {Promise<Array>}
 */
export async function fetchLeads(limit = 100) {
  const client = getClient();
  if (!client) return [];

  try {
    const { data, error } = await client
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase fetchLeads error:', error);
    return [];
  }
}

// ============ Leaderboard ============

/**
 * Submit score to leaderboard
 * @param {Object} score - Score object
 * @returns {Promise<Object>} Result
 */
export async function submitScore(score) {
  const client = getClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await client
      .from('leaderboard')
      .insert([{
        name: score.name || 'Anonymous',
        time: score.time,
        moves: score.moves,
        grid_size: score.gridSize || 3,
        brand: score.brand || 'demo',
        completed_at: new Date().toISOString(),
      }]);

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase submitScore error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch leaderboard from Supabase
 * @param {Object} options - Query options
 * @returns {Promise<Array>}
 */
export async function fetchLeaderboard(options = {}) {
  const client = getClient();
  if (!client) return [];

  const { gridSize, brand, limit = 10, sortBy = 'time' } = options;

  try {
    let query = client
      .from('leaderboard')
      .select('*');

    if (gridSize) {
      query = query.eq('grid_size', gridSize);
    }
    if (brand) {
      query = query.eq('brand', brand);
    }

    query = query
      .order(sortBy === 'time' ? 'time' : 'moves', { ascending: true })
      .limit(limit);

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Supabase fetchLeaderboard error:', error);
    return [];
  }
}

// ============ Statistics ============

/**
 * Sync statistics to Supabase
 * @param {Object} stats - Statistics object
 * @returns {Promise<Object>} Result
 */
export async function syncStats(stats) {
  const client = getClient();
  if (!client) return { success: false, error: 'Supabase not configured' };

  try {
    const { data, error } = await client
      .from('statistics')
      .upsert([{
        ...stats,
        updated_at: new Date().toISOString(),
      }], { onConflict: 'id' });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Supabase syncStats error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch aggregated statistics
 * @returns {Promise<Object>}
 */
export async function fetchStats() {
  const client = getClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('statistics')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase fetchStats error:', error);
    return null;
  }
}

// ============ Real-time ============

/**
 * Subscribe to real-time leaderboard updates
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToLeaderboard(callback) {
  const client = getClient();
  if (!client) return () => {};

  const subscription = client
    .channel('leaderboard_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'leaderboard',
    }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    client.removeChannel(subscription);
  };
}

/**
 * Subscribe to real-time lead updates
 * @param {Function} callback - Callback function
 * @returns {Function} Unsubscribe function
 */
export function subscribeToLeads(callback) {
  const client = getClient();
  if (!client) return () => {};

  const subscription = client
    .channel('leads_changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'leads',
    }, (payload) => {
      callback(payload);
    })
    .subscribe();

  return () => {
    client.removeChannel(subscription);
  };
}

export default {
  isConfigured,
  syncLeads,
  fetchLeads,
  submitScore,
  fetchLeaderboard,
  syncStats,
  fetchStats,
  subscribeToLeaderboard,
  subscribeToLeads,
};
