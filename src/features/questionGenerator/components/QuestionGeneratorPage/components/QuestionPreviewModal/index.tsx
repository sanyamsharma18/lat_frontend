'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';

interface QuestionPreviewModalProps {
    open: boolean;
    question: QuestionRecord | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSave?: (values: any) => void;
    onImageClick?: (url: string) => void;
    onGenerateImage?: (question: QuestionRecord, optionLetter?: string) => void;
    isGeneratingImage?: (questionId: string, optionLetter?: string) => boolean;
    onUploadImage?: (question: QuestionRecord, optionLetter: string | undefined, file: File) => void;
    isUploadingImage?: (questionId: string, optionLetter?: string) => boolean;
}

const sanitizeHtml = (value: string) =>
    value
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/\son\w+="[^"]*"/gi, '')
        .replace(/\son\w+='[^']*'/gi, '');

const RichTextDisplay = ({ value, label }: { value?: string; label: string }) => {
    if (!value || !value.trim()) return null;
    return (
        <div className={styles.editorGroup}>
            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                {label}
            </Text>
            <div
                className={styles.richEditor}
                style={{ background: '#fcfcfc', border: '1px solid #e2e8f0', minHeight: 'auto', outline: 'none' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(value) }}
            />
        </div>
    );
};

const QuestionPreviewModal = ({
    open,
    question,
    onClose,
    onImageClick,
    onGenerateImage,
    isGeneratingImage,
    onUploadImage,
    isUploadingImage,
}: QuestionPreviewModalProps) => {
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
                        Question Details
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        ID: {question?.questionId ?? '-'}
                    </Text>
                </div>

                {question ? (
                    <div className={styles.content} style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className={styles.metaGrid}>
                            <span>Grade: {question.grade}</span>
                            <span>Subject: {question.subject}</span>
                            <span>Status: {question.status === 'Active' ? 'Approve' : question.status === 'Inactive' ? 'Reject' : question.status}</span>
                            <span>Competency: {question.competency}</span>
                        </div>

                        {/* 1. Instruction */}
                        <RichTextDisplay label="Instruction" value={question.instruction} />

                        {/* 2. Stimulus */}
                        <RichTextDisplay label="Stimulus" value={question.stimulus} />

                        {/* 3. Question Text */}
                        <RichTextDisplay label="Question Text" value={question.questionText} />

                        {/* 4. Question Image */}
                        <div className={styles.editorGroup}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                                    Question Image
                                </Text>
                                {onUploadImage && (
                                    <label
                                        style={{
                                            color: question.imageUrl ? '#2563eb' : '#16a34a',
                                            background: question.imageUrl ? '#eff6ff' : '#f0fdf4',
                                            border: question.imageUrl ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                                            borderRadius: '6px',
                                            padding: '4px 12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            cursor: isUploadingImage?.(question.id, undefined) ? 'not-allowed' : 'pointer',
                                            opacity: isUploadingImage?.(question.id, undefined) ? 0.6 : 1,
                                            display: 'inline-block'
                                        }}
                                        title="Upload an image for this question"
                                    >
                                        {isUploadingImage?.(question.id, undefined) ? 'Uploading...' : question.imageUrl ? 'Upload Image' : 'Upload Image'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            disabled={isUploadingImage?.(question.id, undefined)}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) onUploadImage(question, undefined, file);
                                                e.target.value = '';
                                            }}
                                        />
                                    </label>
                                )}
                            </div>
                            {question.imageUrl ? (
                                <img
                                    className={styles.previewImage}
                                    src={question.imageUrl}
                                    alt={`Visual for ${question.questionId}`}
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain', cursor: 'pointer' }}
                                    onClick={() => onImageClick?.(question.imageUrl!)}
                                    title="Click to preview full image"
                                />
                            ) : (
                                <span style={{ color: '#94a3b8', fontSize: '14px' }}>No image uploaded</span>
                            )}
                        </div>

                        {/* 5. Options */}
                        <div className={styles.editorGroup}>
                            <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]} color='gray-500'>
                                Options
                            </Text>
                            <div 
                                className={styles.optionList}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: question.options.some(o => o.imageUrl || o.imagePrompt) ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))',
                                    gap: '16px'
                                }}
                            >
                                {question.options.map((option) => {
                                    const isCorrect = option.isCorrect;
                                    return (
                                        <div 
                                            key={option.id} 
                                            className={styles.optionEditor}
                                            style={{
                                                background: isCorrect ? '#f0fdf4' : '#f8fafc',
                                                border: isCorrect ? '2px solid #22c55e' : '1px solid #e2e8f0',
                                                padding: '16px',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '12px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{
                                                    background: isCorrect ? '#22c55e' : '#64748b',
                                                    color: '#fff',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 'bold',
                                                    fontSize: '12px'
                                                }}>
                                                    Option {option.id}
                                                </span>
                                                {isCorrect && (
                                                    <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '12px' }}>
                                                        ✓ Correct Option
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                                                <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    {/* Option Text */}
                                                    <div 
                                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.text) }} 
                                                        style={{ fontSize: '14px', color: '#1e293b', lineHeight: '1.6' }}
                                                    />

                                                    {/* Option Rationale */}
                                                    {option.rationale ? (
                                                        <div 
                                                            style={{
                                                                marginTop: '4px',
                                                                padding: '10px 12px',
                                                                background: isCorrect ? '#dcfce7' : '#f1f5f9',
                                                                borderRadius: '6px',
                                                                fontSize: '12px',
                                                                color: '#475569',
                                                                borderLeft: isCorrect ? '3px solid #16a34a' : '3px solid #94a3b8'
                                                            }}
                                                        >
                                                            <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Rationale:</span>
                                                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(option.rationale) }} />
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {/* Option Image and Actions */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                                                    {option.imageUrl && (
                                                        <img
                                                            src={option.imageUrl}
                                                            alt={`Option ${option.id} visual`}
                                                            style={{ 
                                                                width: '120px', 
                                                                height: '90px', 
                                                                borderRadius: '6px', 
                                                                objectFit: 'cover', 
                                                                border: '1px solid #e2e8f0',
                                                                background: '#fff',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => onImageClick?.(option.imageUrl!)}
                                                            title="Click to preview option image"
                                                        />
                                                    )}
                                                    
                                                    {/* Upload button for option */}
                                                    {onUploadImage && (
                                                        <label
                                                            style={{
                                                                color: option.imageUrl ? '#2563eb' : '#16a34a',
                                                                background: option.imageUrl ? '#eff6ff' : '#f0fdf4',
                                                                border: option.imageUrl ? '1px solid #bfdbfe' : '1px solid #bbf7d0',
                                                                borderRadius: '6px',
                                                                padding: '4px 8px',
                                                                fontSize: '11px',
                                                                fontWeight: 'bold',
                                                                cursor: isUploadingImage?.(question.id, option.id) ? 'not-allowed' : 'pointer',
                                                                opacity: isUploadingImage?.(question.id, option.id) ? 0.6 : 1,
                                                                display: 'inline-block',
                                                                textAlign: 'center'
                                                            }}
                                                            title="Upload an image for this option"
                                                        >
                                                            {isUploadingImage?.(question.id, option.id) ? 'Uploading...' : option.imageUrl ? 'Upload Image' : 'Upload'}
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                style={{ display: 'none' }}
                                                                disabled={isUploadingImage?.(question.id, option.id)}
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) onUploadImage(question, option.id, file);
                                                                    e.target.value = '';
                                                                }}
                                                            />
                                                        </label>
                                                    )}

                                                    {/* Generate with AI button for option when prompt is available and no image */}
                                                    {!option.imageUrl && option.imagePrompt && onGenerateImage && (
                                                        <button
                                                            type="button"
                                                            onClick={() => onGenerateImage(question, option.id)}
                                                            disabled={isGeneratingImage?.(question.id, option.id)}
                                                            style={{
                                                                color: '#2563eb',
                                                                background: '#eff6ff',
                                                                border: '1px solid #bfdbfe',
                                                                borderRadius: '6px',
                                                                padding: '4px 8px',
                                                                fontSize: '11px',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {isGeneratingImage?.(question.id, option.id) ? 'Generating...' : 'Generate Image'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 6. Answer Explanation */}
                        <RichTextDisplay label="Answer Explanation" value={question.answerExplanation} />
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
};

export default QuestionPreviewModal;
