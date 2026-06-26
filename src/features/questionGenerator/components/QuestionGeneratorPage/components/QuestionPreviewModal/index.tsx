'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { QuestionFormValues, QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { QUESTION_FORM_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface QuestionPreviewModalProps {
    open: boolean;
    question: QuestionRecord | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSave: (values: QuestionFormValues) => void;
}

const getOptionText = (question: QuestionRecord, optionId: string) =>
    question.options.find((option) => option.id === optionId)?.text ?? '';

const getRelationKey = (question: QuestionRecord, optionId: string) =>
    question.options.find((option) => option.id === optionId)?.relationKey ?? '';

const buildFormValues = (question: QuestionRecord): QuestionFormValues => ({
    gradeGroup: question.gradeGroup,
    grade: question.grade,
    subject: question.subject,
    competency: question.competency,
    instruction: question.instruction,
    questionText: question.questionText,
    status: question.status,
    imageUrl: question.imageUrl ?? '',
    optionA: getOptionText(question, 'A'),
    optionARelationKey: getRelationKey(question, 'A'),
    optionB: getOptionText(question, 'B'),
    optionBRelationKey: getRelationKey(question, 'B'),
    optionC: getOptionText(question, 'C'),
    optionCRelationKey: getRelationKey(question, 'C'),
    optionD: getOptionText(question, 'D'),
    optionDRelationKey: getRelationKey(question, 'D'),
    correctOptionId: question.options.find((option) => option.isCorrect)?.id ?? 'A',
    answerExplanation: question.answerExplanation ?? '',
});

const QuestionPreviewModal = ({
    open,
    question,
    isSubmitting,
    onClose,
    onSave,
}: QuestionPreviewModalProps) => {
    const [formValues, setFormValues] = useState<QuestionFormValues | null>(null);

    useEffect(() => {
        if (open && question) {
            setFormValues(buildFormValues(question));
        }
    }, [open, question]);

    const updateField = (field: keyof QuestionFormValues, value: string) => {
        setFormValues((previous) => (previous ? { ...previous, [field]: value } : previous));
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;

        updateField(name as keyof QuestionFormValues, value);
    };

    const handleSave = () => {
        if (formValues) {
            onSave(formValues);
        }
    };

    return (
        <Modal
            open={open}
            setOpen={onClose}
            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '820px' } }}
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
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {question?.questionId ?? '-'}
                    </Text>
                </div>

                {question && formValues ? (
                    <div className={styles.content}>
                        <div className={styles.metaGrid}>
                            <span>{question.grade}</span>
                            <span>{question.subject}</span>
                            <span>{question.status}</span>
                            <span>Competency: {question.competency}</span>
                        </div>

                        <Input
                            id='previewImageUrl'
                            name='imageUrl'
                            type='text'
                            label={QUESTION_FORM_TEXT.imageUrl.label}
                            value={formValues.imageUrl}
                            placeholder={QUESTION_FORM_TEXT.imageUrl.placeholder}
                            onChange={handleInputChange}
                        />

                        {formValues.imageUrl ? (
                            <img
                                className={styles.previewImage}
                                src={formValues.imageUrl}
                                alt={`Visual for ${question.questionId}`}
                            />
                        ) : null}

                        <div className={styles.editorGroup}>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                {QUESTION_FORM_TEXT.instruction.label}
                            </Text>
                            <div
                                className={styles.richEditor}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(event) =>
                                    updateField(
                                        'instruction',
                                        event.currentTarget.innerHTML,
                                    )
                                }
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: formValues.instruction }}
                            />
                        </div>

                        <div className={styles.editorGroup}>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                {QUESTION_FORM_TEXT.questionText.label}
                            </Text>
                            <div
                                className={styles.richEditor}
                                contentEditable
                                suppressContentEditableWarning
                                onInput={(event) =>
                                    updateField(
                                        'questionText',
                                        event.currentTarget.innerHTML,
                                    )
                                }
                                // eslint-disable-next-line react/no-danger
                                dangerouslySetInnerHTML={{ __html: formValues.questionText }}
                            />
                        </div>

                        <div className={styles.optionList}>
                            {(['A', 'B', 'C', 'D'] as const).map((optionId) => {
                                const optionField = `option${optionId}` as keyof QuestionFormValues;
                                const relationKeyField =
                                    `option${optionId}RelationKey` as keyof QuestionFormValues;

                                return (
                                    <div className={styles.optionEditor} key={optionId}>
                                        <Text
                                            font={[
                                                FontType.text_sm_semibold,
                                                FontType.text_sm_semibold,
                                            ]}
                                            color='black'
                                        >
                                            Option {optionId}
                                        </Text>
                                        <Input
                                            id={`relation-${optionId}`}
                                            name={relationKeyField}
                                            type='text'
                                            label={QUESTION_FORM_TEXT.relationKey.label}
                                            value={String(formValues[relationKeyField])}
                                            onChange={handleInputChange}
                                        />
                                        <div
                                            className={styles.richEditor}
                                            contentEditable
                                            suppressContentEditableWarning
                                            onInput={(event) =>
                                                updateField(
                                                    optionField,
                                                    event.currentTarget.innerHTML,
                                                )
                                            }
                                            // eslint-disable-next-line react/no-danger
                                            dangerouslySetInnerHTML={{
                                                __html: String(formValues[optionField]),
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : null}

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label='Close'
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <Button
                        type='button'
                        label='Save Changes'
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={handleSave}
                        loader={isSubmitting}
                        disabled={!formValues}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default QuestionPreviewModal;
