'use client';

/**
 * @file Modal Component
 */
import { memo } from 'react';

import { Dialog, ModalProps } from '@mui/material';

interface DialogProps extends ModalProps {
    /**
     * open for open the modal.
     */
    open: boolean;

    /**
     * close the modal .
     */
    setOpen?: (state: boolean) => void;
}

const style = {
    '& .MuiDialogContent-root': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
};

const Modal = (props: DialogProps) => {
    const { children, open, setOpen, sx: additionalStyle } = props;

    const handleClose = () => {
        if (setOpen) {
            setOpen(false);
        }
    };

    return (
        <Dialog
            disableAutoFocus
            open={open}
            onClose={handleClose}
            aria-labelledby='responsive-dialog-title'
            sx={{ ...style, ...additionalStyle }}
        >
            {children}
        </Dialog>
    );
};

/**
 * This component provides a way to render Modal .
 *
 * @example
 *  <Modal open={open} setOpen={setOpen}>Hello world</Modal>
 */
export default memo(Modal);
