import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getGames,
  addGame,
  getStats,
  resetStats,
  incrementLeadsCollected,
  incrementIdleSessions,
} from '../services/localStorage';
import {
  calculateAverage,
  calculateMedian,
  getStatisticsSummary,
  getLeaderboard,
} from '../utils/statistics';

/**
 * useStatistics - Custom hook for game statistics management
 * 
 * @returns {Object} Statistics state and controls
 */
export function useStatistics() {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load all data from storage
  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const loadedGames = getGames();
      const loadedStats = getStats();
      setGames(loadedGames);
      setStats(loadedStats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Record a new game
  const recordGame = useCallback((gameData) => {
    const newGame = addGame({
      ...gameData,
      date: new Date().toISOString(),
    });
    setGames(prev => [newGame, ...prev]);
    return newGame;
  }, []);

  // Record a win
  const recordWin = useCallback((gameData) => {
    return recordGame({ ...gameData, completed: true });
  }, [recordGame]);

  // Record a loss/incomplete game
  const recordLoss = useCallback((gameData) => {
    return recordGame({ ...gameData, completed: false });
  }, [recordGame]);

  // Record a lead
  const recordLead = useCallback(() => {
    incrementLeadsCollected();
    setStats(prev => prev ? { ...prev, leadsCollected: prev.leadsCollected + 1 } : null);
  }, []);

  // Record idle session
  const recordIdle = useCallback(() => {
    incrementIdleSessions();
    setStats(prev => prev ? { ...prev, idleSessions: prev.idleSessions + 1 } : null);
  }, []);

  // Reset all statistics
  const reset = useCallback(() => {
    resetStats();
    setGames([]);
    setStats({
      totalPlayers: 0,
      totalGames: 0,
      completedGames: 0,
      totalMoves: 0,
      totalTime: 0,
      leadsCollected: 0,
      idleSessions: 0,
      dailyStats: {},
    });
  }, []);

  // Get computed statistics
  const computedStats = useMemo(() => {
    return getStatisticsSummary(games);
  }, [games]);

  // Get leaderboard
  const getTopScores = useCallback((sortBy = 'time', limit = 10) => {
    return getLeaderboard(games, sortBy, limit);
  }, [games]);

  // Get personal best
  const personalBest = useMemo(() => {
    const completed = games.filter(g => g.completed);
    if (completed.length === 0) return null;
    return completed.reduce((best, game) => 
      (!best || game.time < best.time) ? game : best
    , null);
  }, [games]);

  // Get average statistics
  const averages = useMemo(() => {
    const completed = games.filter(g => g.completed);
    return {
      time: completed.length > 0 ? Math.round(calculateAverage(completed.map(g => g.time))) : 0,
      moves: completed.length > 0 ? Math.round(calculateAverage(completed.map(g => g.moves))) : 0,
    };
  }, [games]);

  // Get daily statistics
  const dailyStats = useMemo(() => {
    const stats = {};
    games.forEach(game => {
      const date = new Date(game.date).toDateString();
      if (!stats[date]) {
        stats[date] = { games: 0, completed: 0, moves: 0, time: 0 };
      }
      stats[date].games++;
      if (game.completed) stats[date].completed++;
      stats[date].moves += game.moves || 0;
      stats[date].time += game.time || 0;
    });
    return stats;
  }, [games]);

  return {
    // State
    games,
    stats,
    isLoading,
    
    // Computed
    computedStats,
    personalBest,
    averages,
    dailyStats,
    
    // Actions
    recordGame,
    recordWin,
    recordLoss,
    recordLead,
    recordIdle,
    reset,
    loadData,
    getTopScores,
  };
}

export default useStatistics;
