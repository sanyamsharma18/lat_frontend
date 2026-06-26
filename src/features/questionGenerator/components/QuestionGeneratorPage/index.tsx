'use client';

import { ChangeEvent, useMemo } from 'react';
import Image from 'next/image';

import cx from 'classnames';

import AddIcon from '@/assets/svg/buttonIcon/add-icon.svg';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { QuestionOptionItem, QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useQuestionGenerator } from '../../hooks/useQuestionGenerator';

import DeleteQuestionModal from './components/DeleteQuestionModal';
import QuestionFormModal from './components/QuestionFormModal';
import QuestionPreviewModal from './components/QuestionPreviewModal';
import {
    ALL_COMPETENCY_OPTIONS,
    ALL_GRADE_OPTIONS,
    ALL_STATUS_OPTIONS,
    ALL_SUBJECT_OPTIONS,
    COMPETENCY_OPTIONS,
    GRADE_GROUP_OPTIONS,
    GRADE_OPTIONS,
    QUESTION_GENERATOR_TEXT,
    SUBJECT_OPTIONS,
} from './constant';

import styles from './styles.module.scss';

interface QuestionActionHandlers {
    onPreview: (question: QuestionRecord) => void;
    onEdit: (question: QuestionRecord) => void;
    onDelete: (question: QuestionRecord) => void;
}

const getOption = (options: QuestionOptionItem[], id?: string) =>
    options.find((option) => option.id === id) ?? null;

const StatusBadge = ({ status }: { status: QuestionRecord['status'] }) => (
    <span
        className={cx(
            styles.statusBadge,
            status === 'Active' && styles.statusActive,
            status === 'Draft' && styles.statusDraft,
            status === 'Inactive' && styles.statusInactive,
        )}
    >
        {status}
    </span>
);

const QuestionActions = ({ question, onPreview, onEdit, onDelete }: QuestionActionHandlers & {
    question: QuestionRecord;
}) => (
    <div className={styles.rowActions}>
        <button
            type='button'
            className={styles.iconButton}
            onClick={() => onPreview(question)}
            aria-label={QUESTION_GENERATOR_TEXT.viewAction}
            title={QUESTION_GENERATOR_TEXT.viewAction}
        >
            View
        </button>
        <button
            type='button'
            className={styles.iconButton}
            onClick={() => onEdit(question)}
            aria-label={QUESTION_GENERATOR_TEXT.editAction}
            title={QUESTION_GENERATOR_TEXT.editAction}
        >
            Edit
        </button>
        <button
            type='button'
            className={cx(styles.iconButton, styles.deleteIconButton)}
            onClick={() => onDelete(question)}
            aria-label={QUESTION_GENERATOR_TEXT.deleteAction}
            title={QUESTION_GENERATOR_TEXT.deleteAction}
        >
            Del
        </button>
    </div>
);

const getQuestionColumns = (handlers: QuestionActionHandlers): DataTableColumn<QuestionRecord>[] => [
    {
        id: 'questionId',
        header: QUESTION_GENERATOR_TEXT.questionIdColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='black'>
                {question.questionId}
            </Text>
        ),
    },
    {
        id: 'grade',
        header: QUESTION_GENERATOR_TEXT.gradeColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.grade}
            </Text>
        ),
    },
    {
        id: 'subject',
        header: QUESTION_GENERATOR_TEXT.subjectColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.subject}
            </Text>
        ),
    },
    {
        id: 'competency',
        header: QUESTION_GENERATOR_TEXT.competencyColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {question.competency}
            </Text>
        ),
    },
    {
        id: 'questionText',
        header: QUESTION_GENERATOR_TEXT.questionTextColumn,
        className: styles.questionTextColumn,
        cell: (question) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='black'>
                {question.questionText}
            </Text>
        ),
    },
    {
        id: 'status',
        header: QUESTION_GENERATOR_TEXT.statusColumn,
        cell: (question) => <StatusBadge status={question.status} />,
    },
    {
        id: 'image',
        header: QUESTION_GENERATOR_TEXT.imageColumn,
        cell: (question) =>
            question.imageUrl ? (
                <div className={styles.thumbnail}>
                    <Image
                        src={question.imageUrl}
                        alt={`Preview for ${question.questionId}`}
                        width={72}
                        height={44}
                    />
                </div>
            ) : (
                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]} color='gray-500'>
                    {QUESTION_GENERATOR_TEXT.noImageText}
                </Text>
            ),
    },
    {
        id: 'actions',
        header: QUESTION_GENERATOR_TEXT.actionsColumn,
        cell: (question) => <QuestionActions question={question} {...handlers} />,
    },
];

