'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import {
    QuestionFormValues,
    QuestionOptionItem,
    QuestionRecord,
    QuestionStatus,
} from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import {
    COMPETENCY_OPTIONS,
    CORRECT_OPTION_OPTIONS,
    DEFAULT_QUESTION_STATUS,
    GRADE_GROUP_OPTIONS,
    GRADE_OPTIONS,
    QUESTION_FORM_TEXT,
    REQUIRED_MESSAGE,
    STATUS_OPTIONS,
    SUBJECT_OPTIONS,
} from '../../constant';

import styles from './styles.module.scss';

interface QuestionFormModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    question: QuestionRecord | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (values: QuestionFormValues) => void;
}

type QuestionFormField = keyof QuestionFormValues;
type QuestionFormErrors = Partial<Record<QuestionFormField, string>>;

const QUESTION_GENERATOR_FORM_LABELS = {
    gradeGroup: 'Grade Group',
    grade: 'Grade',
    subject: 'Subject',
    competency: 'Competency',
};

const EMPTY_FORM_VALUES: QuestionFormValues = {
    gradeGroup: '',
    grade: '',
    subject: '',
    competency: '',
    questionText: '',
    status: DEFAULT_QUESTION_STATUS,
    imageUrl: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOptionId: '',
    answerExplanation: '',
};

const REQUIRED_FIELDS: QuestionFormField[] = [
    'gradeGroup',
    'grade',
    'subject',
    'competency',
    'questionText',
    'status',
    'optionA',
    'optionB',
    'optionC',
    'optionD',
    'correctOptionId',
];

const findOption = (options: QuestionOptionItem[], id?: string) =>
    options.find((option) => option.id === id) ?? null;

const getInitialFormValues = (question: QuestionRecord | null): QuestionFormValues => {
    if (!question) {
        return EMPTY_FORM_VALUES;
    }

    return {
        gradeGroup: question.gradeGroup,
        grade: question.grade,
        subject: question.subject,
        competency: question.competency,
        questionText: question.questionText,
        status: question.status,
        imageUrl: question.imageUrl ?? '',
        optionA: question.options.find((option) => option.id === 'A')?.text ?? '',
        optionB: question.options.find((option) => option.id === 'B')?.text ?? '',
        optionC: question.options.find((option) => option.id === 'C')?.text ?? '',
        optionD: question.options.find((option) => option.id === 'D')?.text ?? '',
        correctOptionId: question.options.find((option) => option.isCorrect)?.id ?? '',
        answerExplanation: question.answerExplanation ?? '',
    };
};

const validateForm = (values: QuestionFormValues) =>
    REQUIRED_FIELDS.reduce<QuestionFormErrors>((errors, field) => {
        const value = String(values[field] ?? '').trim();

        return value ? errors : { ...errors, [field]: REQUIRED_MESSAGE };
    }, {});

