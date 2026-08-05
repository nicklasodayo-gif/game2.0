/**
 * Configuration Index
 * 
 * Export all brand configurations and provide utilities for config management.
 * 
 * To switch brands, import the desired config:
 *   import config from './cocaCola';  // Coca-Cola
 *   import config from './redGiant';  // Red Giant
 *   import config from './demoBrand'; // Demo
 */

// Import all configs
import cocacolaConfig from './cocaCola';
import redGiantConfig from './redGiant';
import demoConfig from './demoBrand';

// Export all configs
export const configs = {
  cocacola: cocacolaConfig,
  redgiant: redGiantConfig,
  demo: demoConfig,
};

// Available brands
export const BRANDS = [
  { id: 'cocacola', name: 'Coca-Cola', config: cocacolaConfig },
  { id: 'redgiant', name: 'Red Giant', config: redGiantConfig },
  { id: 'demo', name: 'Demo Brand', config: demoConfig },
];

// Default config (change this to switch the active brand)
const defaultConfig = cocacolaConfig;

export default defaultConfig;

// Named exports
export { cocacolaConfig } from './cocaCola';
export { redGiantConfig } from './redGiant';
export { demoConfig } from './demoBrand';

/**
 * Get CSS variables from config
 * @param {Object} config - Brand config object
 * @returns {Object} CSS variables
 */
export function getCSSVariables(config) {
  return {
    '--color-primary': config.theme.primary,
    '--color-primary-dark': config.theme.primaryDark,
    '--color-secondary': config.theme.secondary,
    '--color-accent': config.theme.accent,
    '--color-background': config.theme.background,
    '--color-background-light': config.theme.backgroundLight,
    '--color-surface': config.theme.surface,
    '--color-text': config.theme.text,
    '--color-text-dark': config.theme.textDark,
    '--color-success': config.theme.success,
    '--color-gold': config.theme.gold,
    '--color-error': config.theme.error,
  };
}

/**
 * Get game settings for a difficulty level
 * @param {Object} config - Brand config object
 * @param {string} difficulty - Difficulty level (easy, normal, hard)
 * @returns {Object} Game settings
 */
export function getDifficultySettings(config, difficulty = 'normal') {
  const diff = config.difficulty?.[difficulty] || config.settings;
  return {
    gridSize: diff.gridSize || 3,
    targetTime: diff.targetTime || 60,
    maxTime: diff.maxTime || 180,
  };
}
