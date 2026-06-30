'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { ReviewerQuestion, ReviewQuestionPayload } from '@/types/reviewerQuestion';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { REVIEW_MODAL_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface QuestionReviewModalProps {
    open: boolean;
    question: ReviewerQuestion | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (payload: ReviewQuestionPayload) => void;
}

const sanitizeHtml = (value: string) =>
    value
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/\son\w+='[^']*'/gi, '');

const RichTextDisplay = ({ value, label }: { value?: string; label: string }) => {
    if (!value || !value.trim()) return null;
    return (
        <div className={styles.editorGroup}>
            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                {label}
            </Text>
            <div
                className={styles.richEditor}
                style={{ background: '#fcfcfc', border: '1px solid #e2e8f0', minHeight: 'auto', outline: 'none' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
            />
        </div>
    );
};

const QuestionReviewModal = ({
    open,
    question,
    isSubmitting,
    onClose,
    onSubmit,
}: QuestionReviewModalProps) => {
    const [remark, setRemark] = useState('');

    useEffect(() => {
        if (!open) return;
        setRemark('');
    }, [open]);

    const handleRemarkChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setRemark(event.target.value);
    };

    const handleSubmit = (status: ReviewQuestionPayload['status']) => {
        onSubmit({
            status,
            remark: remark.trim(),
        });
    };

    const handleImageClick = (url: string) => {
        window.open(url, '_blank');
    };

    return (
        <Modal
            open={open}
            setOpen={onClose}
            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '820px' } }}
        >
            <div className={styles.preview}>
                <div className={styles.header}>
                    <div>
                        <Text
                            tagType='h2'
                            font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                            color='black'
                        >
                            {REVIEW_MODAL_TEXT.title}
                        </Text>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='gray-500'
                        >
                            ID: {question?.questionId ?? '-'}
                        </Text>
                    </div>
                </div>

                {question ? (
                    <div className={styles.content}>
                        <div className={styles.metaGrid}>
                            <span>Grade: {question.grade}</span>
                            <span>Subject: {question.subject}</span>
                            <span>Status: {question.status === 'Approved' ? 'Approve' : question.status === 'Rejected' ? 'Reject' : question.status}</span>
                            <span>Competency: {question.competency}</span>
                        </div>

                        {/* 1. Instruction */}
                        <RichTextDisplay label="Instruction" value={question.instruction} />

                        {/* 2. Stimulus */}
                        <RichTextDisplay label="Stimulus" value={question.stimulus} />

                        {/* 3. Question Text */}
                        <RichTextDisplay label="Question Text" value={question.questionText} />

                        {/* 4. Question Image */}
                        <div className={styles.editorGroup}>
                            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                                Question Image
                            </Text>
                            {question.imageUrl ? (
                                <img
                                    className={styles.previewImage}
                                    src={question.imageUrl}
                                    alt={`Visual for ${question.questionId}`}
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(question.imageUrl!)}
                                    title="Click to preview full image"
                                />
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>No image uploaded</span>
                            )}
                        </div>

                        {/* 5. Options */}
                        <div className={styles.editorGroup}>
                            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                                Options
                            </Text>
                            <div 
                                className={styles.optionList}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: question.options.some(o => o.imageUrl || o.imagePrompt) ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))',
                                    gap: '16px'
                                }}
                            >
                                {question.options.map((option) => {
                                    const isCorrect = option.isCorrect;
                                    return (
                                        <div 
                                            key={option.id} 
                                            className={styles.optionEditor}
                                            style={{
                                                background: isCorrect ? '#f0fdf4' : '#f8fafc',
                                                border: isCorrect ? '2px solid #22c55e' : '1px solid #e2e8f0',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    background: isCorrect ? '#22c55e' : '#64748b',
                                                    color: '#fff',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}>
                                                    Option {option.id}
                                                </span>
                                                {isCorrect && (
                                                    <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '12px' }}>
                                                        ✓ Correct Option
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {/* Option Text */}
                                                    <div 
                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.text) }} 
                                                        style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}
                                                    />

                                                    {/* Option Rationale */}
                                                    {option.rationale ? (
                                                        <div 
                                                            style={{
                                                                marginTop: '4px',
                                                                padding: '10px 12px',
                                                                background: isCorrect ? '#dcfce7' : '#f1f5f9',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                color: '#475569',
                                                                borderLeft: isCorrect ? '3px solid #16a34a' : '3px solid #94a3b8'
                                                            }}
                                                        >
                                                            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Rationale:</span>
                                                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.rationale) }} />
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {/* Option Image */}
                                                {option.imageUrl && (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                                        <img
                                                            src={option.imageUrl}
                                                            alt={`Option ${option.id} visual`}
                                                            style={{ 
                                                                width: '120px', 
                                                                height: '90px', 
                                                                borderRadius: '6px', 
                                                                objectFit: 'cover', 
                                                                border: '1px solid #e2e8f0',
                                                                background: '#fff',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleImageClick(option.imageUrl!)}
                                                            title="Click to preview option image"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 6. Answer Explanation */}
                        <RichTextDisplay label="Answer Explanation" value={question.answerExplanation} />

                        {/* 7. Remark Field */}
                        <label className={styles.remarkGroup} htmlFor='reviewRemark'>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                {REVIEW_MODAL_TEXT.remarkLabel}
                            </Text>
                            <textarea
                                id='reviewRemark'
                                className={styles.remarkInput}
                                value={remark}
                                placeholder={REVIEW_MODAL_TEXT.remarkPlaceholder}
                                onChange={handleRemarkChange}
                            />
                        </label>
                    </div>
                ) : null}

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label={REVIEW_MODAL_TEXT.closeButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        disabled={isSubmitting}
                        onClick={onClose}
                    />
                    <Button
                        type='button'
                        label={REVIEW_MODAL_TEXT.rejectButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        disabled={isSubmitting}
                        onClick={() => handleSubmit('Rejected')}
                    />
                    <Button
                        type='button'
                        label={REVIEW_MODAL_TEXT.approveButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        disabled={isSubmitting}
                        loader={isSubmitting}
                        onClick={() => handleSubmit('Approved')}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default QuestionReviewModal;
