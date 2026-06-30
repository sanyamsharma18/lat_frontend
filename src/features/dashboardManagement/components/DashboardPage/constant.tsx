export const DASHBOARD_TEXT = {
    title: 'Enterprise Analytics Dashboard 2.0',
    subtitle: 'National Education Assessment System Portal (LAT 2.0)',
    errorTitle: 'Live Database Synchronization Error',
    errorDescription: 'Unable to connect to production data nodes. Operating in offline replica mode.',
    mockAlert: 'Connected to LAT Offline Database Replica. Showing actual cached system analytics.',
};

// Global filter structures
export const FILTER_OPTIONS = {
    regions: [
        { value: 'all', label: 'All Regions' },
        { value: 'reg-north', label: 'Northern Region' },
        { value: 'reg-south', label: 'Southern Region' },
        { value: 'reg-east', label: 'Eastern Region' },
        { value: 'reg-west', label: 'Western Region' },
        { value: 'reg-central', label: 'Central Region' },
    ],
    schools: [
        { value: 'all', label: 'All Schools' },
        { value: 'sch-01', label: 'St. Mary Academy (Northern)' },
        { value: 'sch-02', label: 'Delhi Public School (Southern)' },
        { value: 'sch-03', label: 'Royal Heritage High (Eastern)' },
        { value: 'sch-04', label: 'West Academy for Boys (Western)' },
        { value: 'sch-05', label: 'Central Model School (Central)' },
    ],
    grades: [
        { value: 'all', label: 'All Grades' },
        { value: '3', label: 'Grade 3' },
        { value: '5', label: 'Grade 5' },
        { value: '9', label: 'Grade 9' },
    ],
    subjects: [
        { value: 'all', label: 'All Subjects' },
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
        { value: 'social', label: 'Social Studies' },
    ],
    assessments: [
        { value: 'all', label: 'All Assessments' },
        { value: 'lat-q1-2026', label: 'LAT Diagnostic Assessment Q1 2026' },
        { value: 'lat-mid-2026', label: 'LAT Mid-Term Evaluation 2026' },
        { value: 'lat-final-2025', label: 'LAT Final Achievement Test 2025' },
    ],
    competencies: [
        { value: 'all', label: 'All Competencies' },
        { value: 'communication', label: 'Communication' },
        { value: 'critical_thinking', label: 'Critical Thinking' },
        { value: 'creativity', label: 'Creativity' },
        { value: 'citizenship', label: 'Citizenship' },
        { value: 'learning_to_learn', label: 'Learning to Learn' },
        { value: 'self_efficacy', label: 'Self Efficacy' },
        { value: 'digital_literacy', label: 'Digital Literacy' },
    ],
    academicYears: [
        { value: '2025-2026', label: 'AY 2025 - 2026' },
        { value: '2024-2025', label: 'AY 2024 - 2025' },
    ],
    assessmentCycles: [
        { value: 'cycle-1', label: 'Cycle 1 (Diagnostic)' },
        { value: 'cycle-2', label: 'Cycle 2 (Midterm)' },
        { value: 'cycle-3', label: 'Cycle 3 (Summative)' },
    ],
};

// Complete Mock Database State for live calculations on client side
export interface CompetencyData {
    name: string;
    avgPerformance: number;
    questionCount: number;
    attemptCount: number;
    correctPct: number;
    incorrectPct: number;
    trend: number[]; // Sparkline history
}

export interface RegionData {
    id: string;
    name: string;
    avgScore: number;
    participationPct: number;
    completionPct: number;
    totalStudents: number;
    totalSchools: number;
    vsNationalAvg: number; // positive or negative percentage difference
}

export interface SchoolData {
    id: string;
    name: string;
    regionId: string;
    avgScore: number;
    completionPct: number;
    totalStudents: number;
    rank: number;
    trend: 'up' | 'down' | 'stable';
}

export interface SubjectData {
    name: string;
    avgScore: number;
    participation: number;
    avgCompletionTime: string; // MM:SS
    questionAccuracy: number;
    mostDifficultConcept: string;
    mostSuccessfulConcept: string;
    weakCompetency: string;
    strongCompetency: string;
}

export interface GradeStats {
    students: number;
    completed: number;
    pending: number;
    avgScore: number;
    avgTimeTaken: string;
    avgAccuracy: number;
    weakestCompetency: string;
    strongestCompetency: string;
    difficultyAnalysis: {
        easyPct: number;
        mediumPct: number;
        hardPct: number;
    };
}

