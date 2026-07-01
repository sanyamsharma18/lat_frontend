'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Image from 'next/image';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { QuestionOptionItem, QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useQuestionGenerator } from '../../hooks/useQuestionGenerator';

import CompetencyMultiSelect from './components/CompetencyMultiSelect';
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
    TERM_OPTIONS,
} from './constant';

import styles from './styles.module.scss';

interface QuestionActionHandlers {
    onPreview: (question: QuestionRecord) => void;
    onEdit: (question: QuestionRecord) => void;
    onDelete: (question: QuestionRecord) => void;
    onImageClick: (url: string) => void;
    onGenerateImage?: (question: QuestionRecord, optionLetter?: string) => void;
    isGeneratingImage?: (questionId: string, optionLetter?: string) => boolean;
    onUploadImage?: (question: QuestionRecord, optionLetter: string | undefined, file: File) => void;
    isUploadingImage?: (questionId: string, optionLetter?: string) => boolean;
}

const getOption = (options: QuestionOptionItem[], id?: string) =>
    options.find((option) => option.id === id) ?? null;

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

const StatusBadge = ({ status }: { status: QuestionRecord['status'] }) => {
    const displayStatus = status === 'Active' ? 'Approve' : status === 'Inactive' ? 'Reject' : status;
    return (
        <span
            className={cx(
                styles.statusBadge,
                status === 'Active' && styles.statusActive,
                status === 'Draft' && styles.statusDraft,
                status === 'Inactive' && styles.statusInactive,
            )}
        >
            {displayStatus}
        </span>
    );
};