const getRenderMobileCard =
    (handlers: QuestionActionHandlers) =>
    (question: QuestionRecord) => {
        const { competency, grade, questionId, questionText, status, subject } = question;

        return (
            <div className={styles.mobileCardContent}>
                <div className={styles.mobileCardMain}>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {questionId}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='black'
                    >
                        {questionText}
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {grade} | {subject} | {competency}
                    </Text>
                    <StatusBadge status={status} />
                </div>
                <QuestionActions question={question} {...handlers} />
            </div>
        );
    };

const QuestionGeneratorPage = () => {
    const {
        generateValues,
        handleDeleteQuestion,
        handleGenerateQuestions,
        handleGenerateValueChange,
        handleOpenAddModal,
        handleOpenDeleteModal,
        handleOpenEditModal,
        handleOpenPreviewModal,
        handleResetFilters,
        handleSearchChange,
        handleSubmitQuestion,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting,
        isFormModalOpen,
        isGenerating,
        isPreviewModalOpen,
        isSubmitting,
        modalMode,
        page,
        questionListQuery,
        searchValue,
        selectedCompetencyFilter,
        selectedGradeFilter,
        selectedQuestion,
        selectedStatusFilter,
        selectedSubjectFilter,
        setIsDeleteModalOpen,
        setIsFormModalOpen,
        setIsPreviewModalOpen,
        setPage,
        setSelectedCompetencyFilter,
        setSelectedGradeFilter,
        setSelectedStatusFilter,
        setSelectedSubjectFilter,
        totalPages,
    } = useQuestionGenerator();

    const selectedGenerateGradeGroup = getOption(GRADE_GROUP_OPTIONS, generateValues.gradeGroup);
    const selectedGenerateGrade = getOption(GRADE_OPTIONS, generateValues.grade);
    const selectedGenerateSubject = getOption(SUBJECT_OPTIONS, generateValues.subject);
    const selectedGenerateCompetency = getOption(COMPETENCY_OPTIONS, generateValues.competency);

    const columns = useMemo(
        () =>
            getQuestionColumns({
                onPreview: handleOpenPreviewModal,
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
            }),
        [handleOpenDeleteModal, handleOpenEditModal, handleOpenPreviewModal],
    );

    const renderMobileCard = useMemo(
        () =>
            getRenderMobileCard({
                onPreview: handleOpenPreviewModal,
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
            }),
        [handleOpenDeleteModal, handleOpenEditModal, handleOpenPreviewModal],
    );

    const handleCountChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = Math.max(1, Math.min(Number(event.target.value || 1), 50));

        handleGenerateValueChange('count', nextValue);
    };

    const renderTableContent = () => {
        if (questionListQuery.isLoading) {
            return (
                <div className={styles.loadingState} role='status' aria-live='polite'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ShimmerUiContainer
                            key={`question-loading-${index + 1}`}
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
                        {QUESTION_GENERATOR_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={QUESTION_GENERATOR_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => questionListQuery.refetch()}
                    />
                </div>
            );
        }

        if (!questionListQuery.data?.questions.length) {
            return (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon} aria-hidden='true'>
                        QG
                    </div>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {QUESTION_GENERATOR_TEXT.emptyText}
                    </Text>
                    <Button
                        type='button'
                        label={QUESTION_GENERATOR_TEXT.addButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={handleOpenAddModal}
                    />
                </div>
            );
        }

        return (
            <DataTable
                columns={columns}
                data={questionListQuery.data?.questions ?? []}
                getRowKey={(question) => question.id}
                emptyText={QUESTION_GENERATOR_TEXT.emptyText}
                renderMobileCard={renderMobileCard}
            />
        );
    };

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <div className={styles.titleGroup}>
                    <Text
                        tagType='h1'
                        font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                        color='black'
                    >
                        {QUESTION_GENERATOR_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {QUESTION_GENERATOR_TEXT.subtitle}
                    </Text>
                </div>
                <Button
                    type='button'
                    label={QUESTION_GENERATOR_TEXT.addButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={handleOpenAddModal}
                    StartIcon={<AddIcon />}
                />
            </section>

            <section className={styles.panel}>
                <div className={styles.panelTitle}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {QUESTION_GENERATOR_TEXT.generateTitle}
                    </Text>
                </div>
                <div className={styles.generateGrid}>
                    <Dropdown
                        label='Select Grade Group'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeGroupLabel}
                        options={GRADE_GROUP_OPTIONS}
                        selectValue='name'
                        value={selectedGenerateGradeGroup}
                        onChange={(option) => handleGenerateValueChange('gradeGroup', option.id)}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Grade'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeLabel}
                        options={GRADE_OPTIONS}
                        selectValue='name'
                        value={selectedGenerateGrade}
                        onChange={(option) => handleGenerateValueChange('grade', option.id)}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Subject'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.subjectLabel}
                        options={SUBJECT_OPTIONS}
                        selectValue='name'
                        value={selectedGenerateSubject}
                        onChange={(option) => handleGenerateValueChange('subject', option.id)}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Competency'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.competencyLabel}
                        options={COMPETENCY_OPTIONS}
                        selectValue='name'
                        value={selectedGenerateCompetency}
                        onChange={(option) => handleGenerateValueChange('competency', option.id)}
                        isSearchable={false}
                    />
                    <Input
                        id='questionCount'
                        name='questionCount'
                        type='number'
                        min={1}
                        max={50}
                        label={QUESTION_GENERATOR_TEXT.numberOfQuestionsLabel}
                        value={generateValues.count}
                        onChange={handleCountChange}
                    />
                </div>
                <div className={styles.centerAction}>
                    <Button
                        type='button'
                        label={QUESTION_GENERATOR_TEXT.generateButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={handleGenerateQuestions}
                        loader={isGenerating}
                    />
                </div>
            </section>

            <section className={styles.panel}>
                <div className={styles.panelTitle}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {QUESTION_GENERATOR_TEXT.searchTitle}
                    </Text>
                </div>
                <div className={styles.searchGrid}>
                    <Input
                        id='questionSearch'
                        label={QUESTION_GENERATOR_TEXT.searchLabel}
                        name='questionSearch'
                        type='search'
                        value={searchValue}
                        placeholder={QUESTION_GENERATOR_TEXT.searchPlaceholder}
                        onChange={handleSearchChange}
                        autoComplete='off'
                    />
                    <Dropdown
                        label={QUESTION_GENERATOR_TEXT.allOption}
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeLabel}
                        options={ALL_GRADE_OPTIONS}
                        selectValue='name'
                        value={selectedGradeFilter}
                        onChange={setSelectedGradeFilter}
                        isSearchable={false}
                    />
                    <Dropdown
                        label={QUESTION_GENERATOR_TEXT.allOption}
                        dropDownTitle={QUESTION_GENERATOR_TEXT.subjectLabel}
                        options={ALL_SUBJECT_OPTIONS}
                        selectValue='name'
                        value={selectedSubjectFilter}
                        onChange={setSelectedSubjectFilter}
                        isSearchable={false}
                    />
                    <Dropdown
                        label={QUESTION_GENERATOR_TEXT.allOption}
                        dropDownTitle={QUESTION_GENERATOR_TEXT.competencyLabel}
                        options={ALL_COMPETENCY_OPTIONS}
                        selectValue='name'
                        value={selectedCompetencyFilter}
                        onChange={setSelectedCompetencyFilter}
                        isSearchable={false}
                    />
                    <Dropdown
                        label={QUESTION_GENERATOR_TEXT.allOption}
                        dropDownTitle={QUESTION_GENERATOR_TEXT.statusLabel}
                        options={ALL_STATUS_OPTIONS}
                        selectValue='name'
                        value={selectedStatusFilter}
                        onChange={setSelectedStatusFilter}
                        isSearchable={false}
                    />
                    <Button
                        type='button'
                        label={QUESTION_GENERATOR_TEXT.resetButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={handleResetFilters}
                        disabled={!hasActiveFilters}
                        className={styles.searchButton}
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
                        {QUESTION_GENERATOR_TEXT.listTitle}
                    </Text>
                    <Button
                        type='button'
                        label={QUESTION_GENERATOR_TEXT.addButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={handleOpenAddModal}
                        StartIcon={<AddIcon />}
                    />
                </div>
                {renderTableContent()}
                <div className={styles.tableFooter}>
                    <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                        Showing page {page} of {totalPages}
                    </Text>
                    <nav
                        className={styles.pagination}
                        aria-label={QUESTION_GENERATOR_TEXT.paginationLabel}
                    >
                        <Button
                            type='button'
                            label={QUESTION_GENERATOR_TEXT.previousButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            disabled={page <= 1 || questionListQuery.isLoading}
                            onClick={() => setPage(Math.max(page - 1, 1))}
                        />
                        <Button
                            type='button'
                            label={QUESTION_GENERATOR_TEXT.nextButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            disabled={page >= totalPages || questionListQuery.isLoading}
                            onClick={() => setPage(Math.min(page + 1, totalPages))}
                        />
                    </nav>
                </div>
            </section>

            <QuestionFormModal
                open={isFormModalOpen}
                mode={modalMode}
                question={selectedQuestion}
                isSubmitting={isSubmitting}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmitQuestion}
            />
            <QuestionPreviewModal
                open={isPreviewModalOpen}
                question={selectedQuestion}
                onClose={() => setIsPreviewModalOpen(false)}
            />
            <DeleteQuestionModal
                open={isDeleteModalOpen}
                question={selectedQuestion}
                isDeleting={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteQuestion}
            />
            <Toaster />
        </main>
    );
};

export default QuestionGeneratorPage;
