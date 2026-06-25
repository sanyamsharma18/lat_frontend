/**
 * @file Toaster Component
 */
import React, { memo } from 'react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import '@/styles/index.scss';

import { TOASTER_TIME_DURATION } from './constant';

const Toaster = () => (
    <ToastContainer
        position='top-right'
        autoClose={TOASTER_TIME_DURATION} // Set auto close time in milliseconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        closeButton
    />
);

/**
 * This component provides a way to render Toaster component.
 *  const handleClick = () => {
 *       showToast({ type: 'error', message: 'Data saved successfully' });
 *  };
 * @example
 *    <Toaster/>
 *    <button onClick={handleClick}></button>
 */
export default memo(Toaster);