const QuestionActions = ({ question, onPreview }: Pick<QuestionActionHandlers, 'onPreview'> & {
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
        cell: (question) => <HtmlQuestionText value={question.questionText} />,
    },
    {
        id: 'status',
        header: QUESTION_GENERATOR_TEXT.statusColumn,
        cell: (question) => <StatusBadge status={question.status} />,
    },
    {
        id: 'image',
        header: QUESTION_GENERATOR_TEXT.imageColumn,
        className: styles.imageColumn,
        cell: (question) => {
            const hasUrl = !!question.imageUrl;
            const hasPrompt = !!question.imagePrompt;
            const isGenerating = handlers.isGeneratingImage ? handlers.isGeneratingImage(question.id) : false;
            const isUploading = handlers.isUploadingImage ? handlers.isUploadingImage(question.id) : false;

            return (
                <div className={styles.imageCell}>
                    {hasUrl && (
                        <div 
                            className={styles.thumbnail}
                            onClick={() => handlers.onImageClick(question.imageUrl!)}
                            style={{ cursor: 'pointer' }}
                            title="Click to preview image"
                        >
                            <Image
                                src={question.imageUrl!}
                                alt={`Preview for ${question.questionId}`}
                                width={72}
                                height={44}
                            />
                        </div>
                    )}
                    
                    {/* Upload button when image already exists */}
                    {hasUrl && (
                        <label
                            className={styles.imageAction}
                            style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.6 : 1 }}
                            title="Upload a new image"
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={isUploading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlers.onUploadImage?.(question, undefined, file);
                                    e.target.value = '';
                                }}
                            />
                        </label>
                    )}

                    {/* Generate with AI button when only prompt available and no image */}
                    {!hasUrl && hasPrompt && (
                        <button
                            type="button"
                            className={styles.imageAction}
                            disabled={isGenerating}
                            onClick={() => handlers.onGenerateImage?.(question)}
                        >
                            {isGenerating ? 'Generating...' : 'Generate Image'}
                        </button>
                    )}

                    {/* Upload button when no image exists */}
                    {!hasUrl && (
                        <label
                            className={styles.imageAction}
                            style={{ 
                                cursor: isUploading ? 'not-allowed' : 'pointer', 
                                opacity: isUploading ? 0.6 : 1,
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0'
                            }}
                            title="Upload an image"
                        >
                            {isUploading ? 'Uploading...' : 'Upload'}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                disabled={isUploading}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handlers.onUploadImage?.(question, undefined, file);
                                    e.target.value = '';
                                }}
                            />
                        </label>
                    )}

                    {!hasUrl && !hasPrompt && (
                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>-</span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        header: QUESTION_GENERATOR_TEXT.actionsColumn,
        cell: (question) => <QuestionActions question={question} onPreview={handlers.onPreview} />,
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
                        <HtmlQuestionText value={questionText} />
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
    const [activePreviewImage, setActivePreviewImage] = useState<string | null>(null);
    const {
        generateValues,
        handleDeleteQuestion,
        handleGenerateQuestions,
        handleGenerateValueChange,
        handleOpenDeleteModal,
        handleOpenEditModal,
        handleOpenPreviewModal,
        handleResetFilters,
        handleResetGenerateFilters,
        handleSearchChange,
        handleSaveQuestionEditor,
        handleSubmitQuestion,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting,
        isGeneratingImage: isGeneratingImagePending,
        generateImageMutation,
        uploadImageMutation,
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
        gradeGroupOptions,
        gradeOptions,
        subjectOptions,
        competencyOptions,
        selectedGradeGroupFilter,
        selectedTermFilter,
        searchGradeOptions,
        searchSubjectOptions,
        searchCompetencyOptions,
        handleGradeGroupFilterChange,
        handleGradeFilterChange,
        handleSubjectFilterChange,
        handleTermFilterChange,
    } = useQuestionGenerator();

    const isGeneratingImage = (questionId: string, optionLetter?: string) => {
        return (
            generateImageMutation.isPending &&
            generateImageMutation.variables?.questionId === Number(questionId) &&
            generateImageMutation.variables?.optionLetter === optionLetter
        );
    };

    const isUploadingImage = (questionId: string, optionLetter?: string) => {
        return (
            uploadImageMutation.isPending &&
            uploadImageMutation.variables?.questionId === Number(questionId) &&
            uploadImageMutation.variables?.optionLetter === optionLetter
        );
    };

    const handleGenerateImage = (question: QuestionRecord, optionLetter?: string) => {
        const prompt = optionLetter 
            ? question.options.find(o => o.id === optionLetter)?.imagePrompt
            : question.imagePrompt;
            
        if (!prompt) {
            return;
        }

        generateImageMutation.mutate({
            questionId: Number(question.id),
            prompt,
            optionLetter,
        });
    };

    const handleUploadImage = (question: QuestionRecord, optionLetter: string | undefined, file: File) => {
        uploadImageMutation.mutate({
            questionId: Number(question.id),
            file,
            optionLetter,
        });
    };

    const selectedGenerateGradeGroup = getOption(gradeGroupOptions, generateValues.gradeGroup);
    const selectedGenerateGrade = getOption(gradeOptions, generateValues.grade);
    const selectedGenerateSubject = getOption(subjectOptions, generateValues.subject);
    const selectedGenerateTerm = getOption(TERM_OPTIONS, generateValues.term);

    const columns = useMemo(
        () =>
            getQuestionColumns({
                onPreview: handleOpenPreviewModal,
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
                onImageClick: (url) => setActivePreviewImage(url),
                onGenerateImage: handleGenerateImage,
                isGeneratingImage,
                onUploadImage: handleUploadImage,
                isUploadingImage,
            }),
        [
            handleOpenDeleteModal, 
            handleOpenEditModal, 
            handleOpenPreviewModal, 
            generateImageMutation.isPending, 
            generateImageMutation.variables,
            uploadImageMutation.isPending,
            uploadImageMutation.variables,
        ],
    );

    const renderMobileCard = useMemo(
        () =>
            getRenderMobileCard({
                onPreview: handleOpenPreviewModal,
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
                onImageClick: (url) => setActivePreviewImage(url),
                onGenerateImage: handleGenerateImage,
                isGeneratingImage,
                onUploadImage: handleUploadImage,
                isUploadingImage,
            }),
        [
            handleOpenDeleteModal, 
            handleOpenEditModal, 
            handleOpenPreviewModal, 
            generateImageMutation.isPending, 
            generateImageMutation.variables,
            uploadImageMutation.isPending,
            uploadImageMutation.variables,
        ],
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
                        options={gradeGroupOptions}
                        selectValue='name'
                        value={selectedGenerateGradeGroup}
                        onChange={(option) => handleGenerateValueChange('gradeGroup', option.id)}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Grade'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeLabel}
                        options={gradeOptions}
                        selectValue='name'
                        value={selectedGenerateGrade}
                        onChange={(option) => handleGenerateValueChange('grade', option.id)}
                        isSearchable={false}
                        disable={!generateValues.gradeGroup}
                    />
                    <Dropdown
                        label='Select Subject'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.subjectLabel}
                        options={subjectOptions}
                        selectValue='name'
                        value={selectedGenerateSubject}
                        onChange={(option) => handleGenerateValueChange('subject', option.id)}
                        isSearchable={false}
                        disable={!generateValues.grade}
                    />
                    <Dropdown
                        label='Select Term'
                        dropDownTitle='Term'
                        options={TERM_OPTIONS}
                        selectValue='name'
                        value={selectedGenerateTerm}
                        onChange={(option) => handleGenerateValueChange('term', option.id)}
                        isSearchable={false}
                        disable={!generateValues.subject}
                    />
                    <CompetencyMultiSelect
                        label={QUESTION_GENERATOR_TEXT.competencyLabel}
                        placeholder='Select Competency'
                        options={competencyOptions}
                        value={generateValues.competencyIds}
                        onChange={(value) => handleGenerateValueChange('competencyIds', value)}
                        disable={!generateValues.term}
                    />
                    <Input
                        id='questionCount'
                        name='questionCount'
                        type='number'
                        min={1}
                        max={2}
                        label={QUESTION_GENERATOR_TEXT.numberOfQuestionsLabel}
                        value={generateValues.count}
                        onChange={handleCountChange}
                    />
                </div>
                <div className={styles.centerAction}>
                    <Button
                        type='button'
                        label="Reset"
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={handleResetGenerateFilters}
                        disabled={isGenerating}
                    />
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
                        label='Select Grade Group'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeGroupLabel}
                        options={gradeGroupOptions}
                        selectValue='name'
                        value={selectedGradeGroupFilter}
                        onChange={handleGradeGroupFilterChange}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Grade'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.gradeLabel}
                        options={searchGradeOptions}
                        selectValue='name'
                        value={selectedGradeFilter}
                        onChange={handleGradeFilterChange}
                        isSearchable={false}
                        disable={!selectedGradeGroupFilter}
                    />
                    <Dropdown
                        label='Select Subject'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.subjectLabel}
                        options={searchSubjectOptions}
                        selectValue='name'
                        value={selectedSubjectFilter}
                        onChange={handleSubjectFilterChange}
                        isSearchable={false}
                        disable={!selectedGradeFilter}
                    />
                    <Dropdown
                        label='Select Term'
                        dropDownTitle='Term'
                        options={TERM_OPTIONS}
                        selectValue='name'
                        value={selectedTermFilter}
                        onChange={handleTermFilterChange}
                        isSearchable={false}
                        disable={!selectedSubjectFilter}
                    />
                    <Dropdown
                        label='Select Competency'
                        dropDownTitle={QUESTION_GENERATOR_TEXT.competencyLabel}
                        options={searchCompetencyOptions}
                        selectValue='name'
                        value={selectedCompetencyFilter}
                        onChange={setSelectedCompetencyFilter}
                        isSearchable={false}
                        disable={!selectedTermFilter}
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
                onSave={handleSaveQuestionEditor}
                isSubmitting={isSubmitting}
                onImageClick={(url) => setActivePreviewImage(url)}
                onGenerateImage={handleGenerateImage}
                isGeneratingImage={isGeneratingImage}
                onUploadImage={handleUploadImage}
                isUploadingImage={isUploadingImage}
            />
            <DeleteQuestionModal
                open={isDeleteModalOpen}
                question={selectedQuestion}
                isDeleting={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteQuestion}
            />
            {activePreviewImage && (
                <Modal open={!!activePreviewImage} setOpen={() => setActivePreviewImage(null)}>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', borderRadius: '12px', maxWidth: '90vw', maxHeight: '90vh', gap: '16px' }}>
                        <Text tagType="h3" font={[FontType.text_lg_semibold, FontType.text_lg_semibold]} color="black">
                            Image Preview
                        </Text>
                        <img 
                            src={activePreviewImage} 
                            alt="Preview" 
                            style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                        />
                        <Button
                            type="button"
                            label="Close"
                            variant={ButtonVariant.SOLID}
                            color="white"
                            onClick={() => setActivePreviewImage(null)}
                        />
                    </div>
                </Modal>
            )}
            <Toaster />
        </main>
    );
};

export default QuestionGeneratorPage;
