'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { QuestionRecord } from '@/types/questionGenerator';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { DELETE_QUESTION_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface DeleteQuestionModalProps {
    open: boolean;
    question: QuestionRecord | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteQuestionModal = ({
    open,
    question,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteQuestionModalProps) => (
    <Modal
        open={open}
        setOpen={onClose}
        sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '420px' } }}
    >
        <div className={styles.modal}>
            <div className={styles.header}>
                <Text
                    tagType='h2'
                    font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                    color='black'
                >
                    {DELETE_QUESTION_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {DELETE_QUESTION_TEXT.description}
                </Text>
            </div>

            {question ? (
                <div className={styles.questionBox}>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {question.questionId}
                    </Text>
                    <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                        {question.questionText}
                    </Text>
                </div>
            ) : null}

            <div className={styles.actions}>
                <Button
                    type='button'
                    label={DELETE_QUESTION_TEXT.cancelButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    onClick={onClose}
                    disabled={isDeleting}
                />
                <Button
                    type='button'
                    label={DELETE_QUESTION_TEXT.deleteButton}
                    variant={ButtonVariant.WARN}
                    color='white'
                    onClick={onConfirm}
                    disabled={!question || isDeleting}
                    loader={isDeleting}
                />
            </div>
        </div>
    </Modal>
);

export default DeleteQuestionModal;
