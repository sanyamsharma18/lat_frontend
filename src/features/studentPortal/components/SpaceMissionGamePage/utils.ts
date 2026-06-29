import {
    INITIAL_SPACE_PROGRESS,
    PLANETS,
    SPACE_MISSION_STORAGE_KEY,
} from './constants';
import { SpaceMissionProgress } from './types';

export const getGradeNumber = (grade?: string) => {
    const gradeValue = Number(String(grade ?? '').replace(/\D/g, ''));

    return Number.isFinite(gradeValue) && gradeValue >= 3 ? Math.min(gradeValue, 8) : 3;
};

export const loadSpaceMissionProgress = (): SpaceMissionProgress => {
    if (typeof window === 'undefined') {
        return INITIAL_SPACE_PROGRESS;
    }

    try {
        const storedProgress = window.localStorage.getItem(SPACE_MISSION_STORAGE_KEY);

        return storedProgress
            ? { ...INITIAL_SPACE_PROGRESS, ...JSON.parse(storedProgress) }
            : INITIAL_SPACE_PROGRESS;
    } catch {
        return INITIAL_SPACE_PROGRESS;
    }
};

export const saveSpaceMissionProgress = (progress: SpaceMissionProgress) => {
    window.localStorage.setItem(SPACE_MISSION_STORAGE_KEY, JSON.stringify(progress));
};

export const resetSpaceMissionProgress = () => {
    window.localStorage.removeItem(SPACE_MISSION_STORAGE_KEY);
};

export const isPlanetUnlocked = (index: number, progress: SpaceMissionProgress) =>
    index === 0 || progress.completedPlanetIds.includes(PLANETS[index - 1]?.id);

export const getAstronautRank = (progress: SpaceMissionProgress) => {
    if (progress.xp >= 900) return 'Commander';
    if (progress.xp >= 600) return 'Navigator';
    if (progress.xp >= 300) return 'Pilot';

    return 'Cadet';
};

export const getAverageTime = (progress: SpaceMissionProgress) =>
    progress.attempts ? Math.round(progress.totalSeconds / progress.attempts) : 0;

export const getAccuracy = (correctAnswers: number, attempts: number) =>
    attempts ? Math.round((correctAnswers / attempts) * 100) : 0;
