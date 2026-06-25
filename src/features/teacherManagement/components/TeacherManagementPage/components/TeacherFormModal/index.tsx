'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { queryOptions, useQuery } from '@tanstack/react-query';

import Button from '@/components/ui/Button';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { ButtonVariant, FontType } from '@/types/typographyCommon';
import { Teacher, TeacherFormValues, GradeOption, SubjectOption } from '@/types/teacher';

import { TEACHER_FORM_TEXT, TEACHER_VALIDATION } from '../../constant';
import { allGradesQueryOptions, subjectQueryOptions } from '../../utils';

import styles from './styles.module.scss';

interface TeacherFormModalProps {
    open: boolean;
    mode: 'add' | 'edit';
    teacher: Teacher | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (values: TeacherFormValues) => void;
}

type TeacherFormField = 'firstName' | 'lastName' | 'mobileNo' | 'email' | 'empCode' | 'gender' | 'address' | 'gradeId' | 'subjectId' | 'udisecode';
type TeacherFormErrors = Partial<Record<TeacherFormField, string>>;

const EMPTY_FORM_VALUES: TeacherFormValues = {
    firstName: '',
    lastName: '',
    mobileNo: '',
    email: '',
    empCode: '',
    udisecode: '',
    gender: '',
    address: '',
    gradeId: '',
    subjectId: '',
};

const TEACHER_FORM_FIELDS: TeacherFormField[] = [
    'firstName', 'mobileNo', 'email', 'empCode', 'gradeId', 'subjectId', 'udisecode'
];

const GENDER_OPTIONS = [
    { id: 'Male', name: 'Male' },
    { id: 'Female', name: 'Female' },
    { id: 'Other', name: 'Other' },
];

const validateField = (name: TeacherFormField, value: string) => {
    const rule = TEACHER_VALIDATION[name as keyof typeof TEACHER_VALIDATION];
    if (!rule) return '';
    const trimmedValue = value.trim();

    if ('requiredMessage' in rule && rule.requiredMessage && !trimmedValue) {
        return rule.requiredMessage;
    }

    if ('minLength' in rule && trimmedValue) {
        if (trimmedValue.length < rule.minLength || trimmedValue.length > rule.maxLength) {
            return rule.invalidMessage;
        }
    }

    return '';
};

const validateForm = (values: TeacherFormValues) =>
    TEACHER_FORM_FIELDS.reduce<TeacherFormErrors>((errors, key) => {
        const errorMessage = validateField(key, (values as any)[key] ?? '');
        return errorMessage ? { ...errors, [key]: errorMessage } : errors;
    }, {});

