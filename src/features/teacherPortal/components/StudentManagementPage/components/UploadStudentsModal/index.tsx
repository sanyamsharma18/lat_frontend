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
    onClose: () => void;
    onSubmit: (values: UploadStudentsPayload) => void;
}

const EMPTY_PREVIEW: StudentUploadPreview = {
    fileName: '',
    totalRecords: 0,
    successCount: 0,
    validationErrors: [],
};

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
    const [, ...rows] = content.split(/\r?\n/).filter(Boolean);

    return {
        fileName: file.name,
        totalRecords: rows.length,
        successCount: rows.length,
        validationErrors: [],
    };
};

const UploadStudentsModal = ({
    open,
    isUploading,
    onClose,
    onSubmit,
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
                                    Backend will validate file content during upload.
                                </Text>
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
                        disabled={!selectedFile || isUploading}
                        loader={isUploading}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default UploadStudentsModal;
