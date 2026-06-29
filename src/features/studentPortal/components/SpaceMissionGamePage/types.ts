export type MissionStage = 'intro' | 'briefing' | 'map' | 'mission' | 'reward' | 'report';

export type MissionType =
    | 'pattern'
    | 'sequence'
    | 'memory'
    | 'math'
    | 'fuel'
    | 'decoder';

export type CompetencyName =
    | 'Logical Thinking'
    | 'Problem Solving'
    | 'Critical Thinking'
    | 'Decision Making'
    | 'Mathematics'
    | 'Memory'
    | 'Sequencing'
    | 'Pattern Recognition'
    | 'Spatial Reasoning'
    | 'Observation';

export interface MissionChallenge {
    id: string;
    type: MissionType;
    prompt: string;
    options: string[];
    answer: string;
    hint: string;
    competency: CompetencyName;
    seconds: number;
}

export interface PlanetMission {
    id: string;
    name: string;
    subtitle: string;
    color: string;
    missionType: MissionType;
    competency: CompetencyName;
}

export interface SpaceMissionProgress {
    currentPlanetIndex: number;
    completedPlanetIds: string[];
    xp: number;
    coins: number;
    stars: number;
    crystals: number;
    accuracy: number;
    attempts: number;
    correctAnswers: number;
    totalSeconds: number;
    competencyScores: Record<string, number>;
    badges: string[];
}
