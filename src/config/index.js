import cocacolaConfig from "./cocaCola";
import redGiantConfig from "./redGiant";
import demoConfig from "./demoBrand";

export const configs = {
  cocacola: cocacolaConfig,
  redgiant: redGiantConfig,
  demo: demoConfig,
};

export const BRANDS = [
  { id: "cocacola", name: "Coca-Cola" },
  { id: "redgiant", name: "Red Giant" },
  { id: "demo", name: "Demo Brand" },
];

// Returns the config for the requested brand
export function getConfig(brand = "redgiant") {
  return configs[brand] || redGiantConfig;
}

// Default export
export default getConfig();

// CSS Variables
export function getCSSVariables(config) {
  return {
    "--color-primary": config.theme.primary,
    "--color-primary-dark": config.theme.primaryDark,
    "--color-secondary": config.theme.secondary,
    "--color-accent": config.theme.accent,
    "--color-background": config.theme.background,
    "--color-background-light": config.theme.backgroundLight,
    "--color-surface": config.theme.surface,
    "--color-text": config.theme.text,
    "--color-text-dark": config.theme.textDark,
    "--color-success": config.theme.success,
    "--color-gold": config.theme.gold,
    "--color-error": config.theme.error,
  };
}

export function getDifficultySettings(config, difficulty = "normal") {
  const diff = config.difficulty?.[difficulty] || config.settings;

  return {
    gridSize: diff.gridSize ?? 3,
    targetTime: diff.targetTime ?? 60,
    maxTime: diff.maxTime ?? 180,
  };
}

export {
  cocacolaConfig,
  redGiantConfig,
  demoConfig,
};