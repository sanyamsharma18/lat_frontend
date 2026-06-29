import { MissionChallenge, PlanetMission, SpaceMissionProgress } from './types';

export const SPACE_MISSION_STORAGE_KEY = 'lat_space_mission_progress';
export const SPACE_MISSION_DASHBOARD_PATH = '/student/dashboard';

export const PLANETS: PlanetMission[] = [
    {
        id: 'launch-academy',
        name: 'Launch Academy',
        subtitle: 'Train your astronaut brain',
        color: '#55c7ff',
        missionType: 'pattern',
        competency: 'Pattern Recognition',
    },
    {
        id: 'asteroid-belt',
        name: 'Asteroid Belt',
        subtitle: 'Find the safest route',
        color: '#f9b44a',
        missionType: 'fuel',
        competency: 'Decision Making',
    },
    {
        id: 'repair-station',
        name: 'Repair Station',
        subtitle: 'Put repair steps in order',
        color: '#7be495',
        missionType: 'sequence',
        competency: 'Sequencing',
    },
    {
        id: 'satellite-network',
        name: 'Satellite Network',
        subtitle: 'Decode the signal',
        color: '#b18cff',
        missionType: 'decoder',
        competency: 'Logical Thinking',
    },
    {
        id: 'black-hole',
        name: 'Black Hole',
        subtitle: 'Remember the safe pattern',
        color: '#ff6f91',
        missionType: 'memory',
        competency: 'Memory',
    },
    {
        id: 'space-station',
        name: 'Space Station',
        subtitle: 'Power the final console',
        color: '#f7ef6a',
        missionType: 'math',
        competency: 'Mathematics',
    },
];

export const INITIAL_SPACE_PROGRESS: SpaceMissionProgress = {
    currentPlanetIndex: 0,
    completedPlanetIds: [],
    xp: 0,
    coins: 0,
    stars: 0,
    crystals: 0,
    accuracy: 0,
    attempts: 0,
    correctAnswers: 0,
    totalSeconds: 0,
    competencyScores: {},
    badges: [],
};

export const MISSION_TEXT = {
    title: 'Space Mission',
    introTitle: 'Earth needs your help, Astronaut!',
    introBody:
        'Communication with the Space Station is offline. Visit each planet, solve missions, collect Energy Crystals, and restore the signal.',
    briefingTitle: 'Mission Briefing',
    briefingBody:
        'Complete planets in order. If a mission feels hard, use a hint. Your rank grows with accuracy, speed, and brave decisions.',
    startMission: 'Start Mission',
    continueMission: 'Continue',
    galaxyMap: 'Galaxy Map',
    launch: 'Launch',
    locked: 'Locked',
    exit: 'Exit',
    pause: 'Pause',
    resume: 'Resume',
    restart: 'Restart Mission',
    settings: 'Settings',
    mute: 'Mute',
    unmute: 'Sound On',
    hint: 'Hint',
    submit: 'Submit Answer',
    nextPlanet: 'Next Planet',
    viewReport: 'View Report',
    dashboard: 'Return to Dashboard',
    rewardTitle: 'Mission Reward',
    reportTitle: 'Competency Report',
};

const makeChallenge = (
    planet: PlanetMission,
    grade: number,
    planetIndex: number,
): MissionChallenge => {
    const level = Math.max(3, Math.min(8, grade || 3));
    const base = level + planetIndex;
    const solarCellPrompt = `The station needs ${base} solar cells in each of ${
        planetIndex + 3
    } panels. How many cells are needed?`;

    if (planet.missionType === 'math') {
        return {
            id: `${planet.id}-math`,
            type: 'math',
            prompt: solarCellPrompt,
            options: [
                `${base + planetIndex}`,
                `${base * (planetIndex + 3)}`,
                `${base * 2}`,
                `${base + 12}`,
            ],
            answer: `${base * (planetIndex + 3)}`,
            hint: 'Multiply the cells in one panel by the number of panels.',
            competency: planet.competency,
            seconds: 55,
        };
    }

    if (planet.missionType === 'sequence') {
        return {
            id: `${planet.id}-sequence`,
            type: 'sequence',
            prompt: 'Choose the correct first repair step.',
            options: ['Test signal', 'Turn off power', 'Tighten antenna', 'Restart console'],
            answer: 'Turn off power',
            hint: 'Safe astronauts remove power before repairing equipment.',
            competency: planet.competency,
            seconds: 50,
        };
    }

    if (planet.missionType === 'fuel') {
        return {
            id: `${planet.id}-fuel`,
            type: 'fuel',
            prompt: 'Which route saves the most fuel and still reaches the crystal?',
            options: ['Short route: 18 fuel, 1 crystal', 'Long route: 28 fuel, 1 crystal', 'Loop route: 35 fuel, 2 crystals', 'Return route: 12 fuel, 0 crystals'],
            answer: 'Short route: 18 fuel, 1 crystal',
            hint: 'The best route reaches the crystal with the least fuel.',
            competency: planet.competency,
            seconds: 45,
        };
    }

    if (planet.missionType === 'decoder') {
        return {
            id: `${planet.id}-decoder`,
            type: 'decoder',
            prompt: 'Decode the satellite pattern: Moon, Star, Moon, Star, ?',
            options: ['Moon', 'Star', 'Rocket', 'Comet'],
            answer: 'Moon',
            hint: 'The pattern repeats every two symbols.',
            competency: planet.competency,
            seconds: 45,
        };
    }

    if (planet.missionType === 'memory') {
        return {
            id: `${planet.id}-memory`,
            type: 'memory',
            prompt: 'Remember the safe orbit sequence: Red, Blue, Green. What comes second?',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
            answer: 'Blue',
            hint: 'Say the sequence slowly: Red, Blue, Green.',
            competency: planet.competency,
            seconds: 40,
        };
    }

    return {
        id: `${planet.id}-pattern`,
        type: 'pattern',
        prompt: `Find the next number in the launch code: ${base}, ${base + 2}, ${base + 4}, ?`,
        options: [`${base + 5}`, `${base + 6}`, `${base + 8}`, `${base + 10}`],
        answer: `${base + 6}`,
        hint: 'The code increases by 2 each time.',
        competency: planet.competency,
        seconds: 45,
    };
};

export const getMissionChallenge = (planet: PlanetMission, grade: number, planetIndex: number) =>
    makeChallenge(planet, grade, planetIndex);
