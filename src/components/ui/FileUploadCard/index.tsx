/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import { ChangeEvent, KeyboardEvent, useEffect, useId, useRef, useState } from 'react';

import Image, { StaticImageData } from 'next/image';
import cx from 'classnames';

import { FontType } from '@/types/typographyCommon';

import Text from '../Text';

import styles from './styles.module.scss';


interface FileUploadCardProps {
    label: string;
    description?: string;
    icon: string | StaticImageData;

    file: File | null;
    setFile: (file: File | null) => void;

    isPreviewOpen: boolean;
    setIsPreviewOpen: (value: boolean) => void;

    accept?: string;
}

const FileUploadCard = ({
    label,
    description,
    icon,
    file,
    setFile,
    isPreviewOpen,
    setIsPreviewOpen,
    accept = 'image/*',
}: FileUploadCardProps) => {
    const inputId = useId();

    const modalTitleId = useId();

    const modalRef = useRef<HTMLDivElement | null>(null);

    const closeButtonRef = useRef<HTMLButtonElement | null>(null);

    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (!file) {
            setPreviewUrl('');

            return undefined;
        }

        const objectUrl = URL.createObjectURL(file);

        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    useEffect(() => {
        if (isPreviewOpen) {
            closeButtonRef.current?.focus();
        }
    }, [isPreviewOpen]);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = event.target.files?.[0];

        if (!uploadedFile) {
            return;
        }

        setFile(uploadedFile);

        event.target.value = '';
    };

    const handleClosePreview = () => {
        setIsPreviewOpen(false);
    };

    const handleRemoveFile = () => {
        setFile(null);

        setIsPreviewOpen(false);
    };

    const handleModalKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape') {
            handleClosePreview();
        }
    };

    const isImageFile = Boolean(file?.type.startsWith('image/'));

    return (
        <>
            <div className={styles.card}>
                <div className={styles.leftSection}>
                    <div className={styles.iconWrapper}>
                        <Image
                            src={icon}
                            alt=''
                            width={20}
                            height={20}
                            className={styles.icon}
                            aria-hidden='true'
                        />
                    </div>

                    <div className={styles.content}>
                        <Text
                            font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                            color='black'
                        >
                            {label}
                        </Text>

                        {description ? (
                            <Text
                                font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                color='gray-500'
                            >
                                {description}
                            </Text>
                        ) : null}
                    </div>
                </div>

                <div className={styles.actionContainer}>
                    {!file ? (
                        <div className={styles.uploadWrapper}>
                            <label htmlFor={inputId} className={styles.uploadButton}>
                                <Text
                                    font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                    color='gray-500'
                                >
                                    Upload
                                </Text>
                            </label>

                            <input
                                id={inputId}
                                type='file'
                                accept={accept}
                                className={styles.hiddenInput}
                                onChange={handleFileUpload}
                                aria-label={`Upload ${label}`}
                            />
                        </div>
                    ) : (
                        <>
                            <button
                                type='button'
                                className={cx(styles.uploadButton, styles.viewButton)}
                                onClick={() => setIsPreviewOpen(true)}
                                aria-label={`View uploaded ${label}`}
                            >
                                View
                            </button>

                            <div className={styles.uploadWrapper}>
                                <label
                                    htmlFor={inputId}
                                    className={cx(styles.uploadButton, styles.changeButton)}
                                >
                                    <Text
                                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                        color='gray-500'
                                    >
                                        Change
                                    </Text>
                                </label>

                                <input
                                    id={inputId}
                                    type='file'
                                    accept={accept}
                                    className={styles.hiddenInput}
                                    onChange={handleFileUpload}
                                    aria-label={`Change ${label}`}
                                />
                            </div>

                            <button
                                type='button'
                                className={cx(styles.uploadButton, styles.removeButton)}
                                onClick={handleRemoveFile}
                                aria-label={`Remove uploaded ${label}`}
                            >
                                Remove
                            </button>
                        </>
                    )}
                </div>
            </div>

            {isPreviewOpen && file ? (
                <div
                    className={styles.modalOverlay}
                    onClick={handleClosePreview}
                    role='presentation'
                >
                    <div
                        ref={modalRef}
                        className={styles.modal}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={handleModalKeyDown}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby={modalTitleId}
                        tabIndex={-1}
                        aria-hidden='true'
                    >
                        <div className={styles.modalHeader}>
                            <Text
                                font={[FontType.text_md_medium, FontType.text_md_medium]}
                                color='black'
                                id={modalTitleId}
                                className={styles.modalTitle}
                            >
                                {label} Preview
                            </Text>

                            <button
                                ref={closeButtonRef}
                                type='button'
                                className={styles.closeButton}
                                onClick={handleClosePreview}
                                aria-label='Close preview'
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.previewContainer}>
                            {isImageFile ? (
                                <Image
                                    src={previewUrl}
                                    alt={`${label} preview`}
                                    className={styles.previewImage}
                                    fill
                                    sizes='(max-width: 768px) 100vw, 680px'
                                    unoptimized
                                />
                            ) : (
                                <div className={styles.filePreview} role='document'>
                                    <Text
                                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                        color='gray-500'
                                    >
                                        {file.name}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default FileUploadCard;
