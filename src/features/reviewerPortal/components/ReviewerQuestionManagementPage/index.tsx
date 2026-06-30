'use client';

import { useMemo } from 'react';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { ReviewerQuestion, ReviewerQuestionStatus } from '@/types/reviewerQuestion';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useReviewerQuestionManagement } from '../../hooks/useReviewerQuestionManagement';

import QuestionReviewModal from './components/QuestionReviewModal';
import {
    REVIEWER_QUESTION_TEXT,
    STATUS_OPTIONS,
    TERM_OPTIONS,
} from './constant';

import styles from './styles.module.scss';

const sanitizeHtml = (value: string) =>
    value
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/\son\w+='[^']*'/gi, '');

const HtmlQuestionText = ({ value }: { value: string }) => (
    <div
        className={styles.htmlQuestionText}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
    />
);

const StatusBadge = ({ status }: { status: ReviewerQuestionStatus }) => (
    <span
        className={cx(
            styles.statusBadge,
            status === 'Approved' && styles.statusApproved,
            status === 'Draft' && styles.statusDraft,
            status === 'Rejected' && styles.statusRejected,
        )}
    >
        {status}
    </span>
);

const getQuestionColumns = (
    onPreview: (question: ReviewerQuestion) => void,
): DataTableColumn<ReviewerQuestion>[] => [
    {
        id: 'questionId',
        header: REVIEWER_QUESTION_TEXT.questionIdColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='black'>
                {question.questionId}
            </Text>
        ),
    },
    {
        id: 'grade',
        header: REVIEWER_QUESTION_TEXT.gradeColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.grade}
            </Text>
        ),
    },
    {
        id: 'subject',
        header: REVIEWER_QUESTION_TEXT.subjectColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.subject}
            </Text>
        ),
    },
    {
        id: 'competency',
        header: REVIEWER_QUESTION_TEXT.competencyColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.competency}
            </Text>
        ),
    },
    {
        id: 'questionText',
        header: REVIEWER_QUESTION_TEXT.questionTextColumn,
        className: styles.questionTextColumn,
        cell: (question) => <HtmlQuestionText value={question.questionText} />,
    },
    {
        id: 'status',
        header: REVIEWER_QUESTION_TEXT.statusColumn,
        cell: (question) => <StatusBadge status={question.status} />,
    },
    {
        id: 'image',
        header: REVIEWER_QUESTION_TEXT.imageColumn,
        cell: () => (
            <div>
                <span className={styles.imageAction}>{REVIEWER_QUESTION_TEXT.uploadText}</span>
                <span className={styles.imageEmpty}>-</span>
            </div>
        ),
    },
    {
        id: 'actions',
        header: REVIEWER_QUESTION_TEXT.actionsColumn,
        cell: (question) => (
            <button
                type='button'
                className={styles.viewButton}
                onClick={() => onPreview(question)}
            >
                {REVIEWER_QUESTION_TEXT.viewText}
            </button>
        ),
    },
];

const getRenderMobileCard =
    (onPreview: (question: ReviewerQuestion) => void) => (question: ReviewerQuestion) => {
        const { grade, questionId, questionText, status, subject } = question;

        return (
            <div className={styles.mobileCardContent}>
                <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='black'>
                    {questionId}
                </Text>
                <HtmlQuestionText value={questionText} />
                <div className={styles.mobileMeta}>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {grade}
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {subject}
                    </Text>
                </div>
                <StatusBadge status={status} />
                <button
                    type='button'
                    className={styles.viewButton}
                    onClick={() => onPreview(question)}
                >
                    {REVIEWER_QUESTION_TEXT.viewText}
                </button>
            </div>
        );
    };

