'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
// import Input from '@/components/ui/Input/Input';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { UploadTeachersPayload } from '@/types/teacher';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { UPLOAD_TEACHER_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface UploadTeacherModalProps {
    open: boolean;
    isUploading: boolean;
    isTemplateDownloading: boolean;
    onClose: () => void;
    onSubmit: (values: UploadTeachersPayload) => void;
    onDownloadTemplate: () => void;
}

const UploadTeacherModal = ({
    open,
    isUploading,
    isTemplateDownloading,
    onClose,
    onSubmit,
    onDownloadTemplate,
}: UploadTeacherModalProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [sheetUrl, setSheetUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const canSubmit = useMemo(
        () => Boolean(selectedFile || sheetUrl.trim()),
        [selectedFile, sheetUrl],
    );

    useEffect(() => {
        if (!open) {
            setSelectedFile(null);
            setSheetUrl('');
            setErrorMessage('');
        }
    }, [open]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(event.target.files?.[0] ?? null);
        setErrorMessage('');
    };

    // const handleSheetUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     setSheetUrl(event.target.value);
    //     setErrorMessage('');
    // };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit) {
            setErrorMessage(UPLOAD_TEACHER_TEXT.validationMessage);
            return;
        }

        onSubmit({
            file: selectedFile,
            sheetUrl: sheetUrl.trim(),
        });
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
                        {UPLOAD_TEACHER_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {UPLOAD_TEACHER_TEXT.description}
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
                            label={UPLOAD_TEACHER_TEXT.templateButton}
                            variant={ButtonVariant.OUTLINED}
                            color='black'
                            onClick={onDownloadTemplate}
                            disabled={isUploading || isTemplateDownloading}
                            loader={isTemplateDownloading}
                        />
                    </div>

                    <label className={styles.fileField} htmlFor='teacherUploadFile'>
                        <span className={styles.fileLabel}>{UPLOAD_TEACHER_TEXT.fileLabel}</span>
                        <input
                            id='teacherUploadFile'
                            name='teacherUploadFile'
                            type='file'
                            accept='.xlsx,.xls,.csv'
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <span className={styles.fileHint}>
                            {selectedFile?.name || UPLOAD_TEACHER_TEXT.fileHint}
                        </span>
                    </label>

                    {/* <Input
                        id='teacherSheetUrl'
                        label={UPLOAD_TEACHER_TEXT.sheetUrl.label}
                        name='teacherSheetUrl'
                        type='url'
                        value={sheetUrl}
                        placeholder={UPLOAD_TEACHER_TEXT.sheetUrl.placeholder}
                        onChange={handleSheetUrlChange}
                        disabled={isUploading}
                        autoComplete='url'
                    /> */}

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
                        label={UPLOAD_TEACHER_TEXT.cancelButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onClose}
                        disabled={isUploading}
                    />

                    <Button
                        type='submit'
                        label={UPLOAD_TEACHER_TEXT.submitButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        disabled={!canSubmit || isUploading}
                        loader={isUploading}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default UploadTeacherModal;