export interface TimelineEvent {
    id: string;
    type: 'question' | 'assessment' | 'student' | 'teacher' | 'report' | 'login';
    description: string;
    timestamp: string;
    user: string;
}

export interface DatabaseState {
    regionsCount: number;
    schoolsCount: number;
    teachersCount: number;
    studentsCount: number;
    questionsCount: number;
    assessmentsCount: number;
    activeAssessmentsCount: number;
    completionPct: number;
    activeUsersToday: number;
    questionsGeneratedToday: number;
    studentsAttemptedToday: number;
    reportsGeneratedToday: number;

    assessmentStatuses: {
        completed: number;
        running: number;
        scheduled: number;
        draft: number;
        expired: number;
        cancelled: number;
    };

    questionBank: {
        total: number;
        approved: number;
        pendingReview: number;
        rejected: number;
        grade3: number;
        grade5: number;
        grade9: number;
        withImages: number;
        geminiGenerated: number;
        difficultyDistribution: {
            easy: number;
            medium: number;
            hard: number;
        };
        competencyDistribution: Record<string, number>;
        subjectDistribution: Record<string, number>;
    };

    competencies: Record<string, CompetencyData>;
    regions: RegionData[];
    schools: SchoolData[];
    subjects: Record<string, SubjectData>;
    grades: Record<string, GradeStats>;
    timeline: TimelineEvent[];
}

