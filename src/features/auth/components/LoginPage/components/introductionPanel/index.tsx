'use client';

import { Text } from '@/components/index';

import { FontType } from '@/types/typographyCommon';

import { INTRODUCTION_FEATURES, INTRODUCTION_TEXT } from './constant';

import styles from './styles.module.scss';

const IntroductionPanel = () => (
    <div className={styles['main-container']}>
        <div className={styles['title-container']}>
            <Text font={[FontType.text_lg_semibold, FontType.text_lg_semibold]} color='white'>
                {INTRODUCTION_TEXT.appName}
            </Text>
        </div>

        <div>
            <div className={styles['title-text']}>
                <Text
                    font={[FontType.display_Desktop_sm_medium, FontType.display_Desktop_sm_medium]}
                    color='white'
                >
                    {INTRODUCTION_TEXT.heading}
                </Text>

                <Text
                    font={[FontType.display_Desktop_sm_medium, FontType.display_Desktop_sm_medium]}
                    color='solar-yellow'
                >
                    {INTRODUCTION_TEXT.highlightedHeading}
                </Text>
            </div>

            <div className={styles['text-descri']}>
                <Text font={[FontType.text_md_regular, FontType.text_md_regular]} color='slate-400'>
                    {INTRODUCTION_TEXT.description}
                </Text>
            </div>

            <div className={styles['headline-container']}>
                {INTRODUCTION_FEATURES.map((feature) => (
                    <div key={feature.title} className={styles['subtitle-text']}>
                        <Text
                            font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                            color='white'
                        >
                            {feature.title}
                        </Text>

                        <Text
                            font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                            color='slate-400'
                        >
                            {feature.description}
                        </Text>
                    </div>
                ))}
            </div>
        </div>

        <div className={styles['established-line']}>
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='slate-500'>
                {INTRODUCTION_TEXT.footer}
            </Text>
        </div>
    </div>
);

export default IntroductionPanel;
