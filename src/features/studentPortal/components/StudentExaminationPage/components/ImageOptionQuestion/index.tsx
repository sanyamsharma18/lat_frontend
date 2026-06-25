'use client';

import Image from 'next/image';

import cx from 'classnames';

import Text from '@/components/ui/Text';

import { ImageOptionQuestion as ImageOptionQuestionType } from '@/types/studentPortal';
import { FontType } from '@/types/typographyCommon';

import styles from './styles.module.scss';

interface ImageOptionQuestionProps {
    question: ImageOptionQuestionType;
    selectedOptionId?: string;
    isSubmitted: boolean;
    onSelect: (optionId: string) => void;
}

const ImageOptionQuestion = ({
    question,
    selectedOptionId,
    isSubmitted,
    onSelect,
}: ImageOptionQuestionProps) => (
    <div className={styles.grid} role='radiogroup' aria-label={question.question}>
        {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showCorrect = isSubmitted && option.isCorrect;
            const showIncorrect = isSubmitted && isSelected && !option.isCorrect;

            return (
                <button
                    key={option.id}
                    type='button'
                    className={cx(
                        styles.optionCard,
                        isSelected && styles.selected,
                        showCorrect && styles.correct,
                        showIncorrect && styles.incorrect,
                    )}
                    onClick={() => onSelect(option.id)}
                    disabled={isSubmitted}
                    role='radio'
                    aria-checked={isSelected}
                    aria-label={`${option.label}${showCorrect ? ', correct answer' : ''}${
                        showIncorrect ? ', selected incorrect answer' : ''
                    }`}
                >
                    <span className={styles.imageFrame}>
                        <Image
                            src={option.imageUrl}
                            alt={option.label}
                            width={180}
                            height={130}
                            className={styles.image}
                            priority={question.id === 1}
                        />
                    </span>

                    <span className={styles.optionFooter}>
                        <span className={styles.radioIndicator} aria-hidden='true' />
                        <Text
                            font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                            color='black'
                        >
                            {option.label}
                        </Text>
                    </span>

                    {isSubmitted ? (
                        <span className={styles.feedback}>
                            <Text
                                font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                                color={option.isCorrect ? 'green-600' : showIncorrect ? 'red-600' : 'gray-500'}
                            >
                                {option.isCorrect ? 'Correct' : showIncorrect ? 'Incorrect' : ''}
                            </Text>
                        </span>
                    ) : null}
                </button>
            );
        })}
    </div>
);

export default ImageOptionQuestion;