const ReviewerQuestionManagementPage = () => {
    const {
        competenciesLoading,
        competencyOptions,
        gradeGroupOptions,
        gradeGroupLoading,
        gradeOptions,
        gradesLoading,
        handleGradeChange,
        handleGradeGroupChange,
        handleOpenPreview,
        handleResetFilters,
        handleReviewQuestion,
        handleSearchChange,
        handleSubjectChange,
        handleTermChange,
        hasActiveFilters,
        isPreviewOpen,
        isReviewing,
        page,
        questionListQuery,
        searchValue,
        selectedCompetency,
        selectedGrade,
        selectedGradeGroup,
        selectedQuestion,
        selectedStatus,
        selectedSubject,
        selectedTerm,
        setIsPreviewOpen,
        setPage,
        setSelectedCompetency,
        setSelectedStatus,
        subjectOptions,
        subjectsLoading,
        totalPages,
    } = useReviewerQuestionManagement();

    const columns = useMemo(() => getQuestionColumns(handleOpenPreview), [handleOpenPreview]);
    const renderMobileCard = useMemo(
        () => getRenderMobileCard(handleOpenPreview),
        [handleOpenPreview],
    );

    const renderTableContent = () => {
        if (questionListQuery.isLoading) {
            return (
                <div className={styles.loadingState} role='status' aria-live='polite'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ShimmerUiContainer
                            key={`reviewer-question-loading-${index + 1}`}
                            className={styles.shimmerRow}
                        />
                    ))}
                </div>
            );
        }

        if (questionListQuery.isError) {
            return (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {REVIEWER_QUESTION_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={REVIEWER_QUESTION_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => questionListQuery.refetch()}
                    />
                </div>
            );
        }

        return (
            <DataTable
                columns={columns}
                data={questionListQuery.data?.questions ?? []}
                getRowKey={(question) => question.id}
                emptyText={REVIEWER_QUESTION_TEXT.emptyText}
                renderMobileCard={renderMobileCard}
            />
        );
    };

    return (
        <main className={styles.page}>
            <section className={styles.panel}>
                <div className={styles.panelTitle}>
                    <Text
                        tagType='h1'
                        font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                        color='black'
                    >
                        {REVIEWER_QUESTION_TEXT.searchTitle}
                    </Text>
                </div>

                <div className={styles.searchGrid}>
                    <Input
                        id='reviewerQuestionSearch'
                        label={REVIEWER_QUESTION_TEXT.searchLabel}
                        name='reviewerQuestionSearch'
                        type='search'
                        value={searchValue}
                        placeholder={REVIEWER_QUESTION_TEXT.searchPlaceholder}
                        onChange={handleSearchChange}
                        autoComplete='off'
                    />
                    <Dropdown
                        label='Select Grade Group'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.gradeGroupLabel}
                        options={gradeGroupOptions}
                        selectValue='name'
                        value={selectedGradeGroup}
                        onChange={handleGradeGroupChange}
                        isSearchable={false}
                        loading={gradeGroupLoading}
                    />
                    <Dropdown
                        label='Select Grade'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.gradeLabel}
                        options={gradeOptions}
                        selectValue='name'
                        value={selectedGrade}
                        onChange={handleGradeChange}
                        isSearchable={false}
                        loading={gradesLoading}
                        disable={!selectedGradeGroup}
                    />
                    <Dropdown
                        label='Select Subject'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.subjectLabel}
                        options={subjectOptions}
                        selectValue='name'
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        isSearchable={false}
                        loading={subjectsLoading}
                        disable={!selectedGrade}
                    />
                    <Dropdown
                        label='Select Term'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.termLabel}
                        options={TERM_OPTIONS}
                        selectValue='name'
                        value={selectedTerm}
                        onChange={handleTermChange}
                        isSearchable={false}
                        disable={!selectedSubject}
                    />
                    <Dropdown
                        label='Select Competency'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.competencyLabel}
                        options={competencyOptions}
                        selectValue='name'
                        value={selectedCompetency}
                        onChange={setSelectedCompetency}
                        isSearchable={false}
                        loading={competenciesLoading}
                        disable={!selectedTerm}
                    />
                </div>

                <div className={styles.statusRow}>
                    <Dropdown
                        label='All'
                        dropDownTitle={REVIEWER_QUESTION_TEXT.statusLabel}
                        options={STATUS_OPTIONS}
                        selectValue='name'
                        value={selectedStatus}
                        onChange={setSelectedStatus}
                        isSearchable={false}
                    />
                    <Button
                        type='button'
                        label={REVIEWER_QUESTION_TEXT.resetButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={handleResetFilters}
                        disabled={!hasActiveFilters}
                        className={styles.resetButton}
                    />
                </div>
            </section>

            <section className={styles.tablePanel}>
                <div className={styles.tableHeader}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {REVIEWER_QUESTION_TEXT.listTitle}
                    </Text>
                </div>
                {renderTableContent()}
                <div className={styles.tableFooter}>
                    <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                        Showing page {page} of {totalPages}
                    </Text>
                    <nav
                        className={styles.pagination}
                        aria-label={REVIEWER_QUESTION_TEXT.paginationLabel}
                    >
                        <Button
                            type='button'
                            label={REVIEWER_QUESTION_TEXT.previousButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            disabled={page <= 1 || questionListQuery.isLoading}
                            onClick={() => setPage(Math.max(page - 1, 1))}
                        />
                        <Button
                            type='button'
                            label={REVIEWER_QUESTION_TEXT.nextButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            disabled={page >= totalPages || questionListQuery.isLoading}
                            onClick={() => setPage(Math.min(page + 1, totalPages))}
                        />
                    </nav>
                </div>
            </section>

            <QuestionReviewModal
                open={isPreviewOpen}
                question={selectedQuestion}
                isSubmitting={isReviewing}
                onClose={() => setIsPreviewOpen(false)}
                onSubmit={handleReviewQuestion}
            />

            <Toaster />
        </main>
    );
};

export default ReviewerQuestionManagementPage;
