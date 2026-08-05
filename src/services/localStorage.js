/**
 * LocalStorage service for offline data persistence
 * Uses both localStorage and IndexedDB for larger datasets
 */

const STORAGE_KEYS = {
  GAMES: 'activation_games',
  LEADS: 'activation_leads',
  STATS: 'activation_stats',
  SETTINGS: 'activation_settings',
  SYNC_QUEUE: 'activation_sync_queue',
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
function isLocalStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if not found
 * @returns {*}
 */
export function getItem(key, defaultValue = null) {
  if (!isLocalStorageAvailable()) return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function setItem(key, value) {
  if (!isLocalStorageAvailable()) return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('localStorage setItem error:', error);
    return false;
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeItem(key) {
  if (!isLocalStorageAvailable()) return;
  localStorage.removeItem(key);
}

/**
 * Clear all app data from localStorage
 */
export function clearAll() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

// ============ Games ============

/**
 * Get all games
 * @returns {Array}
 */
export function getGames() {
  return getItem(STORAGE_KEYS.GAMES, []);
}

/**
 * Add a new game
 * @param {Object} game - Game record
 * @returns {Object} Added game with ID
 */
export function addGame(game) {
  const games = getGames();
  const newGame = {
    ...game,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
  };
  games.unshift(newGame);
  
  // Keep only last 1000 games
  const trimmed = games.slice(0, 1000);
  setItem(STORAGE_KEYS.GAMES, trimmed);
  
  // Update stats
  updateStatsOnGame(newGame);
  
  return newGame;
}

/**
 * Get completed games
 * @returns {Array}
 */
export function getCompletedGames() {
  return getGames().filter(g => g.completed);
}

/**
 * Get personal best
 * @returns {Object|null}
 */
export function getPersonalBest() {
  const completed = getCompletedGames();
  if (completed.length === 0) return null;
  return completed.reduce((best, game) => 
    (!best || game.time < best.time) ? game : best
  , null);
}

// ============ Leads ============

/**
 * Get all leads
 * @returns {Array}
 */
export function getLeads() {
  return getItem(STORAGE_KEYS.LEADS, []);
}

/**
 * Add a new lead
 * @param {Object} lead - Lead data
 * @returns {Object} Added lead with ID
 */
export function addLead(lead) {
  const leads = getLeads();
  const newLead = {
    ...lead,
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    synced: false,
  };
  leads.unshift(newLead);
  
  // Keep only last 500 leads
  const trimmed = leads.slice(0, 500);
  setItem(STORAGE_KEYS.LEADS, trimmed);
  
  // Add to sync queue
  addToSyncQueue('lead', newLead);
  
  return newLead;
}

/**
 * Get unsynced leads
 * @returns {Array}
 */
export function getUnsyncedLeads() {
  return getLeads().filter(l => !l.synced);
}

/**
 * Mark lead as synced
 * @param {string} leadId - Lead ID
 */
export function markLeadSynced(leadId) {
  const leads = getLeads();
  const updated = leads.map(l => 
    l.id === leadId ? { ...l, synced: true } : l
  );
  setItem(STORAGE_KEYS.LEADS, updated);
}

// ============ Statistics ============

/**
 * Get statistics
 * @returns {Object}
 */
export function getStats() {
  return getItem(STORAGE_KEYS.STATS, {
    totalPlayers: 0,
    totalGames: 0,
    completedGames: 0,
    totalMoves: 0,
    totalTime: 0,
    leadsCollected: 0,
    idleSessions: 0,
    dailyStats: {},
  });
}

/**
 * Update statistics when a game is added
 * @param {Object} game - Game record
 */
function updateStatsOnGame(game) {
  const stats = getStats();
  
  stats.totalGames++;
  stats.totalMoves += game.moves || 0;
  stats.totalTime += game.time || 0;
  
  if (game.completed) {
    stats.completedGames++;
  }
  
  // Update daily stats
  const today = new Date().toDateString();
  if (!stats.dailyStats[today]) {
    stats.dailyStats[today] = {
      games: 0,
      completed: 0,
      players: 0,
    };
  }
  stats.dailyStats[today].games++;
  if (game.completed) {
    stats.dailyStats[today].completed++;
  }
  
  setItem(STORAGE_KEYS.STATS, stats);
}

/**
 * Increment leads collected count
 */
export function incrementLeadsCollected() {
  const stats = getStats();
  stats.leadsCollected++;
  setItem(STORAGE_KEYS.STATS, stats);
}

/**
 * Increment idle sessions
 */
export function incrementIdleSessions() {
  const stats = getStats();
  stats.idleSessions++;
  setItem(STORAGE_KEYS.STATS, stats);
}

/**
 * Reset all statistics
 */
export function resetStats() {
  setItem(STORAGE_KEYS.STATS, {
    totalPlayers: 0,
    totalGames: 0,
    completedGames: 0,
    totalMoves: 0,
    totalTime: 0,
    leadsCollected: 0,
    idleSessions: 0,
    dailyStats: {},
  });
}

// ============ Sync Queue ============

/**
 * Get sync queue
 * @returns {Array}
 */
export function getSyncQueue() {
  return getItem(STORAGE_KEYS.SYNC_QUEUE, []);
}

/**
 * Add item to sync queue
 * @param {string} type - Item type (lead, game)
 * @param {Object} data - Item data
 */
export function addToSyncQueue(type, data) {
  const queue = getSyncQueue();
  queue.push({
    type,
    data,
    timestamp: new Date().toISOString(),
    retries: 0,
  });
  setItem(STORAGE_KEYS.SYNC_QUEUE, queue);
}

/**
 * Remove item from sync queue
 * @param {string} id - Item ID
 */
export function removeFromSyncQueue(id) {
  const queue = getSyncQueue();
  const filtered = queue.filter(item => item.data.id !== id);
  setItem(STORAGE_KEYS.SYNC_QUEUE, filtered);
}

/**
 * Clear sync queue
 */
export function clearSyncQueue() {
  setItem(STORAGE_KEYS.SYNC_QUEUE, []);
}

// ============ Settings ============

/**
 * Get settings
 * @returns {Object}
 */
export function getSettings() {
  return getItem(STORAGE_KEYS.SETTINGS, {
    soundEnabled: true,
    soundVolume: 0.7,
    currentBrand: 'demo',
    gridSize: 3,
    difficulty: 'normal',
  });
}

/**
 * Update settings
 * @param {Object} updates - Settings updates
 */
export function updateSettings(updates) {
  const settings = getSettings();
  setItem(STORAGE_KEYS.SETTINGS, { ...settings, ...updates });
}

/**
 * Reset all data
 */
export function resetAllData() {
  clearAll();
  resetStats();
}

export { STORAGE_KEYS };
