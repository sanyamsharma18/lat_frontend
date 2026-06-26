export type QuestionStatus = 'Active' | 'Draft' | 'Inactive';

export interface QuestionOption {
    id: string;
    relationKey: string;
    text: string;
    isCorrect: boolean;
    optionId?: number;
    imageUrl?: string | null;
    rationale?: string;
}

export interface QuestionRecord {
    id: string;
    questionId: string;
    gradeGroup: string;
    grade: string;
    subject: string;
    competency: string;
    instruction: string;
    stimulus?: string;
    questionText: string;
    status: QuestionStatus;
    imageUrl?: string;
    options: QuestionOption[];
    answerExplanation?: string;
    createdAt: string;
    updatedAt: string;
}


export interface QuestionListFilters {
    search: string;
    grade: string;
    subject: string;
    competency: string;
    status: string;
    page: number;
    limit: number;
}

export interface QuestionListResponse {
    questions: QuestionRecord[];
    total: number;
    page: number;
    limit: number;
}

export interface QuestionFormValues {
    gradeGroup: string;
    grade: string;
    subject: string;
    competency: string;
    instruction: string;
    questionText: string;
    status: QuestionStatus;
    imageUrl: string;
    optionA: string;
    optionARelationKey: string;
    optionB: string;
    optionBRelationKey: string;
    optionC: string;
    optionCRelationKey: string;
    optionD: string;
    optionDRelationKey: string;
    correctOptionId: string;
    answerExplanation: string;
}

export interface GenerateQuestionsPayload {
    gradeGroup: string;
    grade: string;
    subject: string;
    term: string;
    competencyIds: string[];
    count: number;
}

export interface QuestionOptionItem {
    id: string;
    name: string;
}
