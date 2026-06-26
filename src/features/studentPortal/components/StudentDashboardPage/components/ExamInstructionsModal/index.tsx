'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { MODAL_STYLING } from '@/constants/appConstants';

import { ExamInstructionsResponse } from '@/types/studentPortal';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { EXAM_INSTRUCTIONS_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface ExamInstructionsModalProps {
    open: boolean;
    instructions?: ExamInstructionsResponse;
    onAccept: () => void;
    onCancel: () => void;
    showCancel?: boolean;
}

const ExamInstructionsModal = ({
    open,
    instructions,
    onAccept,
    onCancel,
    showCancel = false,
}: ExamInstructionsModalProps) => (
    <Modal
        open={open}
        setOpen={showCancel ? onCancel : undefined}
        sx={{
            ...MODAL_STYLING,
            '& .MuiPaper-root': {
                borderRadius: '12px',
                maxWidth: '620px',
                width: 'calc(100% - 32px)',
            },
        }}
    >
        <div className={styles.container}>
            <div className={styles.header}>
                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {instructions?.title || 'Examination Instructions'}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    Please review and accept these rules before starting the examination.
                </Text>
            </div>

            <ul className={styles.instructions}>
                {(instructions?.instructions ?? []).map((instruction) => (
                    <li key={instruction.id}>
                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='slate-600'
                        >
                            {instruction.label}
                        </Text>
                    </li>
                ))}
            </ul>

            <div className={styles.actions}>
                {showCancel ? (
                    <Button
                        type='button'
                        label={EXAM_INSTRUCTIONS_TEXT.cancelButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={onCancel}
                    />
                ) : null}
                <Button
                    type='button'
                    label={EXAM_INSTRUCTIONS_TEXT.acceptButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={onAccept}
                />
            </div>
        </div>
    </Modal>
);

export default ExamInstructionsModal;
