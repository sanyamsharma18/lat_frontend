import { useState } from 'react';
import { useRouter } from 'next/navigation';

import cx from 'classnames';

import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import { MODAL_STYLING } from '@/constants/appConstants';

import { Text, Toaster } from '@/components/index';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toaster/constant';

import { ButtonVariant, FontType } from '@/types/typographyCommon';
import { HTTP_METHOD } from '@/types/common';

import FeaturedIcon from '@/assets/svg/featured-logout-icon.svg';

import { clearAllCookies } from '@/utils/cookieManager';

import { LOGOUT_TEXT as text } from './constant';

import styles from './styles.module.scss';

interface LogoutModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    className?: string;
}

const LogoutModal = (props: LogoutModalProps) => {
    const { open, setOpen, className } = props;

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const router = useRouter();

    // const handleUserLogOut = async () => {
    //     router.push('/');
    // };

    const handleUserLogOut = async () => {
        if (isLoggingOut) {
            return;
        }

        setIsLoggingOut(true);

        try {
            const response = await fetch(ServerSideRoutes.LOGOUT, {
                method: HTTP_METHOD.POST,
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Unable to logout. Please try again.');
            }

            clearAllCookies();
            setOpen(false);
            router.replace('/');
            router.refresh();
        } catch (error) {
            showToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Unable to logout.',
            });
            setIsLoggingOut(false);
        }
    };

    const handleCancel = () => {
        if (isLoggingOut) {
            return;
        }

        setOpen(false);
    };

    return (
        <Modal open={open} sx={MODAL_STYLING}>
            <div className={cx(styles['container-wrapper'], className)}>
                <div>
                    <div className={styles['icon-container']}>
                        <FeaturedIcon />
                    </div>
                    <div className={styles['text-description']}>
                        <div>
                            <Text
                                font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                                color='slate-500'
                            >
                                {text.areYouSure}
                            </Text>
                        </div>

                        <div>
                            <Text
                                font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                                color='gray-500'
                            >
                                {text.youWillNeed}
                            </Text>
                        </div>
                    </div>
                </div>
                <div className={styles['button-duo']}>
                    <Button
                        type='button'
                        label={text.cancel}
                        variant={ButtonVariant.OUTLINED}
                        onClick={handleCancel}
                        loader={false}
                        disabled={isLoggingOut}
                        color='gray-500'
                    />
                    <Button
                        type='button'
                        label={text.logout}
                        variant={ButtonVariant.WARN}
                        onClick={handleUserLogOut}
                        disabled={isLoggingOut}
                        color='white'
                        loader={isLoggingOut}
                    />
                </div>
                <Toaster />
            </div>
        </Modal>
    );
};

export default LogoutModal;
