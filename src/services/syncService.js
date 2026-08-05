/**
 * Sync service for offline/online data synchronization
 * 
 * Handles:
 * - Automatic sync when online
 * - Retry logic for failed syncs
 * - Queue management
 */

import { isConfigured, syncLeads, submitScore } from './supabase';
import { getSyncQueue, removeFromSyncQueue, getUnsyncedLeads } from './localStorage';

const SYNC_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 3;

let syncIntervalId = null;
let isSyncing = false;

/**
 * Check if online
 * @returns {boolean}
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Start automatic sync
 */
export function startAutoSync() {
  if (syncIntervalId) return;
  
  // Initial sync
  if (isOnline()) {
    syncAll();
  }
  
  // Set up interval
  syncIntervalId = setInterval(() => {
    if (isOnline() && !isSyncing) {
      syncAll();
    }
  }, SYNC_INTERVAL);
  
  // Listen for online events
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
}

/**
 * Stop automatic sync
 */
export function stopAutoSync() {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
  }
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
}

/**
 * Handle coming online
 */
function handleOnline() {
  console.log('Back online, syncing data...');
  syncAll();
}

/**
 * Handle going offline
 */
function handleOffline() {
  console.log('Gone offline, data will sync when back online');
}

/**
 * Sync all pending data
 * @returns {Promise<Object>} Sync result
 */
export async function syncAll() {
  if (isSyncing || !isOnline() || !isConfigured()) {
    return { success: false, reason: isSyncing ? 'Already syncing' : 'Offline or not configured' };
  }
  
  isSyncing = true;
  const results = {
    leads: { synced: 0, failed: 0 },
    scores: { synced: 0, failed: 0 },
  };
  
  try {
    // Sync leads
    const leads = getUnsyncedLeads();
    if (leads.length > 0) {
      const result = await syncLeads(leads);
      if (result.success) {
        results.leads.synced = leads.length;
        leads.forEach(lead => removeFromSyncQueue(lead.id));
      } else {
        results.leads.failed = leads.length;
      }
    }
    
    // Process sync queue
    const queue = getSyncQueue();
    for (const item of queue) {
      if (item.retries >= MAX_RETRIES) {
        removeFromSyncQueue(item.data.id);
        continue;
      }
      
      try {
        if (item.type === 'lead') {
          const result = await syncLeads([item.data]);
          if (result.success) {
            removeFromSyncQueue(item.data.id);
            results.leads.synced++;
          } else {
            item.retries++;
          }
        } else if (item.type === 'score') {
          const result = await submitScore(item.data);
          if (result.success) {
            removeFromSyncQueue(item.data.id);
            results.scores.synced++;
          } else {
            item.retries++;
          }
        }
      } catch (error) {
        console.error('Sync error for item:', item, error);
        item.retries++;
      }
    }
    
    return { 
      success: true, 
      results,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Sync all error:', error);
    return { success: false, error: error.message };
  } finally {
    isSyncing = false;
  }
}

/**
 * Get sync status
 * @returns {Object}
 */
export function getSyncStatus() {
  const queue = getSyncQueue();
  const unsyncedLeads = getUnsyncedLeads();
  
  return {
    isOnline: isOnline(),
    isConfigured: isConfigured(),
    isSyncing,
    pendingItems: queue.length + unsyncedLeads.length,
    queueItems: queue,
    lastSync: localStorage.getItem('lastSync') || null,
  };
}

/**
 * Force sync now
 * @returns {Promise<Object>}
 */
export async function syncNow() {
  return syncAll();
}