export const MOCK_DATABASE_STATE: Record<string, DatabaseState> = {
    'base': {
        regionsCount: 6,
        schoolsCount: 142,
        teachersCount: 1850,
        studentsCount: 38240,
        questionsCount: 12480,
        assessmentsCount: 38,
        activeAssessmentsCount: 5,
        completionPct: 87.6,
        activeUsersToday: 3240,
        questionsGeneratedToday: 245,
        studentsAttemptedToday: 1890,
        reportsGeneratedToday: 412,

        assessmentStatuses: {
            completed: 18,
            running: 5,
            scheduled: 8,
            draft: 4,
            expired: 2,
            cancelled: 1,
        },

        questionBank: {
            total: 12480,
            approved: 10240,
            pendingReview: 1840,
            rejected: 400,
            grade3: 3800,
            grade5: 4200,
            grade9: 4480,
            withImages: 3410,
            geminiGenerated: 9850,
            difficultyDistribution: {
                easy: 3500,
                medium: 5800,
                hard: 3180,
            },
            competencyDistribution: {
                communication: 1850,
                critical_thinking: 1920,
                creativity: 1680,
                citizenship: 1740,
                learning_to_learn: 1820,
                self_efficacy: 1710,
                digital_literacy: 1760,
            },
            subjectDistribution: {
                math: 3240,
                science: 3110,
                english: 3180,
                social: 2950,
            },
        },

        competencies: {
            communication: {
                name: 'Communication',
                avgPerformance: 76.5,
                questionCount: 1850,
                attemptCount: 12400,
                correctPct: 76.5,
                incorrectPct: 23.5,
                trend: [72, 74, 75, 76.5, 78, 76.5],
            },
            critical_thinking: {
                name: 'Critical Thinking',
                avgPerformance: 62.4,
                questionCount: 1920,
                attemptCount: 13100,
                correctPct: 62.4,
                incorrectPct: 37.6,
                trend: [58, 60, 59, 61, 63, 62.4],
            },
            creativity: {
                name: 'Creativity',
                avgPerformance: 69.8,
                questionCount: 1680,
                attemptCount: 11200,
                correctPct: 69.8,
                incorrectPct: 30.2,
                trend: [65, 68, 67, 70, 71, 69.8],
            },
            citizenship: {
                name: 'Citizenship',
                avgPerformance: 81.2,
                questionCount: 1740,
                attemptCount: 10900,
                correctPct: 81.2,
                incorrectPct: 18.8,
                trend: [78, 80, 81, 81.2, 82, 81.2],
            },
            learning_to_learn: {
                name: 'Learning to Learn',
                avgPerformance: 70.5,
                questionCount: 1820,
                attemptCount: 12200,
                correctPct: 70.5,
                incorrectPct: 29.5,
                trend: [66, 68, 69, 71, 70, 70.5],
            },
            self_efficacy: {
                name: 'Self Efficacy',
                avgPerformance: 65.1,
                questionCount: 1710,
                attemptCount: 11900,
                correctPct: 65.1,
                incorrectPct: 34.9,
                trend: [60, 62, 64, 63, 66, 65.1],
            },
            digital_literacy: {
                name: 'Digital Literacy',
                avgPerformance: 74.2,
                questionCount: 1760,
                attemptCount: 12050,
                correctPct: 74.2,
                incorrectPct: 25.8,
                trend: [70, 72, 73, 73.5, 75, 74.2],
            },
        },

        regions: [
            { id: 'reg-north', name: 'Northern Region', avgScore: 78.4, participationPct: 91.2, completionPct: 89.4, totalStudents: 9800, totalSchools: 35, vsNationalAvg: 4.8 },
            { id: 'reg-south', name: 'Southern Region', avgScore: 81.2, participationPct: 94.6, completionPct: 92.5, totalStudents: 10400, totalSchools: 42, vsNationalAvg: 7.6 },
            { id: 'reg-east', name: 'Eastern Region', avgScore: 68.9, participationPct: 82.1, completionPct: 79.8, totalStudents: 7500, totalSchools: 28, vsNationalAvg: -4.7 },
            { id: 'reg-west', name: 'Western Region', avgScore: 72.5, participationPct: 88.3, completionPct: 85.1, totalStudents: 6900, totalSchools: 22, vsNationalAvg: -1.1 },
            { id: 'reg-central', name: 'Central Region', avgScore: 75.8, participationPct: 89.9, completionPct: 88.0, totalStudents: 3640, totalSchools: 15, vsNationalAvg: 2.2 },
        ],

        schools: [
            { id: 'sch-01', name: 'St. Mary Academy', regionId: 'reg-north', avgScore: 85.4, completionPct: 96.2, totalStudents: 420, rank: 1, trend: 'up' },
            { id: 'sch-02', name: 'Delhi Public School', regionId: 'reg-south', avgScore: 84.1, completionPct: 98.0, totalStudents: 680, rank: 2, trend: 'up' },
            { id: 'sch-03', name: 'Royal Heritage High', regionId: 'reg-east', avgScore: 82.5, completionPct: 94.5, totalStudents: 310, rank: 3, trend: 'stable' },
            { id: 'sch-04', name: 'West Academy for Boys', regionId: 'reg-west', avgScore: 80.2, completionPct: 91.0, totalStudents: 540, rank: 4, trend: 'down' },
            { id: 'sch-05', name: 'Central Model School', regionId: 'reg-central', avgScore: 79.5, completionPct: 92.3, totalStudents: 290, rank: 5, trend: 'up' },
            { id: 'sch-06', name: 'Elite International School', regionId: 'reg-south', avgScore: 78.8, completionPct: 94.2, totalStudents: 410, rank: 6, trend: 'stable' },
            { id: 'sch-07', name: 'St. Joseph Convent', regionId: 'reg-north', avgScore: 77.2, completionPct: 89.1, totalStudents: 380, rank: 7, trend: 'up' },
            { id: 'sch-08', name: 'New Era Public School', regionId: 'reg-east', avgScore: 61.5, completionPct: 75.4, totalStudents: 450, rank: 8, trend: 'down' },
            { id: 'sch-09', name: 'City Montessori School', regionId: 'reg-west', avgScore: 59.8, completionPct: 72.8, totalStudents: 520, rank: 9, trend: 'down' },
            { id: 'sch-10', name: 'Government Boys School', regionId: 'reg-central', avgScore: 58.4, completionPct: 70.2, totalStudents: 610, rank: 10, trend: 'down' },
        ],

        subjects: {
            math: {
                name: 'Mathematics',
                avgScore: 68.4,
                participation: 92.4,
                avgCompletionTime: '42:15',
                questionAccuracy: 64.8,
                mostDifficultConcept: 'Quadratic Equations & Ratios',
                mostSuccessfulConcept: 'Basic Geometry',
                weakCompetency: 'Critical Thinking',
                strongCompetency: 'Learning to Learn',
            },
            science: {
                name: 'Science',
                avgScore: 74.2,
                participation: 90.8,
                avgCompletionTime: '38:40',
                questionAccuracy: 71.5,
                mostDifficultConcept: 'Organic Carbon Compounds',
                mostSuccessfulConcept: 'Plant Ecosystems',
                weakCompetency: 'Digital Literacy',
                strongCompetency: 'Creativity',
            },
            english: {
                name: 'English',
                avgScore: 79.5,
                participation: 95.1,
                avgCompletionTime: '31:25',
                questionAccuracy: 80.2,
                mostDifficultConcept: 'Advanced Relative Clauses',
                mostSuccessfulConcept: 'Reading Comprehension',
                weakCompetency: 'Self Efficacy',
                strongCompetency: 'Communication',
            },
            social: {
                name: 'Social Studies',
                avgScore: 76.1,
                participation: 88.6,
                avgCompletionTime: '34:50',
                questionAccuracy: 75.9,
                mostDifficultConcept: 'Chronology of World War Agreements',
                mostSuccessfulConcept: 'Local Administrative Systems',
                weakCompetency: 'Critical Thinking',
                strongCompetency: 'Citizenship',
            },
        },

        grades: {
            '3': {
                students: 11200,
                completed: 9800,
                pending: 1400,
                avgScore: 78.5,
                avgTimeTaken: '28:12',
                avgAccuracy: 79.1,
                weakestCompetency: 'Critical Thinking',
                strongestCompetency: 'Communication',
                difficultyAnalysis: { easyPct: 55, mediumPct: 30, hardPct: 15 },
            },
            '5': {
                students: 12840,
                completed: 11200,
                pending: 1640,
                avgScore: 73.1,
                avgTimeTaken: '36:45',
                avgAccuracy: 72.8,
                weakestCompetency: 'Digital Literacy',
                strongestCompetency: 'Creativity',
                difficultyAnalysis: { easyPct: 40, mediumPct: 42, hardPct: 18 },
            },
            '9': {
                students: 14200,
                completed: 12100,
                pending: 2100,
                avgScore: 67.8,
                avgTimeTaken: '48:30',
                avgAccuracy: 66.5,
                weakestCompetency: 'Critical Thinking',
                strongestCompetency: 'Learning to Learn',
                difficultyAnalysis: { easyPct: 25, mediumPct: 48, hardPct: 27 },
            },
        },

        timeline: [
            { id: 'ev-01', type: 'question', description: '24 New Biology questions approved by system editor', timestamp: '10 minutes ago', user: 'Editor.Sarah' },
            { id: 'ev-02', type: 'assessment', description: 'Grade 9 Mathematics Diagnostic Assessment published', timestamp: '34 minutes ago', user: 'Admin.John' },
            { id: 'ev-03', type: 'student', description: 'Batch import of 420 students completed successfully', timestamp: '1 hour ago', user: 'System.Sync' },
            { id: 'ev-04', type: 'report', description: 'Region Performance Audit PDF generated', timestamp: '2 hours ago', user: 'Manager.David' },
            { id: 'ev-05', type: 'teacher', description: 'New Teacher Account created for St. Mary Academy', timestamp: '4 hours ago', user: 'Admin.John' },
            { id: 'ev-06', type: 'login', description: 'Security audit login detected from new IP address', timestamp: 'Yesterday', user: 'Admin.Super' },
        ],
    },
};

