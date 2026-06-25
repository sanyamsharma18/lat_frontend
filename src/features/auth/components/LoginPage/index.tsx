import IntroductionPanel from './components/introductionPanel';

import LoginForm from './components/loginForm';

import styles from './styles.module.scss';

const LoginPage = () => (
    <div className={styles['main-container']}>
        <div className={styles['left-panel']}>
            <IntroductionPanel />
        </div>

        <div className={styles['right-panel']}>
            <LoginForm />
        </div>
    </div>
);

export default LoginPage;
