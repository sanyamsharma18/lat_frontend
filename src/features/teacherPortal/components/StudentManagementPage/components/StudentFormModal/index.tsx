'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { Student, StudentFormValues, StudentOption } from '@/types/student';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import {
    GENDER_OPTIONS,
    SECTION_OPTIONS,
    STATUS_OPTIONS,
    STUDENT_FORM_TEXT,
    STUDENT_VALIDATION,
} from '../../constant';

import styles from './styles.module.scss';

interface StudentFormModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    student: Student | null;
    isSubmitting: boolean;
    gradeOptions: StudentOption[];
    onClose: () => void;
    onSubmit: (values: StudentFormValues) => void;
}

type StudentFormField = keyof StudentFormValues;
type StudentFormErrors = Partial<Record<StudentFormField, string>>;

const EMPTY_FORM_VALUES: StudentFormValues = {
    studentName: '',
    grade: '',
    section: '',
    fatherName: '',
    motherName: '',
    gender: '',
    dateOfBirth: '',
    status: '1' as any,
    parentMobile: '',
    email: '',
    rollNo: '',
    udisecode: '',
    address: '',
};

const STUDENT_FORM_FIELDS: StudentFormField[] = [
    'studentName',
    'grade',
    'section',
    'fatherName',
    'motherName',
    'gender',
    'dateOfBirth',
    'status',
    'parentMobile',
    'email',
    'rollNo',
    'udisecode',
    'address',
];

const REQUIRED_STUDENT_FORM_FIELDS: StudentFormField[] = [
    'studentName',
    'grade',
    'section',
    'fatherName',
    'motherName',
    'gender',
    'dateOfBirth',
    'parentMobile',
    'udisecode',
];

const validateField = (name: StudentFormField, value: string) => {
    const rule = STUDENT_VALIDATION[name];
    const trimmedValue = value.trim();

    if (!trimmedValue && REQUIRED_STUDENT_FORM_FIELDS.includes(name)) {
        return rule.requiredMessage;
    }

    if (!trimmedValue) {
        return '';
    }

    if (
        'minLength' in rule &&
        (trimmedValue.length < rule.minLength || trimmedValue.length > rule.maxLength)
    ) {
        return rule.invalidMessage;
    }

    return '';
};

const getOption = (options: StudentOption[], value?: string) =>
    options.find((option) => option.id === value) ?? null;

const getFieldLabel = (fieldName: StudentFormField, label: string) =>
    REQUIRED_STUDENT_FORM_FIELDS.includes(fieldName) ? `${label} *` : label;

