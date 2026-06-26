export type QuestionStatus = 'Active' | 'Draft' | 'Inactive';

export interface QuestionOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface QuestionRecord {
    id: string;
    questionId: string;
    gradeGroup: string;
    grade: string;
    subject: string;
    competency: string;
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
    questionText: string;
    status: QuestionStatus;
    imageUrl: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOptionId: string;
    answerExplanation: string;
}

export interface GenerateQuestionsPayload {
    gradeGroup: string;
    grade: string;
    subject: string;
    competency: string;
    count: number;
}

export interface QuestionOptionItem {
    id: string;
    name: string;
}
