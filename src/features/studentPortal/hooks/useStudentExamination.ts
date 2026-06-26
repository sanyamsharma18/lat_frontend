'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { showToast } from '@/components/ui/Toaster/constant';

import { QuestionPaletteState } from '@/types/studentPortal';

import { EXAM_SUBMITTED_REDIRECT_PATH } from '../components/StudentExaminationPage/constant';
import {
    examQuestionsQueryKey,
    examQuestionsQueryOptions,
    formatTime,
    saveExamAnswer,
    submitExam,
} from '../components/StudentExaminationPage/utils';

const EXAM_PROGRESS_STORAGE_KEY = 'lat_student_exam_progress';
const EXAM_REFRESH_WARNING_KEY = 'lat_student_exam_refresh_warning';

interface StoredExamProgress {
    answers: Record<number, string>;
    currentQuestionIndex: number;
    remainingSeconds: number | null;
    visitedQuestionIds: number[];
}

const readStoredExamProgress = (): StoredExamProgress | null => {
    try {
        const storedProgress = window.localStorage.getItem(EXAM_PROGRESS_STORAGE_KEY);

        return storedProgress ? (JSON.parse(storedProgress) as StoredExamProgress) : null;
    } catch {
        return null;
    }
};

const isRestorableExamProgress = (
    storedProgress: StoredExamProgress | null,
): storedProgress is StoredExamProgress =>
    Boolean(
        storedProgress &&
        typeof storedProgress.remainingSeconds === 'number' &&
        storedProgress.remainingSeconds > 0,
    );

