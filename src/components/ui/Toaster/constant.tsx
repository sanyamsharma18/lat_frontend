import { toast } from 'react-toastify';

import { TOASTER_STATUS } from '@/constants/enumConstant';

import styles from './styles.module.scss';


interface ShowToastProps {
    message: string;
    type?: 'success' | 'error';
}

export const TOASTER_TIME_DURATION = 2000;

const TOASTER_STATUS_MAPPING = {
    [TOASTER_STATUS.SUCCESS]: (message: string) => {
        toast.success(message, {
            // icon: SuccessIcon,
            progressClassName: styles['fancy-progress-bar-success'],
        });
    },
    [TOASTER_STATUS.ERROR]: (message: string) => {
        toast.error(<p>{message}</p>, {
            progressClassName: styles['fancy-progress-bar-error'],
        });
    },
};

export const showToast = (args: ShowToastProps) => {
    const { type = 'success', message } = args;

    const toasterFunction = TOASTER_STATUS_MAPPING[type];

    if (toasterFunction) {
        toasterFunction(message);
    } else {
        toast(message);
    }
};
