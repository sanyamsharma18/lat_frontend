'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { QUESTION_FORM_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface QuestionPreviewModalProps {
    open: boolean;
    question: QuestionRecord | null;
    onClose: () => void;
}

const QuestionPreviewModal = ({ open, question, onClose }: QuestionPreviewModalProps) => (
    <Modal
        open={open}
        setOpen={onClose}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '640px' } }}
    >
        <div className={styles.preview}>
            <div className={styles.header}>
                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {QUESTION_FORM_TEXT.viewTitle}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {question?.questionId ?? '-'}
                </Text>
            </div>

            {question ? (
                <div className={styles.content}>
                    <div className={styles.metaGrid}>
                        <span>{question.grade}</span>
                        <span>{question.subject}</span>
                        <span>{question.competency}</span>
                        <span>{question.status}</span>
                    </div>

                    {question.imageUrl ? (
                        <img
                            className={styles.previewImage}
                            src={question.imageUrl}
                            alt={`Visual for ${question.questionId}`}
                        />
                    ) : null}

                    <Text
                        tagType='h3'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {question.questionText}
                    </Text>

                    <div className={styles.optionList}>
                        {question.options.map((option) => (
                            <div
                                key={option.id}
                                className={option.isCorrect ? styles.correctOption : styles.option}
                            >
                                <Text
                                    font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                    color={option.isCorrect ? 'green-600' : 'black'}
                                >
                                    {option.id}. {option.text}
                                </Text>
                            </div>
                        ))}
                    </div>

                    {question.answerExplanation ? (
                        <div className={styles.explanation}>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                Explanation
                            </Text>
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                {question.answerExplanation}
                            </Text>
                        </div>
                    ) : null}
                </div>
            ) : null}

            <div className={styles.actions}>
                <Button
                    type='button'
                    label='Close'
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={onClose}
                />
            </div>
        </div>
    </Modal>
);

export default QuestionPreviewModal;
