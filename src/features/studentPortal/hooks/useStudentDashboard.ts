'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { queryOptions, useQuery } from '@tanstack/react-query';

import {
    ExamInstructionsResponse,
    StudentExamCheckResponse,
    StudentProfile,
} from '@/types/studentPortal';
import {
    EXAM_INSTRUCTIONS_AUTO_SHOWN_KEY,
    EXAM_INSTRUCTIONS_ACCEPTED_KEY,
    STUDENT_DASHBOARD_TEXT,
} from '../components/StudentDashboardPage/constant';
import {
    examInstructionsQueryOptions,
    studentExamStatusQueryOptions,
    studentProfileQueryOptions,
} from '../components/StudentDashboardPage/utils';

const AVAILABLE_EXAM_STATUS = 'NOT_STARTED';

const normalizeExamStatus = (status?: string) => status?.trim().toUpperCase();

export const useStudentDashboard = (
    initialProfile?: StudentProfile,
    initialInstructions?: ExamInstructionsResponse,
    initialExamStatus?: StudentExamCheckResponse,
) => {
    const router = useRouter();
    const [isInstructionsAccepted, setIsInstructionsAccepted] = useState(false);
    const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

    const studentProfileQuery = useQuery(
        queryOptions(studentProfileQueryOptions(initialProfile)),
    );
    const examInstructionsQuery = useQuery(
        queryOptions(examInstructionsQueryOptions(initialInstructions)),
    );
    const studentExamStatusQuery = useQuery(
        queryOptions(
            studentExamStatusQueryOptions(studentProfileQuery.data?.id, initialExamStatus),
        ),
    );
    const examStatus = studentExamStatusQuery.data;

    useEffect(() => {
        const accepted = window.localStorage.getItem(EXAM_INSTRUCTIONS_ACCEPTED_KEY) === 'true';
        const autoShown =
            window.sessionStorage.getItem(EXAM_INSTRUCTIONS_AUTO_SHOWN_KEY) === 'true';

        setIsInstructionsAccepted(accepted);

        if (!accepted || !autoShown) {
            setIsInstructionsModalOpen(true);
            window.sessionStorage.setItem(EXAM_INSTRUCTIONS_AUTO_SHOWN_KEY, 'true');
        }
    }, []);

    const handleAcceptInstructions = () => {
        window.localStorage.setItem(EXAM_INSTRUCTIONS_ACCEPTED_KEY, 'true');
        setIsInstructionsAccepted(true);
        setIsInstructionsModalOpen(false);
    };

    const handleOpenInstructions = () => {
        setIsInstructionsModalOpen(true);
    };

    const handleStartExamination = () => {
        if (normalizeExamStatus(examStatus?.status) !== AVAILABLE_EXAM_STATUS) {
            studentExamStatusQuery.refetch();
            return;
        }

        router.push('/student/examination');
    };

    const isLoading =
        studentProfileQuery.isLoading ||
        examInstructionsQuery.isLoading ||
        studentExamStatusQuery.isLoading;
    const isError = studentProfileQuery.isError || examInstructionsQuery.isError;
    const canStartExam =
        isInstructionsAccepted &&
        normalizeExamStatus(examStatus?.status) === AVAILABLE_EXAM_STATUS &&
        !studentExamStatusQuery.isError;

    const getExamStatusLabel = () => {
        if (studentExamStatusQuery.isLoading || studentExamStatusQuery.isFetching) {
            return STUDENT_DASHBOARD_TEXT.examStatusLoading;
        }

        if (studentExamStatusQuery.isError || !examStatus) {
            return STUDENT_DASHBOARD_TEXT.examStatusUnavailable;
        }

        return examStatus.message || STUDENT_DASHBOARD_TEXT.examStatusUnavailable;
    };


    return {
        canStartExam,
        examStatus,
        examInstructionsQuery,
        getExamStatusLabel,
        handleAcceptInstructions,
        handleOpenInstructions,
        handleStartExamination,
        isError,
        isInstructionsAccepted,
        isInstructionsModalOpen,
        isLoading,
        setIsInstructionsModalOpen,
        studentExamStatusQuery,
        studentProfileQuery,
    };
};
