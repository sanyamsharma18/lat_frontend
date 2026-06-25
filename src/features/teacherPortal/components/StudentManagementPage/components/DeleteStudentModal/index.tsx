'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { Student } from '@/types/student';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { DELETE_STUDENT_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface DeleteStudentModalProps {
    open: boolean;
    student: Student | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteStudentModal = ({
    open,
    student,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteStudentModalProps) => (
    <Modal open={open} setOpen={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}>
        <div className={styles.container}>
            <div className={styles.content}>
                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {DELETE_STUDENT_TEXT.title}
                </Text>
                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {DELETE_STUDENT_TEXT.description}
                </Text>
                {student ? (
                    <Text
                        tagType='strong'
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {student.studentName} - {student.grade} {student.section}
                    </Text>
                ) : null}
            </div>

            <div className={styles.actions}>
                <Button
                    type='button'
                    label={DELETE_STUDENT_TEXT.cancelButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    onClick={onClose}
                    disabled={isDeleting}
                />
                <Button
                    type='button'
                    label={DELETE_STUDENT_TEXT.deleteButton}
                    variant={ButtonVariant.WARN}
                    color='white'
                    onClick={onConfirm}
                    disabled={!student || isDeleting}
                    loader={isDeleting}
                />
            </div>
        </div>
    </Modal>
);

export default DeleteStudentModal;