const QuestionFormModal = ({
    open,
    mode,
    question,
    isSubmitting,
    onClose,
    onSubmit,
}: QuestionFormModalProps) => {
    const [formValues, setFormValues] = useState<QuestionFormValues>(EMPTY_FORM_VALUES);
    const [errorMessages, setErrorMessages] = useState<QuestionFormErrors>({});

    const selectedGradeGroup = findOption(GRADE_GROUP_OPTIONS, formValues.gradeGroup);
    const selectedGrade = findOption(GRADE_OPTIONS, formValues.grade);
    const selectedSubject = findOption(SUBJECT_OPTIONS, formValues.subject);
    const selectedCompetency = findOption(COMPETENCY_OPTIONS, formValues.competency);
    const selectedStatus = findOption(STATUS_OPTIONS, formValues.status);
    const selectedCorrectOption = findOption(CORRECT_OPTION_OPTIONS, formValues.correctOptionId);

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues(getInitialFormValues(question));
        setErrorMessages({});
    }, [open, question]);

    const isFormValid = useMemo(
        () =>
            REQUIRED_FIELDS.every((field) => String(formValues[field] ?? '').trim()) &&
            Object.values(errorMessages).every((message) => !message),
        [errorMessages, formValues],
    );

    const updateField = (field: QuestionFormField, value: string) => {
        setFormValues((previous) => ({ ...previous, [field]: value }));
        setErrorMessages((previous) => ({
            ...previous,
            [field]: REQUIRED_FIELDS.includes(field) && !value.trim() ? REQUIRED_MESSAGE : '',
        }));
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target;

        updateField(name as QuestionFormField, value.replace(/^\s+/, ''));
    };

    const handleOptionChange = (field: QuestionFormField) => (option: QuestionOptionItem) => {
        updateField(field, option.id);
    };

    const handleStatusChange = (option: QuestionOptionItem) => {
        updateField('status', option.id as QuestionStatus);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm(formValues);
        setErrorMessages(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        onSubmit({
            ...formValues,
            questionText: formValues.questionText.trim(),
            imageUrl: formValues.imageUrl.trim(),
            optionA: formValues.optionA.trim(),
            optionB: formValues.optionB.trim(),
            optionC: formValues.optionC.trim(),
            optionD: formValues.optionD.trim(),
            answerExplanation: formValues.answerExplanation.trim(),
        });
    };

    return (
        <Modal
            open={open}
            setOpen={onClose}
            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '760px' } }}
        >
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.header}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                        color='black'
                    >
                        {mode === 'edit' ? QUESTION_FORM_TEXT.editTitle : QUESTION_FORM_TEXT.addTitle}
                    </Text>
                </div>

                <div className={styles.fields}>
                    <Dropdown
                        label='Select Grade Group'
                        dropDownTitle={QUESTION_GENERATOR_FORM_LABELS.gradeGroup}
                        options={GRADE_GROUP_OPTIONS}
                        selectValue='name'
                        value={selectedGradeGroup}
                        onChange={handleOptionChange('gradeGroup')}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Grade'
                        dropDownTitle={QUESTION_GENERATOR_FORM_LABELS.grade}
                        options={GRADE_OPTIONS}
                        selectValue='name'
                        value={selectedGrade}
                        onChange={handleOptionChange('grade')}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Subject'
                        dropDownTitle={QUESTION_GENERATOR_FORM_LABELS.subject}
                        options={SUBJECT_OPTIONS}
                        selectValue='name'
                        value={selectedSubject}
                        onChange={handleOptionChange('subject')}
                        isSearchable={false}
                    />
                    <Dropdown
                        label='Select Competency'
                        dropDownTitle={QUESTION_GENERATOR_FORM_LABELS.competency}
                        options={COMPETENCY_OPTIONS}
                        selectValue='name'
                        value={selectedCompetency}
                        onChange={handleOptionChange('competency')}
                        isSearchable={false}
                    />
                    <Dropdown
                        label={QUESTION_FORM_TEXT.status.placeholder}
                        dropDownTitle={QUESTION_FORM_TEXT.status.label}
                        options={STATUS_OPTIONS}
                        selectValue='name'
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        isSearchable={false}
                    />
                    <Dropdown
                        label={QUESTION_FORM_TEXT.correctOption.placeholder}
                        dropDownTitle={QUESTION_FORM_TEXT.correctOption.label}
                        options={CORRECT_OPTION_OPTIONS}
                        selectValue='name'
                        value={selectedCorrectOption}
                        onChange={handleOptionChange('correctOptionId')}
                        isSearchable={false}
                    />
                    <Input
                        id='questionText'
                        name='questionText'
                        label={QUESTION_FORM_TEXT.questionText.label}
                        value={formValues.questionText}
                        placeholder={QUESTION_FORM_TEXT.questionText.placeholder}
                        onChange={handleInputChange}
                        helperText={errorMessages.questionText || ''}
                        error={!!errorMessages.questionText}
                        multiline
                        rows={3}
                        required
                    />
                    <Input
                        id='imageUrl'
                        name='imageUrl'
                        label={QUESTION_FORM_TEXT.imageUrl.label}
                        value={formValues.imageUrl}
                        placeholder={QUESTION_FORM_TEXT.imageUrl.placeholder}
                        onChange={handleInputChange}
                        type='text'
                    />
                </div>

                <div className={styles.optionGrid}>
                    {(['A', 'B', 'C', 'D'] as const).map((optionId) => {
                        const fieldName =
                            `option${optionId}` as Extract<QuestionFormField, 'optionA' | 'optionB' | 'optionC' | 'optionD'>;

                        return (
                            <Input
                                key={optionId}
                                id={fieldName}
                                name={fieldName}
                                label={`${QUESTION_FORM_TEXT.optionLabel} ${optionId}`}
                                type='text'
                                value={formValues[fieldName]}
                                placeholder={`Enter option ${optionId}`}
                                onChange={handleInputChange}
                                helperText={errorMessages[fieldName] || ''}
                                error={!!errorMessages[fieldName]}
                                required
                            />
                        );
                    })}
                </div>

                <Input
                    id='answerExplanation'
                    name='answerExplanation'
                    label={QUESTION_FORM_TEXT.explanation.label}
                    value={formValues.answerExplanation}
                    placeholder={QUESTION_FORM_TEXT.explanation.placeholder}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                />

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label={QUESTION_FORM_TEXT.cancelButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <Button
                        type='submit'
                        label={
                            mode === 'edit'
                                ? QUESTION_FORM_TEXT.editSubmitButton
                                : QUESTION_FORM_TEXT.addSubmitButton
                        }
                        variant={ButtonVariant.SOLID}
                        color='white'
                        disabled={!isFormValid || isSubmitting}
                        loader={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default QuestionFormModal;
