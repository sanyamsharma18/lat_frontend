'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { queryOptions, useQuery } from '@tanstack/react-query';

import {
    EXAM_INSTRUCTIONS_AUTO_SHOWN_KEY,
    EXAM_INSTRUCTIONS_ACCEPTED_KEY,
} from '../components/StudentDashboardPage/constant';
import {
    examInstructionsQueryOptions,
    studentProfileQueryOptions,
} from '../components/StudentDashboardPage/utils';

export const useStudentDashboard = () => {
    const router = useRouter();
    const [isInstructionsAccepted, setIsInstructionsAccepted] = useState(false);
    const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);

    const studentProfileQuery = useQuery(queryOptions(studentProfileQueryOptions()));
    const examInstructionsQuery = useQuery(queryOptions(examInstructionsQueryOptions()));

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
        router.push('/student/examination');
    };

    const isLoading = studentProfileQuery.isLoading || examInstructionsQuery.isLoading;
    const isError = studentProfileQuery.isError || examInstructionsQuery.isError;

    const canStartExam = useMemo(
        () => isInstructionsAccepted && Boolean(studentProfileQuery.data),
        [isInstructionsAccepted, studentProfileQuery.data],
    );

    return {
        canStartExam,
        examInstructionsQuery,
        handleAcceptInstructions,
        handleOpenInstructions,
        handleStartExamination,
        isError,
        isInstructionsAccepted,
        isInstructionsModalOpen,
        isLoading,
        setIsInstructionsModalOpen,
        studentProfileQuery,
    };
};
