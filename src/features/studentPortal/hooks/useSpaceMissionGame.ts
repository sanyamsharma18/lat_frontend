'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { StudentProfile } from '@/types/studentPortal';

import {
    getMissionChallenge,
    INITIAL_SPACE_PROGRESS,
    MISSION_TEXT,
    PLANETS,
    SPACE_MISSION_DASHBOARD_PATH,
} from '../components/SpaceMissionGamePage/constants';
import {
    getAccuracy,
    getAstronautRank,
    getGradeNumber,
    isPlanetUnlocked,
    loadSpaceMissionProgress,
    resetSpaceMissionProgress,
    saveSpaceMissionProgress,
} from '../components/SpaceMissionGamePage/utils';
import { MissionStage, SpaceMissionProgress } from '../components/SpaceMissionGamePage/types';

interface UseSpaceMissionGameArgs {
    profile?: StudentProfile;
}

export const useSpaceMissionGame = ({ profile }: UseSpaceMissionGameArgs) => {
    const router = useRouter();
    const [stage, setStage] = useState<MissionStage>('intro');
    const [progress, setProgress] = useState<SpaceMissionProgress>(INITIAL_SPACE_PROGRESS);
    const [selectedPlanetIndex, setSelectedPlanetIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
    const [burstAnswer, setBurstAnswer] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(45);
    const burstTimeoutRef = useRef<number | null>(null);

    const grade = getGradeNumber(profile?.grade);
    const selectedPlanet = PLANETS[selectedPlanetIndex];
    const challenge = useMemo(
        () => getMissionChallenge(selectedPlanet, grade, selectedPlanetIndex),
        [grade, selectedPlanet, selectedPlanetIndex],
    );

    useEffect(() => {
        const storedProgress = loadSpaceMissionProgress();

        setProgress(storedProgress);
        setSelectedPlanetIndex(storedProgress.currentPlanetIndex);
    }, []);

    useEffect(() => {
        if (stage !== 'mission' || isPaused || lastResult) {
            return undefined;
        }

        if (remainingSeconds <= 0) {
            setLastResult('incorrect');
            return undefined;
        }

        const timer = window.setInterval(() => {
            setRemainingSeconds((previous) => Math.max(previous - 1, 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isPaused, lastResult, remainingSeconds, stage]);

    const exitToDashboard = useCallback(() => {
        router.replace(SPACE_MISSION_DASHBOARD_PATH);
    }, [router]);

    const openMap = () => setStage('map');

    const startPlanetMission = (planetIndex: number) => {
        if (!isPlanetUnlocked(planetIndex, progress)) {
            return;
        }

        if (burstTimeoutRef.current) {
            window.clearTimeout(burstTimeoutRef.current);
        }

        setSelectedPlanetIndex(planetIndex);
        setSelectedAnswer('');
        setBurstAnswer('');
        setLastResult(null);
        setShowHint(false);
        setRemainingSeconds(getMissionChallenge(PLANETS[planetIndex], grade, planetIndex).seconds);
        setStage('mission');
    };

    const submitAnswer = () => {
        if (!selectedAnswer) {
            return;
        }

        setLastResult(selectedAnswer === challenge.answer ? 'correct' : 'incorrect');
    };

    const burstBalloonAnswer = useCallback(
        (answer: string) => {
            if (lastResult || burstAnswer) {
                return;
            }

            setSelectedAnswer(answer);
            setBurstAnswer(answer);

            burstTimeoutRef.current = window.setTimeout(() => {
                setLastResult(answer === challenge.answer ? 'correct' : 'incorrect');
            }, 420);
        },
        [burstAnswer, challenge.answer, lastResult],
    );

    const completeMission = () => {
        const isCorrect = lastResult === 'correct';
        const nextCompletedIds = progress.completedPlanetIds.includes(selectedPlanet.id)
            ? progress.completedPlanetIds
            : [...progress.completedPlanetIds, selectedPlanet.id];
        const nextAttempts = progress.attempts + 1;
        const nextCorrectAnswers = progress.correctAnswers + (isCorrect ? 1 : 0);
        const nextProgress: SpaceMissionProgress = {
            ...progress,
            currentPlanetIndex: Math.min(selectedPlanetIndex + 1, PLANETS.length - 1),
            completedPlanetIds: nextCompletedIds,
            attempts: nextAttempts,
            correctAnswers: nextCorrectAnswers,
            accuracy: getAccuracy(nextCorrectAnswers, nextAttempts),
            totalSeconds: progress.totalSeconds + (challenge.seconds - remainingSeconds),
            xp: progress.xp + (isCorrect ? 160 : 80),
            coins: progress.coins + (isCorrect ? 30 : 12),
            stars: progress.stars + (isCorrect ? 3 : 1),
            crystals: progress.crystals + (isCorrect ? 2 : 1),
            competencyScores: {
                ...progress.competencyScores,
                [challenge.competency]:
                    (progress.competencyScores[challenge.competency] ?? 0) + (isCorrect ? 20 : 8),
            },
            badges: nextCompletedIds.map((planetId) => {
                const planet = PLANETS.find(({ id }) => id === planetId);

                return planet ? `${planet.name} Badge` : planetId;
            }),
        };

        setProgress(nextProgress);
        saveSpaceMissionProgress(nextProgress);
        setStage(nextCompletedIds.length === PLANETS.length ? 'report' : 'reward');
    };

    const restartMission = () => {
        if (burstTimeoutRef.current) {
            window.clearTimeout(burstTimeoutRef.current);
        }

        setSelectedAnswer('');
        setBurstAnswer('');
        setLastResult(null);
        setShowHint(false);
        setRemainingSeconds(challenge.seconds);
        setIsPaused(false);
    };

    const restartGame = () => {
        if (burstTimeoutRef.current) {
            window.clearTimeout(burstTimeoutRef.current);
        }

        resetSpaceMissionProgress();
        setProgress(INITIAL_SPACE_PROGRESS);
        setSelectedPlanetIndex(0);
        setStage('intro');
    };

    useEffect(
        () => () => {
            if (burstTimeoutRef.current) {
                window.clearTimeout(burstTimeoutRef.current);
            }
        },
        [],
    );

    return {
        burstAnswer,
        burstBalloonAnswer,
        challenge,
        completeMission,
        exitToDashboard,
        grade,
        isMuted,
        isPaused,
        lastResult,
        missionText: MISSION_TEXT,
        openMap,
        planets: PLANETS,
        progress,
        rank: getAstronautRank(progress),
        remainingSeconds,
        restartGame,
        restartMission,
        selectedAnswer,
        selectedPlanet,
        selectedPlanetIndex,
        setIsMuted,
        setIsPaused,
        setSelectedAnswer,
        setShowHint,
        setStage,
        showHint,
        stage,
        startPlanetMission,
        submitAnswer,
    };
};
