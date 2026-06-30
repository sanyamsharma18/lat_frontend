export type ReviewerQuestionStatus = 'Draft' | 'Approved' | 'Rejected';

export interface ReviewerQuestionOption {
    id: string;
    label?: string;
    text: string;
    isCorrect?: boolean;
    imageUrl?: string | null;
    imagePrompt?: string;
    rationale?: string;
}

export interface ReviewerQuestion {
    id: string;
    questionId: string;
    gradeGroup: string;
    grade: string;
    subject: string;
    term: string;
    competency: string;
    questionText: string;
    instruction: string;
    stimulus: string;
    status: ReviewerQuestionStatus;
    imageUrl: string | null;
    options: ReviewerQuestionOption[];
    answerExplanation?: string;
}

export interface ReviewerQuestionFilters {
    search: string;
    gradeGroup?: string;
    grade: string;
    subject: string;
    term: string;
    competency: string;
    status: string;
    page: number;
    limit: number;
}

export interface ReviewerQuestionListResponse {
    questions: ReviewerQuestion[];
    total: number;
    page: number;
    limit: number;
}

export interface ReviewQuestionPayload {
    status: 'Approved' | 'Rejected';
    remark: string;
}
