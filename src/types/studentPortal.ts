export interface StudentProfile {
    id: string;
    fullName: string;
    username: string;
    grade: string;
    section: string;
    rollNumber: string;
}

export interface ExamInstruction {
    id: string;
    label: string;
}

export interface ExamInstructionsResponse {
    title: string;
    instructions: ExamInstruction[];
}

export type ExamQuestionType = 'single-choice' | 'image-option';

export interface ImageQuestionOption {
    id: string;
    label: string;
    imageUrl: string;
    isCorrect: boolean;
}

export interface SingleChoiceQuestion {
    id: number;
    question: string;
    instruction?: string;
    stimulus?: string;
    imageUrl?: string | null;
    type?: 'single-choice';
    options: string[];
    optionLabels?: Record<string, string>;
    optionLetters?: Record<string, string>;
    optionImageUrls?: Record<string, string | null>;
    correctAnswer: string;
}

export interface ImageOptionQuestion {
    id: number;
    question: string;
    type: 'image-option';
    options: ImageQuestionOption[];
}

export type ExamQuestion = SingleChoiceQuestion | ImageOptionQuestion;

export interface ExamQuestionsResponse {
    examId: number;
    title: string;
    duration: number;
    totalQuestions: number;
    questions: ExamQuestion[];
}

export interface BackendExamQuestionOption {
    id: string;
    option_letter: string;
    option_text: string;
    requires_image: number;
    image_prompt: string;
    image_url: string | null;
    imageUrl?: string | null;
}

export interface BackendExamQuestion {
    id: string;
    instruction: string;
    stimulus: string;
    question_text: string;
    requires_image: number;
    image_prompt: string;
    image_url: string | null;
    imageUrl?: string | null;
    options: BackendExamQuestionOption[];
}

export interface StudentExamQuestionsPayload {
    studentId: number;
    termId: number;
}

export interface StudentExamCheckPayload {
    studentId: number;
    termId: number;
    subjectId?: number;
}

export interface StudentExamCheckResponse {
    message: string;
    status: string;
}

export interface SaveAnswerPayload {
    examId: number;
    questionId: number;
    selectedAnswer: string;
}

export interface SubmitExamPayload {
    examId: number;
    answers: Record<number, string>;
}

export type QuestionPaletteState = 'notVisited' | 'visited' | 'answered' | 'current';
