/**
 * Statistics calculation utilities
 */

/**
 * Calculate average from array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {number} Average value
 */
export function calculateAverage(values) {
  if (!values || values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate median from array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {number} Median value
 */
export function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Calculate percentile
 * @param {number[]} values - Array of numbers
 * @param {number} percentile - Percentile to calculate (0-100)
 * @returns {number} Percentile value
 */
export function calculatePercentile(values, percentile) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] * (upper - index) + sorted[upper] * (index - lower);
}

/**
 * Format time in seconds to MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format time in seconds to human readable
 * @param {number} seconds - Time in seconds
 * @returns {string} Human readable time
 */
export function formatTimeHuman(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Calculate completion rate
 * @param {number} completed - Number of completed games
 * @param {number} started - Number of started games
 * @returns {number} Completion rate as percentage
 */
export function calculateCompletionRate(completed, started) {
  if (started === 0) return 0;
  return Math.round((completed / started) * 100);
}

/**
 * Calculate win rate
 * @param {number} wins - Number of wins
 * @param {number} total - Total games played
 * @returns {number} Win rate as percentage
 */
export function calculateWinRate(wins, total) {
  if (total === 0) return 0;
  return Math.round((wins / total) * 100);
}

/**
 * Get statistics summary from game history
 * @param {Array} games - Array of game records
 * @returns {Object} Statistics summary
 */
export function getStatisticsSummary(games) {
  if (!games || games.length === 0) {
    return {
      totalGames: 0,
      completedGames: 0,
      averageTime: 0,
      averageMoves: 0,
      fastestTime: 0,
      slowestTime: 0,
      medianTime: 0,
    };
  }

  const completed = games.filter(g => g.completed);
  const times = completed.map(g => g.time);
  const moves = games.map(g => g.moves);

  return {
    totalGames: games.length,
    completedGames: completed.length,
    averageTime: Math.round(calculateAverage(times)),
    averageMoves: Math.round(calculateAverage(moves)),
    fastestTime: times.length > 0 ? Math.min(...times) : 0,
    slowestTime: times.length > 0 ? Math.max(...times) : 0,
    medianTime: Math.round(calculateMedian(times)),
    completionRate: calculateCompletionRate(completed.length, games.length),
  };
}

/**
 * Get leaderboard data
 * @param {Array} games - Array of game records
 * @param {string} sortBy - Sort by 'time' or 'moves'
 * @param {number} limit - Number of entries to return
 * @returns {Array} Sorted leaderboard entries
 */
export function getLeaderboard(games, sortBy = 'time', limit = 10) {
  const completed = games.filter(g => g.completed);
  
  return completed
    .map((g, index) => ({
      rank: index + 1,
      name: g.name || 'Anonymous',
      time: g.time,
      moves: g.moves,
      date: g.date,
    }))
    .sort((a, b) => {
      if (sortBy === 'time') return a.time - b.time;
      return a.moves - b.moves;
    })
    .slice(0, limit)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

/**
 * Group games by date
 * @param {Array} games - Array of game records
 * @returns {Object} Games grouped by date
 */
export function groupByDate(games) {
  return games.reduce((groups, game) => {
    const date = new Date(game.date).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(game);
    return groups;
  }, {});
}