const TeacherFormModal = ({ open, mode, teacher, isSubmitting, onClose, onSubmit }: TeacherFormModalProps) => {
    const [formValues, setFormValues] = useState<TeacherFormValues>(EMPTY_FORM_VALUES);
    const [errorMessages, setErrorMessages] = useState<TeacherFormErrors>({});
    
    const [selectedGrade, setSelectedGrade] = useState<GradeOption | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<SubjectOption | null>(null);
    const [selectedGender, setSelectedGender] = useState<{ id: string, name: string } | null>(null);

    const gradeListQuery = useQuery(queryOptions(allGradesQueryOptions()));
    const subjectListQuery = useQuery(queryOptions(subjectQueryOptions()));

    const isFormValid = useMemo(() =>
        TEACHER_FORM_FIELDS.every((field) => (formValues as any)[field]?.trim()) &&
        Object.values(errorMessages).every((message) => !message),
    [errorMessages, formValues]);

    useEffect(() => {
        if (!open) return;
        setFormValues(teacher ? {
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            mobileNo: teacher.mobileNo || '',
            email: teacher.email || '',
            empCode: teacher.empCode || '',
            udisecode: teacher.udisecode || '',
            gender: teacher.gender || '',
            address: teacher.address || '',
            gradeId: teacher.gradeId || '',
            subjectId: teacher.subjectId || '',
        } : EMPTY_FORM_VALUES);

        setSelectedGrade(teacher?.gradeId ? { id: teacher.gradeId, name: 'Grade' } : null);
        setSelectedSubject(teacher?.subjectId ? { id: teacher.subjectId, name: 'Subject' } : null);
        setSelectedGender(teacher?.gender ? { id: teacher.gender, name: teacher.gender } : null);
        setErrorMessages({});
    }, [open, teacher]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const fieldName = name as TeacherFormField;
        const nextValue = value.replace(/^\s+/, '');

        setFormValues((prev) => ({ ...prev, [fieldName]: nextValue }));
        setErrorMessages((prev) => ({ ...prev, [fieldName]: validateField(fieldName, nextValue) }));
    };

    const handleGradeChange = (grade: GradeOption) => {
        setSelectedGrade(grade);
        setFormValues(prev => ({ ...prev, gradeId: grade.id }));
        setErrorMessages(prev => ({ ...prev, gradeId: validateField('gradeId', grade.id) }));
    };

    const handleSubjectChange = (subject: SubjectOption) => {
        setSelectedSubject(subject);
        setFormValues(prev => ({ ...prev, subjectId: subject.id }));
        setErrorMessages(prev => ({ ...prev, subjectId: validateField('subjectId', subject.id) }));
    };

    const handleGenderChange = (gender: { id: string, name: string }) => {
        setSelectedGender(gender);
        setFormValues(prev => ({ ...prev, gender: gender.id }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const validationErrors = validateForm(formValues);
        setErrorMessages(validationErrors);

        if (Object.values(validationErrors).some(Boolean)) return;

        onSubmit({
            firstName: formValues.firstName.trim(),
            lastName: formValues.lastName?.trim() || '',
            mobileNo: formValues.mobileNo.trim(),
            email: formValues.email.trim(),
            empCode: formValues.empCode.trim(),
            udisecode: formValues.udisecode.trim(),
            gender: formValues.gender || '',
            address: formValues.address?.trim() || '',
            gradeId: formValues.gradeId,
            subjectId: formValues.subjectId,
        });
    };

    return (
        <Modal open={open} setOpen={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '600px' } }}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.header}>
                    <Text tagType='h2' font={[FontType.text_xl_semibold, FontType.text_xl_semibold]} color='black'>
                        {mode === 'edit' ? TEACHER_FORM_TEXT.editTitle : TEACHER_FORM_TEXT.addTitle}
                    </Text>
                </div>

                <div className={styles.fields} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input id='firstName' label={TEACHER_FORM_TEXT.firstName.label} name='firstName' type='text' value={formValues.firstName} placeholder={TEACHER_FORM_TEXT.firstName.placeholder} helperText={errorMessages.firstName || ''} error={!!errorMessages.firstName} onChange={handleChange} required />
                    <Input id='lastName' label={TEACHER_FORM_TEXT.lastName.label} name='lastName' type='text' value={formValues.lastName} placeholder={TEACHER_FORM_TEXT.lastName.placeholder} onChange={handleChange} />
                    <Input id='mobileNo' label={TEACHER_FORM_TEXT.mobileNo.label} name='mobileNo' type='text' value={formValues.mobileNo} placeholder={TEACHER_FORM_TEXT.mobileNo.placeholder} helperText={errorMessages.mobileNo || ''} error={!!errorMessages.mobileNo} onChange={handleChange} required />
                    <Input id='email' label={TEACHER_FORM_TEXT.email.label} name='email' type='email' value={formValues.email} placeholder={TEACHER_FORM_TEXT.email.placeholder} helperText={errorMessages.email || ''} error={!!errorMessages.email} onChange={handleChange} required />
                    <Input id='empCode' label={TEACHER_FORM_TEXT.empCode.label} name='empCode' type='text' value={formValues.empCode} placeholder={TEACHER_FORM_TEXT.empCode.placeholder} helperText={errorMessages.empCode || ''} error={!!errorMessages.empCode} onChange={handleChange} required />
                    <Input id='udisecode' label={TEACHER_FORM_TEXT.udisecode.label} name='udisecode' type='text' value={formValues.udisecode} placeholder={TEACHER_FORM_TEXT.udisecode.placeholder} helperText={errorMessages.udisecode || ''} error={!!errorMessages.udisecode} onChange={handleChange} required />
                    <Input id='address' label={TEACHER_FORM_TEXT.address.label} name='address' type='text' value={formValues.address} placeholder={TEACHER_FORM_TEXT.address.placeholder} onChange={handleChange} />
                    
                    <Dropdown label={TEACHER_FORM_TEXT.gender.placeholder} dropDownTitle={TEACHER_FORM_TEXT.gender.label} options={GENDER_OPTIONS} selectValue='name' value={selectedGender} onChange={handleGenderChange} isSearchable={false} />
                    <Dropdown label={TEACHER_FORM_TEXT.grade.placeholder} dropDownTitle={TEACHER_FORM_TEXT.grade.label} options={gradeListQuery.data ?? []} selectValue='name' value={selectedGrade} loading={gradeListQuery.isLoading} onChange={handleGradeChange} isSearchable={false} />
                    <Dropdown label={TEACHER_FORM_TEXT.subject.placeholder} dropDownTitle={TEACHER_FORM_TEXT.subject.label} options={subjectListQuery.data ?? []} selectValue='name' value={selectedSubject} loading={subjectListQuery.isLoading} onChange={handleSubjectChange} isSearchable={false} />
                </div>

                <div className={styles.actions}>
                    <Button type='button' label={TEACHER_FORM_TEXT.cancelButton} variant={ButtonVariant.OUTLINED} color='black' onClick={onClose} disabled={isSubmitting} />
                    <Button type='submit' label={mode === 'edit' ? TEACHER_FORM_TEXT.editSubmitButton : TEACHER_FORM_TEXT.addSubmitButton} variant={ButtonVariant.SOLID} color='white' disabled={!isFormValid || isSubmitting} loader={isSubmitting} />
                </div>
            </form>
        </Modal>
    );
};

export default TeacherFormModal;
