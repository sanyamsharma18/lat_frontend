'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { StudentUploadPreview, UploadStudentsPayload } from '@/types/student';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { UPLOAD_STUDENT_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface UploadStudentsModalProps {
    open: boolean;
    isUploading: boolean;
    isTemplateDownloading: boolean;
    onClose: () => void;
    onSubmit: (values: UploadStudentsPayload) => void;
    onDownloadTemplate: () => void;
}

const REQUIRED_COLUMNS = [
    'Student Name',
    'Grade',
    'Section',
    'Father Name',
    'Mother Name',
    'Gender',
    'DOB',
    'Status',
];

const VALID_GENDERS = ['Male', 'Female', 'Other'];
const VALID_STATUS = ['Active', 'Inactive'];

const EMPTY_PREVIEW: StudentUploadPreview = {
    fileName: '',
    totalRecords: 0,
    successCount: 0,
    validationErrors: [],
};

const isValidDate = (value: string) => !Number.isNaN(Date.parse(value));

const buildPreview = async (file: File): Promise<StudentUploadPreview> => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
        return {
            fileName: file.name,
            totalRecords: 0,
            successCount: 0,
            validationErrors: [],
        };
    }

    const content = await file.text();
    const [headerLine = '', ...rows] = content.split(/\r?\n/).filter(Boolean);
    const headers = headerLine.split(',').map((header) => header.trim());
    const missingColumns = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
    const validationErrors = missingColumns.map((column) => ({
        row: 1,
        message: `Missing column: ${column}`,
    }));
    const seenStudents = new Set<string>();

    rows.forEach((row, index) => {
        const rowNumber = index + 2;
        const values = row.split(',').map((value) => value.trim());
        const record = Object.fromEntries(
            headers.map((header, itemIndex) => [header, values[itemIndex] ?? '']),
        );
        const studentKey =
            `${record['Student Name']}-${record.Grade}-${record.Section}`.toLowerCase();

        REQUIRED_COLUMNS.forEach((column) => {
            if (!record[column]) {
                validationErrors.push({ row: rowNumber, message: `${column} is required` });
            }
        });

        if (record.Gender && !VALID_GENDERS.includes(record.Gender)) {
            validationErrors.push({ row: rowNumber, message: 'Invalid gender' });
        }

        if (record.Status && !VALID_STATUS.includes(record.Status)) {
            validationErrors.push({ row: rowNumber, message: 'Invalid status' });
        }

        if (record.DOB && !isValidDate(record.DOB)) {
            validationErrors.push({ row: rowNumber, message: 'Invalid date of birth' });
        }

        if (seenStudents.has(studentKey)) {
            validationErrors.push({ row: rowNumber, message: 'Duplicate student in file' });
        }

        seenStudents.add(studentKey);
    });

    return {
        fileName: file.name,
        totalRecords: rows.length,
        successCount: Math.max(rows.length - validationErrors.length, 0),
        validationErrors,
    };
};

const UploadStudentsModal = ({
    open,
    isUploading,
    isTemplateDownloading,
    onClose,
    onSubmit,
    onDownloadTemplate,
}: UploadStudentsModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<StudentUploadPreview>(EMPTY_PREVIEW);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!open) {
            setSelectedFile(null);
            setPreview(EMPTY_PREVIEW);
            setErrorMessage('');
        }
    }, [open]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setSelectedFile(file);
        setErrorMessage('');
        setPreview(file ? await buildPreview(file) : EMPTY_PREVIEW);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            setErrorMessage(UPLOAD_STUDENT_TEXT.validationMessage);
            return;
        }

        if (preview.validationErrors.length) {
            setErrorMessage('Resolve validation errors before import.');
            return;
        }

        onSubmit({ file: selectedFile, preview });
    };

    return (
        <Modal open={open} setOpen={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.header}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                        color='black'
                    >
                        {UPLOAD_STUDENT_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {UPLOAD_STUDENT_TEXT.description}
                    </Text>
                </div>

                <div className={styles.fields}>
                    <div className={styles.templateAction}>
                        <Text
                            font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                            color='gray-500'
                        >
                            Download the backend template to use the correct upload headers.
                        </Text>
                        <Button
                            type='button'
                            label={UPLOAD_STUDENT_TEXT.templateButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            onClick={onDownloadTemplate}
                            disabled={isUploading || isTemplateDownloading}
                            loader={isTemplateDownloading}
                        />
                    </div>

                    <label className={styles.fileField} htmlFor='studentUploadFile'>
                        <span className={styles.fileLabel}>{UPLOAD_STUDENT_TEXT.fileLabel}</span>
                        <input
                            id='studentUploadFile'
                            type='file'
                            accept='.csv,.xlsx'
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <span className={styles.fileHint}>
                            {selectedFile?.name || UPLOAD_STUDENT_TEXT.fileHint}
                        </span>
                    </label>

                    {selectedFile ? (
                        <div className={styles.preview}>
                            <Text
                                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                                color='black'
                            >
                                {UPLOAD_STUDENT_TEXT.previewTitle}
                            </Text>
                            <div className={styles.previewGrid}>
                                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                                    Total Records: {preview.totalRecords}
                                </Text>
                                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                                    Success Count: {preview.successCount}
                                </Text>
                                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]}>
                                    Validation Errors: {preview.validationErrors.length}
                                </Text>
                            </div>
                            <div className={styles.errorList}>
                                {preview.validationErrors.slice(0, 5).map((error) => (
                                    <Text
                                        key={`${error.row}-${error.message}`}
                                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                        color='red-500'
                                    >
                                        Row {error.row}: {error.message}
                                    </Text>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {errorMessage ? (
                        <Text
                            font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                            color='red-500'
                        >
                            {errorMessage}
                        </Text>
                    ) : null}
                </div>

                <div className={styles.actions}>
                    <Button
                        type='button'
                        label={UPLOAD_STUDENT_TEXT.cancelButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onClose}
                        disabled={isUploading}
                    />
                    <Button
                        type='submit'
                        label={UPLOAD_STUDENT_TEXT.submitButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        disabled={
                            !selectedFile || preview.validationErrors.length > 0 || isUploading
                        }
                        loader={isUploading}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default UploadStudentsModal;
