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

const RichTextDisplay = ({ value, className }: { value: string; className?: string }) => (
    <div
        className={className}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
    />
);

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

    return (
        <Modal
            open={open}
            setOpen={onClose}
            sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}
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
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                Grade: {question.grade}
                            </Text>
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                Subject: {question.subject}
                            </Text>
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                Term: {question.term}
                            </Text>
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                Competency: {question.competency}
                            </Text>
                        </div>

                        {question.instruction ? (
                            <RichTextDisplay value={question.instruction} className={styles.richText} />
                        ) : null}

                        {question.stimulus ? (
                            <RichTextDisplay value={question.stimulus} className={styles.richText} />
                        ) : null}

                        <RichTextDisplay
                            value={question.questionText}
                            className={styles.questionText}
                        />

                        <div>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                {REVIEW_MODAL_TEXT.optionsTitle}
                            </Text>
                            <div className={styles.optionList}>
                                {question.options.map((option) => (
                                    <div className={styles.optionCard} key={option.id}>
                                        <span className={styles.optionLabel}>{option.label}</span>
                                        <Text
                                            font={[
                                                FontType.text_sm_regular,
                                                FontType.text_sm_regular,
                                            ]}
                                            color='black'
                                        >
                                            {option.text}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>

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
