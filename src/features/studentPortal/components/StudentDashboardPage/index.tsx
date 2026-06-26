'use client';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useStudentDashboard } from '../../hooks/useStudentDashboard';

import ExamInstructionsModal from './components/ExamInstructionsModal';
import { STUDENT_DASHBOARD_TEXT } from './constant';

import styles from './styles.module.scss';

const StudentDashboardPage = () => {
    const {
        canStartExam,
        examInstructionsQuery,
        handleAcceptInstructions,
        handleOpenInstructions,
        handleStartExamination,
        isError,
        isInstructionsModalOpen,
        isLoading,
        setIsInstructionsModalOpen,
        studentExamStatusQuery,
        studentProfileQuery,
    } = useStudentDashboard();

    const profile = studentProfileQuery.data;
    const examStatus = studentExamStatusQuery.data;

    const getExamStatusLabel = () => {
        if (studentExamStatusQuery.isFetching) {
            return STUDENT_DASHBOARD_TEXT.examStatusLoading;
        }

        if (!examStatus) {
            return STUDENT_DASHBOARD_TEXT.examStatusUnavailable;
        }

        if (examStatus.status === 'COMPLETED') {
            return STUDENT_DASHBOARD_TEXT.examCompletedText;
        }

        if (examStatus.status === 'NOT_UNDER_SCHEDULED') {
            return STUDENT_DASHBOARD_TEXT.examNotScheduledText;
        }

        return examStatus.message || STUDENT_DASHBOARD_TEXT.statusValue;
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className={styles.card} role='status' aria-live='polite'>
                    <ShimmerUiContainer className={styles.shimmerTitle} />
                    <ShimmerUiContainer className={styles.shimmerLine} />
                    <ShimmerUiContainer className={styles.shimmerLine} />
                    <ShimmerUiContainer className={styles.shimmerButton} />
                </div>
            );
        }

        if (isError || !profile) {
            return (
                <div className={styles.card} role='alert'>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='red-600'
                    >
                        {STUDENT_DASHBOARD_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={STUDENT_DASHBOARD_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => {
                            studentProfileQuery.refetch();
                            examInstructionsQuery.refetch();
                            studentExamStatusQuery.refetch();
                        }}
                    />
                </div>
            );
        }

        return (
            <section className={styles.card} aria-label={STUDENT_DASHBOARD_TEXT.informationTitle}>
                <div className={styles.cardHeader}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                        color='black'
                    >
                        {STUDENT_DASHBOARD_TEXT.informationTitle}
                    </Text>
                    <span className={styles.statusBadge}>
                        <Text
                            font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                            color='green-600'
                        >
                            {STUDENT_DASHBOARD_TEXT.statusValue}
                        </Text>
                    </span>
                </div>

                <div
                    className={cx(
                        styles.examStatusCard,
                        examStatus?.status === 'COMPLETED' && styles.examStatusCompleted,
                        examStatus?.status === 'NOT_UNDER_SCHEDULED' &&
                            styles.examStatusUnavailable,
                    )}
                    role='status'
                    aria-live='polite'
                >
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {STUDENT_DASHBOARD_TEXT.examStatusLabel}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {getExamStatusLabel()}
                    </Text>
                </div>

                <dl className={styles.infoGrid}>
                    <div>
                        <Text
                            font={[FontType.text_md_medium, FontType.text_md_medium]}
                            color='black'
                        >
                            {STUDENT_DASHBOARD_TEXT.nameLabel}
                        </Text>
                        <Text
                            font={[FontType.text_md_regular, FontType.text_md_regular]}
                            color='black'
                        >
                            {profile.fullName}
                        </Text>
                    </div>
                    <div>
                        <Text
                            font={[FontType.text_md_medium, FontType.text_md_medium]}
                            color='black'
                        >
                            {STUDENT_DASHBOARD_TEXT.gradeLabel}
                        </Text>
                        <Text
                            font={[FontType.text_md_regular, FontType.text_md_regular]}
                            color='black'
                        >
                            {profile.grade}
                        </Text>
                    </div>
                    <div>
                        <Text
                            font={[FontType.text_md_medium, FontType.text_md_medium]}
                            color='black'
                        >
                            {STUDENT_DASHBOARD_TEXT.sectionLabel}
                        </Text>
                        <Text
                            font={[FontType.text_md_regular, FontType.text_md_regular]}
                            color='black'
                        >
                            {profile.section}
                        </Text>
                    </div>
                    <div>
                        <Text
                            font={[FontType.text_md_medium, FontType.text_md_medium]}
                            color='black'
                        >
                            {STUDENT_DASHBOARD_TEXT.rollNumberLabel}
                        </Text>
                        <Text
                            font={[FontType.text_md_regular, FontType.text_md_regular]}
                            color='black'
                        >
                            {profile.rollNumber}
                        </Text>
                    </div>
                </dl>

                <Button
                    type='button'
                    label={STUDENT_DASHBOARD_TEXT.startButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    size='large'
                    className={styles.startButton}
                    disabled={!canStartExam}
                    onClick={handleStartExamination}
                />

                <Button
                    type='button'
                    label={STUDENT_DASHBOARD_TEXT.rulesButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={styles.startButton}
                    onClick={handleOpenInstructions}
                />
            </section>
        );
    };

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <Text
                    tagType='h1'
                    font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                    color='black'
                >
                    {STUDENT_DASHBOARD_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {STUDENT_DASHBOARD_TEXT.subtitle}
                </Text>
            </section>

            <div className={styles.content}>{renderContent()}</div>

            <ExamInstructionsModal
                open={isInstructionsModalOpen}
                instructions={examInstructionsQuery.data}
                onAccept={handleAcceptInstructions}
                onCancel={() => setIsInstructionsModalOpen(false)}
                showCancel={canStartExam}
            />

            <Toaster />
        </main>
    );
};

export default StudentDashboardPage;
