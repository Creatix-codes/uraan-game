import { LEVELS, TOTAL_LEVELS } from '../data/levels';
import type { GameSettings, LevelProgress, LevelResult, ProgressState } from '../types';

const STORAGE_KEY = 'uraan-e-pakistan::progress::v1';

const emptyLevel = (): LevelProgress => ({
  completed: false,
  bestStars: 0,
  bestScore: 0,
  plays: 0,
});

export function createDefaultProgress(): ProgressState {
  return {
    version: 1,
    unlocked: 1,
    levels: Object.fromEntries(LEVELS.map((level) => [String(level.id), emptyLevel()])),
    tutorialSeen: false,
    settings: { music: true, sfx: true },
    totalFlights: 0,
  };
}

function sanitiseNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function loadProgress(): ProgressState {
  const fallback = createDefaultProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<ProgressState> | null;
    if (!parsed || typeof parsed !== 'object') return fallback;

    const levels: Record<string, LevelProgress> = {};
    for (const level of LEVELS) {
      const saved = parsed.levels?.[String(level.id)];
      levels[String(level.id)] = {
        completed: Boolean(saved?.completed),
        bestStars: sanitiseNumber(saved?.bestStars, 0, 0, 3),
        bestScore: sanitiseNumber(saved?.bestScore, 0, 0, 1_000_000),
        plays: sanitiseNumber(saved?.plays, 0, 0, 100_000),
      };
    }

    const completedCount = LEVELS.filter((level) => levels[String(level.id)].completed).length;
    const unlockedFloor = Math.min(TOTAL_LEVELS, completedCount + 1);

    return {
      version: 1,
      unlocked: Math.max(
        sanitiseNumber(parsed.unlocked, 1, 1, TOTAL_LEVELS),
        unlockedFloor,
      ),
      levels,
      tutorialSeen: Boolean(parsed.tutorialSeen),
      settings: {
        music: parsed.settings?.music !== false,
        sfx: parsed.settings?.sfx !== false,
      },
      totalFlights: sanitiseNumber(parsed.totalFlights, 0, 0, 1_000_000),
    };
  } catch {
    return fallback;
  }
}

export function saveProgress(progress: ProgressState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage can be unavailable in private browsing — the game still plays.
  }
}

export function isLevelUnlocked(progress: ProgressState, levelId: number): boolean {
  return levelId <= progress.unlocked;
}

export function getTotalStars(progress: ProgressState): number {
  return LEVELS.reduce((total, level) => {
    return total + (progress.levels[String(level.id)]?.bestStars ?? 0);
  }, 0);
}

export function getCompletedCount(progress: ProgressState): number {
  return LEVELS.filter((level) => progress.levels[String(level.id)]?.completed).length;
}

export function getNextLevelId(levelId: number): number | null {
  return levelId < TOTAL_LEVELS ? levelId + 1 : null;
}

export function getContinueLevelId(progress: ProgressState): number {
  const firstIncomplete = LEVELS.find(
    (level) =>
      isLevelUnlocked(progress, level.id) &&
      !progress.levels[String(level.id)]?.completed,
  );
  if (firstIncomplete) return firstIncomplete.id;
  return Math.min(progress.unlocked, TOTAL_LEVELS);
}

export function recordVictory(progress: ProgressState, result: LevelResult): {
  progress: ProgressState;
  isNewBest: boolean;
} {
  const key = String(result.levelId);
  const previous = progress.levels[key] ?? emptyLevel();
  const isNewBest = result.score > previous.bestScore || result.rating > previous.bestStars;

  const levels: Record<string, LevelProgress> = {
    ...progress.levels,
    [key]: {
      completed: true,
      bestStars: Math.max(previous.bestStars, result.rating),
      bestScore: Math.max(previous.bestScore, result.score),
      plays: previous.plays + 1,
    },
  };

  return {
    progress: {
      ...progress,
      levels,
      unlocked: Math.max(progress.unlocked, Math.min(TOTAL_LEVELS, result.levelId + 1)),
    },
    isNewBest,
  };
}

export function markTutorialSeen(progress: ProgressState): ProgressState {
  if (progress.tutorialSeen) return progress;
  return { ...progress, tutorialSeen: true };
}

export function setSettings(progress: ProgressState, settings: GameSettings): ProgressState {
  return { ...progress, settings };
}

export function resetJourney(settings: GameSettings): ProgressState {
  const fresh = createDefaultProgress();
  return { ...fresh, settings };
}

export function getStarsForLevel(progress: ProgressState, levelId: number): number {
  return progress.levels[String(levelId)]?.bestStars ?? 0;
}