export const QUICK_ACTIONS = [
    { label: 'Generate Questions', path: '/admin/questions', icon: 'âš¡', id: 'act-gen' },
    { label: 'Create Assessment', path: '/admin/dashboard', icon: 'ðŸ“', id: 'act-create' },
    { label: 'Import Students', path: '/admin/dashboard', icon: 'ðŸ“¤', id: 'act-import' },
    { label: 'Add Teacher', path: '/admin/teachers', icon: 'ðŸ‘¤', id: 'act-teacher' },
    { label: 'Generate Report', path: '/admin/reports', icon: 'ðŸ“Š', id: 'act-report' },
    { label: 'Export Excel', path: '#excel', icon: 'ðŸ“¥', id: 'act-excel' },
    { label: 'Export PDF', path: '#pdf', icon: 'ðŸ“•', id: 'act-pdf' },
    { label: 'View Question Bank', path: '/admin/questions', icon: 'ðŸ“‚', id: 'act-qbank' },
    { label: 'Publish Assessment', path: '/admin/dashboard', icon: 'ðŸš€', id: 'act-publish' },
];

export const SYSTEM_HEALTH_STATS = {
    backend: 'Operational',
    database: 'Synced (0.02s delay)',
    gemini: 'Online (API Key Valid)',
    responseTime: '85ms average',
    storage: '34.2 GB / 100 GB (34.2%)',
    todayRequests: '24,850 successful',
    todayErrors: '12 exceptions (0.048%)',
    lastBackup: 'Today at 04:00 AM',
    uptime: '42 days, 18 hours',
};