const StudentFormModal = ({
    open,
    mode,
    student,
    isSubmitting,
    gradeOptions,
    onClose,
    onSubmit,
}: StudentFormModalProps) => {
    const [formValues, setFormValues] = useState<StudentFormValues>(EMPTY_FORM_VALUES);
    const [errorMessages, setErrorMessages] = useState<StudentFormErrors>({});

    const modalTitle = mode === 'edit' ? STUDENT_FORM_TEXT.editTitle : STUDENT_FORM_TEXT.addTitle;
    const submitLabel =
        mode === 'edit' ? STUDENT_FORM_TEXT.editSubmitButton : STUDENT_FORM_TEXT.addSubmitButton;

    const isFormValid = useMemo(
        () =>
            REQUIRED_STUDENT_FORM_FIELDS.every((field) => formValues[field]?.trim()) &&
            Object.values(errorMessages).every((message) => !message),
        [errorMessages, formValues],
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        setFormValues(
            student
                ? {
                      studentName: student.studentName,
                      grade: student.grade,
                      section: student.section,
                      fatherName: student.fatherName,
                      motherName: student.motherName,
                      gender: student.gender,
                      dateOfBirth: student.dateOfBirth,
                      status: (student.status === 'Active' ? '1' : '0') as any,
                      parentMobile: student.parentMobile || '',
                      email: student.email || '',
                      rollNo: student.rollNo || '',
                      udisecode: student.udisecode || '',
                      address: student.address || '',
                  }
                : EMPTY_FORM_VALUES,
        );
        setErrorMessages({});
    }, [open, student]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const fieldName = name as StudentFormField;
        const nextValue = value.replace(/^\s+/, '');

        setFormValues((prevValues) => ({ ...prevValues, [fieldName]: nextValue }));
        setErrorMessages((prevMessages) => ({
            ...prevMessages,
            [fieldName]: validateField(fieldName, nextValue),
        }));
    };

    const handleSelectChange = (fieldName: StudentFormField) => (option: StudentOption) => {
        setFormValues((prevValues) => ({ ...prevValues, [fieldName]: option.id }));
        setErrorMessages((prevMessages) => ({
            ...prevMessages,
            [fieldName]: validateField(fieldName, option.id),
        }));
    };

    const validateForm = () =>
        STUDENT_FORM_FIELDS.reduce<StudentFormErrors>((errors, key) => {
            const errorMessage = validateField(key, formValues[key] ?? '');

            return errorMessage ? { ...errors, [key]: errorMessage } : errors;
        }, {});

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm();
        setErrorMessages(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) {
            return;
        }

        const statusValue = String(formValues.status);

        onSubmit({
            studentName: formValues.studentName.trim(),
            grade: formValues.grade,
            section: formValues.section,
            fatherName: formValues.fatherName.trim(),
            motherName: formValues.motherName.trim(),
            gender: formValues.gender,
            dateOfBirth: formValues.dateOfBirth,
            status: statusValue === 'Active' || statusValue === '1' ? 'Active' : 'Inactive',
            parentMobile: formValues.parentMobile.trim(),
            email: formValues.email.trim(),
            rollNo: formValues.rollNo.trim(),
            udisecode: formValues.udisecode.trim(),
            address: formValues.address.trim(),
        });
    };

    const renderDropdown = (
        fieldName: StudentFormField,
        label: string,
        placeholder: string,
        options: StudentOption[],
    ) => (
        <div className={styles.fieldWithError}>
            <Dropdown
                label={placeholder}
                dropDownTitle={getFieldLabel(fieldName, label)}
                options={options}
                selectValue='name'
                value={getOption(options, formValues[fieldName])}
                onChange={handleSelectChange(fieldName)}
                isSearchable={false}
            />
            {errorMessages[fieldName] ? (
                <Text
                    className={styles.helperText}
                    font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                    color='red-500'
                >
                    {errorMessages[fieldName]}
                </Text>
            ) : null}
        </div>
    );

    return (
        <Modal open={open} setOpen={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {modalTitle}
                </Text>

                <div className={styles.fields}>
                    <Input
                        id='studentName'
                        label={STUDENT_FORM_TEXT.studentName.label}
                        name='studentName'
                        value={formValues.studentName}
                        placeholder={STUDENT_FORM_TEXT.studentName.placeholder}
                        helperText={errorMessages.studentName || ''}
                        error={!!errorMessages.studentName}
                        onChange={handleChange}
                        required
                    />
                    {renderDropdown(
                        'grade',
                        STUDENT_FORM_TEXT.grade.label,
                        STUDENT_FORM_TEXT.grade.placeholder,
                        gradeOptions,
                    )}
                    {renderDropdown(
                        'section',
                        STUDENT_FORM_TEXT.section.label,
                        STUDENT_FORM_TEXT.section.placeholder,
                        SECTION_OPTIONS,
                    )}
                    <Input
                        id='fatherName'
                        label={STUDENT_FORM_TEXT.fatherName.label}
                        name='fatherName'
                        value={formValues.fatherName}
                        placeholder={STUDENT_FORM_TEXT.fatherName.placeholder}
                        helperText={errorMessages.fatherName || ''}
                        error={!!errorMessages.fatherName}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id='motherName'
                        label={STUDENT_FORM_TEXT.motherName.label}
                        name='motherName'
                        value={formValues.motherName}
                        placeholder={STUDENT_FORM_TEXT.motherName.placeholder}
                        helperText={errorMessages.motherName || ''}
                        error={!!errorMessages.motherName}
                        onChange={handleChange}
                        required
                    />
                    {renderDropdown(
                        'gender',
                        STUDENT_FORM_TEXT.gender.label,
                        STUDENT_FORM_TEXT.gender.placeholder,
                        GENDER_OPTIONS,
                    )}
                    <Input
                        id='dateOfBirth'
                        label={STUDENT_FORM_TEXT.dateOfBirth.label}
                        name='dateOfBirth'
                        type='date'
                        value={formValues.dateOfBirth}
                        helperText={errorMessages.dateOfBirth || ''}
                        error={!!errorMessages.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                    {renderDropdown(
                        'status',
                        STUDENT_FORM_TEXT.status.label,
                        STUDENT_FORM_TEXT.status.placeholder,
                        STATUS_OPTIONS,
                    )}
                    <Input
                        id='parentMobile'
                        label={STUDENT_FORM_TEXT.parentMobile.label}
                        name='parentMobile'
                        value={formValues.parentMobile}
                        placeholder={STUDENT_FORM_TEXT.parentMobile.placeholder}
                        helperText={errorMessages.parentMobile || ''}
                        error={!!errorMessages.parentMobile}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id='email'
                        label={STUDENT_FORM_TEXT.email.label}
                        name='email'
                        type='email'
                        value={formValues.email}
                        placeholder={STUDENT_FORM_TEXT.email.placeholder}
                        helperText={errorMessages.email || ''}
                        error={!!errorMessages.email}
                        onChange={handleChange}
                    />
                    <Input
                        id='rollNo'
                        label={STUDENT_FORM_TEXT.rollNo.label}
                        name='rollNo'
                        value={formValues.rollNo}
                        placeholder={STUDENT_FORM_TEXT.rollNo.placeholder}
                        helperText={errorMessages.rollNo || ''}
                        error={!!errorMessages.rollNo}
                        onChange={handleChange}
                    />
                    <Input
                        id='udisecode'
                        label={STUDENT_FORM_TEXT.udisecode.label}
                        name='udisecode'
                        value={formValues.udisecode}
                        placeholder={STUDENT_FORM_TEXT.udisecode.placeholder}
                        helperText={errorMessages.udisecode || ''}
                        error={!!errorMessages.udisecode}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id='address'
                        label={STUDENT_FORM_TEXT.address.label}
                        name='address'
                        value={formValues.address}
                        placeholder={STUDENT_FORM_TEXT.address.placeholder}
                        helperText={errorMessages.address || ''}
                        error={!!errorMessages.address}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label={STUDENT_FORM_TEXT.cancelButton}
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

export default StudentFormModal;
