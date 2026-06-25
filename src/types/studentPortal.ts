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
    type?: 'single-choice';
    options: string[];
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
