'use client';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Text from '@/components/ui/Text';

import { ButtonVariant, FontType } from '@/types/typographyCommon';
import { Teacher } from '@/types/teacher';

import { DELETE_TEACHER_TEXT } from '../../constant';

import styles from './styles.module.scss';

interface DeleteTeacherModalProps {
    open: boolean;
    teacher: Teacher | null;
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteTeacherModal = ({
    open,
    teacher,
    isDeleting,
    onClose,
    onConfirm,
}: DeleteTeacherModalProps) => (
    <Modal open={open} setOpen={onClose} sx={{ '& .MuiPaper-root': { borderRadius: '12px' } }}>
        <div className={styles.container}>
            <div className={styles.content}>
                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {DELETE_TEACHER_TEXT.title}
                </Text>

                <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                    {DELETE_TEACHER_TEXT.description}
                </Text>

                {teacher ? (
                    <Text
                        tagType='strong'
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim()} -{' '}
                        {teacher.schoolName}
                    </Text>
                ) : null}
            </div>

            <div className={styles.actions}>
                <Button
                    type='button'
                    label={DELETE_TEACHER_TEXT.cancelButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    onClick={onClose}
                    disabled={isDeleting}
                />

                <Button
                    type='button'
                    label={DELETE_TEACHER_TEXT.deleteButton}
                    variant={ButtonVariant.WARN}
                    color='white'
                    onClick={onConfirm}
                    disabled={!teacher || isDeleting}
                    loader={isDeleting}
                />
            </div>
        </div>
    </Modal>
);

export default DeleteTeacherModal;
