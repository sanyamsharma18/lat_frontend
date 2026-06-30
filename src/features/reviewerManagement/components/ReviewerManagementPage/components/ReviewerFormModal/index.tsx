'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { Reviewer, ReviewerFormValues } from '@/types/reviewer';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { REVIEWER_FORM_TEXT, REVIEWER_VALIDATION } from '../../constant';

import styles from './styles.module.scss';

interface ReviewerFormModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    reviewer: Reviewer | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (values: ReviewerFormValues) => void;
}

type ReviewerFormField = keyof ReviewerFormValues;
type ReviewerFormErrors = Partial<Record<ReviewerFormField, string>>;

const EMPTY_FORM_VALUES: ReviewerFormValues = {
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
};

const REQUIRED_FORM_FIELDS: ReviewerFormField[] = ['firstName', 'mobileNo', 'email'];

const validateField = (name: ReviewerFormField, value: string) => {
    const rule = REVIEWER_VALIDATION[name as keyof typeof REVIEWER_VALIDATION];

    if (!rule) return '';

    const trimmedValue = value.trim();

    if (rule.requiredMessage && !trimmedValue) {
        return rule.requiredMessage;
    }

    if (
        trimmedValue &&
        (trimmedValue.length < rule.minLength || trimmedValue.length > rule.maxLength)
    ) {
        return rule.invalidMessage;
    }

    return '';
};

const validateForm = (values: ReviewerFormValues) =>
    REQUIRED_FORM_FIELDS.reduce<ReviewerFormErrors>((errors, key) => {
        const errorMessage = validateField(key, values[key] ?? '');

        return errorMessage ? { ...errors, [key]: errorMessage } : errors;
    }, {});

const ReviewerFormModal = ({
    open,
    mode,
    reviewer,
    isSubmitting,
    onClose,
    onSubmit,
}: ReviewerFormModalProps) => {
    const [formValues, setFormValues] = useState<ReviewerFormValues>(EMPTY_FORM_VALUES);
    const [errorMessages, setErrorMessages] = useState<ReviewerFormErrors>({});

    useEffect(() => {
        if (!open) return;

        setFormValues(
            reviewer
                ? {
                      firstName: reviewer.firstName || '',
                      lastName: reviewer.lastName || '',
                      mobileNo: reviewer.mobileNo || '',
                      email: reviewer.email || '',
                  }
                : EMPTY_FORM_VALUES,
        );
        setErrorMessages({});
    }, [open, reviewer]);

    const isFormValid = useMemo(
        () =>
            REQUIRED_FORM_FIELDS.every((field) => formValues[field]?.trim()) &&
            Object.values(errorMessages).every((message) => !message),
        [errorMessages, formValues],
    );

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const fieldName = name as ReviewerFormField;
        const nextValue = value.replace(/^\s+/, '');

        setFormValues((previous) => ({ ...previous, [fieldName]: nextValue }));
        setErrorMessages((previous) => ({
            ...previous,
            [fieldName]: validateField(fieldName, nextValue),
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validateForm(formValues);
        setErrorMessages(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) return;

        onSubmit({
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName.trim(),
            mobileNo: formValues.mobileNo.trim(),
            email: formValues.email.trim(),
        });
    };

    const modalTitle =
        mode === 'edit' ? REVIEWER_FORM_TEXT.editTitle : REVIEWER_FORM_TEXT.addTitle;
    const submitLabel =
        mode === 'edit' ? REVIEWER_FORM_TEXT.editSubmitButton : REVIEWER_FORM_TEXT.addSubmitButton;

    return (
        <Modal
            open={open}
            setOpen={onClose}
            sx={{ '& .MuiPaper-root': { borderRadius: '12px', width: 'min(640px, 92vw)' } }}
        >
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.header}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                        color='black'
                    >
                        {modalTitle}
                    </Text>
                </div>

                <div className={styles.fields}>
                    <Input
                        id='firstName'
                        label={REVIEWER_FORM_TEXT.firstName.label}
                        name='firstName'
                        type='text'
                        value={formValues.firstName}
                        placeholder={REVIEWER_FORM_TEXT.firstName.placeholder}
                        helperText={errorMessages.firstName || ''}
                        error={Boolean(errorMessages.firstName)}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id='lastName'
                        label={REVIEWER_FORM_TEXT.lastName.label}
                        name='lastName'
                        type='text'
                        value={formValues.lastName}
                        placeholder={REVIEWER_FORM_TEXT.lastName.placeholder}
                        onChange={handleChange}
                    />
                    <Input
                        id='mobileNo'
                        label={REVIEWER_FORM_TEXT.mobileNo.label}
                        name='mobileNo'
                        type='text'
                        value={formValues.mobileNo}
                        placeholder={REVIEWER_FORM_TEXT.mobileNo.placeholder}
                        helperText={errorMessages.mobileNo || ''}
                        error={Boolean(errorMessages.mobileNo)}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id='email'
                        label={REVIEWER_FORM_TEXT.email.label}
                        name='email'
                        type='email'
                        value={formValues.email}
                        placeholder={REVIEWER_FORM_TEXT.email.placeholder}
                        helperText={errorMessages.email || ''}
                        error={Boolean(errorMessages.email)}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label={REVIEWER_FORM_TEXT.cancelButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onClose}
                        disabled={isSubmitting}
                    />
                    <Button
                        type='submit'
                        label={submitLabel}
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

export default ReviewerFormModal;