export const useStudentExamination = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [visitedQuestionIds, setVisitedQuestionIds] = useState<Set<number>>(new Set());
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [isExamSubmitted, setIsExamSubmitted] = useState(false);
    const hasSubmittedRef = useRef(false);

    const examQuestionsQuery = useQuery(queryOptions(examQuestionsQueryOptions()));
    const exam = examQuestionsQuery.data;

    const questions = exam?.questions ?? [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = exam?.totalQuestions ?? questions.length;

    useEffect(() => {
        const storedProgress = readStoredExamProgress();

        if (isRestorableExamProgress(storedProgress)) {
            setAnswers(storedProgress.answers);
            setCurrentQuestionIndex(
                Math.min(storedProgress.currentQuestionIndex, Math.max(questions.length - 1, 0)),
            );
            setVisitedQuestionIds(new Set(storedProgress.visitedQuestionIds));
            setRemainingSeconds(storedProgress.remainingSeconds);

            if (window.sessionStorage.getItem(EXAM_REFRESH_WARNING_KEY) === 'true') {
                showToast({
                    type: 'error',
                    message:
                        'Refreshing during the examination is not allowed. Your progress was restored.',
                });
                window.sessionStorage.removeItem(EXAM_REFRESH_WARNING_KEY);
            }

            return;
        }

        if (storedProgress) {
            window.localStorage.removeItem(EXAM_PROGRESS_STORAGE_KEY);
        }

        if (exam?.duration) {
            setRemainingSeconds(exam.duration * 60);
        }
    }, [exam?.duration, questions.length]);

    useEffect(() => {
        if (!currentQuestion) {
            return;
        }

        setVisitedQuestionIds((previous) => new Set(previous).add(currentQuestion.id));
    }, [currentQuestion]);

    const submitExamMutation = useMutation({
        mutationKey: ['submit-exam'],
        mutationFn: submitExam,
        onSuccess: () => {
            window.localStorage.removeItem(EXAM_PROGRESS_STORAGE_KEY);
            window.sessionStorage.removeItem(EXAM_REFRESH_WARNING_KEY);
            setIsExamSubmitted(true);
            showToast({ message: 'Examination submitted successfully', type: 'success' });
            queryClient.invalidateQueries({ queryKey: examQuestionsQueryKey() });
            setTimeout(() => {
                router.replace(EXAM_SUBMITTED_REDIRECT_PATH);
            }, 2000);
        },
        onError: (error) => {
            hasSubmittedRef.current = false;
            showToast({
                message: error instanceof Error ? error.message : 'Unable to submit examination',
                type: 'error',
            });
        },
    });

    const saveAnswerMutation = useMutation({
        mutationKey: ['save-answer'],
        mutationFn: saveExamAnswer,
        onError: (error) => {
            showToast({
                message: error instanceof Error ? error.message : 'Unable to save answer',
                type: 'error',
            });
        },
    });

    const formattedRemainingTime = useMemo(() => formatTime(remainingSeconds), [remainingSeconds]);

    const handleSubmitExam = useCallback(() => {
        if (!exam || hasSubmittedRef.current) {
            return;
        }

        hasSubmittedRef.current = true;
        submitExamMutation.mutate({
            examId: exam.examId,
            answers,
        });
    }, [answers, exam, submitExamMutation]);

    useEffect(() => {
        if (!exam || remainingSeconds === null || hasSubmittedRef.current) {
            return undefined;
        }

        if (remainingSeconds <= 0) {
            handleSubmitExam();
            return undefined;
        }

        const timer = window.setInterval(() => {
            setRemainingSeconds((previous) => (previous !== null ? Math.max(previous - 1, 0) : 0));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [exam, remainingSeconds, handleSubmitExam]);

    const handleSelectAnswer = useCallback(
        (selectedAnswer: string) => {
            if (!exam || !currentQuestion || isExamSubmitted) {
                return;
            }

            setAnswers((previous) => ({
                ...previous,
                [currentQuestion.id]: selectedAnswer,
            }));

            saveAnswerMutation.mutate({
                examId: exam.examId,
                questionId: currentQuestion.id,
                selectedAnswer,
            });
        },
        [currentQuestion, exam, isExamSubmitted, saveAnswerMutation],
    );

    const handleNextQuestion = useCallback(() => {
        setCurrentQuestionIndex((previous) => Math.min(previous + 1, questions.length - 1));
    }, [questions.length]);

    const handlePreviousQuestion = useCallback(() => {
        setCurrentQuestionIndex((previous) => Math.max(previous - 1, 0));
    }, []);

    const handleSelectQuestion = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
    }, []);

    const getQuestionState = useCallback(
        (questionId: number, index: number): QuestionPaletteState => {
            if (index === currentQuestionIndex) {
                return 'current';
            }

            if (answers[questionId]) {
                return 'answered';
            }

            if (visitedQuestionIds.has(questionId)) {
                return 'visited';
            }

            return 'notVisited';
        },
        [answers, currentQuestionIndex, visitedQuestionIds],
    );

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    useEffect(() => {
        if (!exam || isExamSubmitted) {
            return;
        }

        if (remainingSeconds === null) {
            return;
        }

        const progress: StoredExamProgress = {
            answers,
            currentQuestionIndex,
            remainingSeconds,
            visitedQuestionIds: Array.from(visitedQuestionIds),
        };

        window.localStorage.setItem(EXAM_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }, [
        answers,
        currentQuestionIndex,
        exam,
        isExamSubmitted,
        remainingSeconds,
        visitedQuestionIds,
    ]);

    useEffect(() => {
        if (!exam || isExamSubmitted) {
            return undefined;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            window.sessionStorage.setItem(EXAM_REFRESH_WARNING_KEY, 'true');
            event.preventDefault();
            event.returnValue = 'Refreshing during the examination is not allowed.';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [exam, isExamSubmitted]);

    useEffect(() => {
        if (!isExamSubmitted) {
            return;
        }

        window.localStorage.removeItem(EXAM_PROGRESS_STORAGE_KEY);
        window.sessionStorage.removeItem(EXAM_REFRESH_WARNING_KEY);
    }, [isExamSubmitted]);

    return {
        answeredCount,
        answers,
        currentQuestion,
        currentQuestionIndex,
        exam,
        examQuestionsQuery,
        formattedRemainingTime,
        getQuestionState,
        handleNextQuestion,
        handlePreviousQuestion,
        handleSelectAnswer,
        handleSelectQuestion,
        handleSubmitExam,
        isFirstQuestion: currentQuestionIndex === 0,
        isExamSubmitted,
        isLastQuestion: currentQuestionIndex === questions.length - 1,
        isSavingAnswer: saveAnswerMutation.isPending,
        isSubmitting: submitExamMutation.isPending,
        questions,
        remainingSeconds,
        totalQuestions,
    };
};
