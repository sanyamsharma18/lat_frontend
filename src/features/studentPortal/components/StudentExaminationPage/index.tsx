'use client';

import { useEffect, useRef } from 'react';
import cx from 'classnames';

import Button from '@/components/ui/Button';
import Radio from '@/components/ui/Radio';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';
import { showToast } from '@/components/ui/Toaster/constant';

import { QuestionPaletteState } from '@/types/studentPortal';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useStudentExamination } from '../../hooks/useStudentExamination';

import ImageOptionQuestion from './components/ImageOptionQuestion';
import { STUDENT_EXAM_TEXT } from './constant';

import styles from './styles.module.scss';

const paletteStateLabel: Record<QuestionPaletteState, string> = {
    notVisited: STUDENT_EXAM_TEXT.notVisitedLabel,
    visited: STUDENT_EXAM_TEXT.visitedLabel,
    answered: STUDENT_EXAM_TEXT.answeredLabel,
    current: STUDENT_EXAM_TEXT.currentLabel,
};

const StudentExaminationPage = () => {
    const paletteGridRef = useRef<HTMLDivElement>(null);

    const {
        answeredCount,
        answers,
        currentQuestion,
        currentQuestionIndex,
        exam,
        examQuestionsQuery,
        formattedRemainingTime,
        getQuestionState,
        handleNextQuestion,
        handlePreviousQuestion,
        handleSelectAnswer,
        handleSelectQuestion,
        handleSubmitExam,
        isFirstQuestion,
        isLastQuestion,
        isSubmitting,
        questions,
        totalQuestions,
    } = useStudentExamination();

    const renderLoading = () => (
        <div className={styles.examGrid} role='status' aria-live='polite'>
            <section className={styles.questionPanel}>
                <ShimmerUiContainer className={styles.shimmerTitle} />
                <ShimmerUiContainer className={styles.shimmerQuestion} />
                <ShimmerUiContainer className={styles.shimmerOption} />
                <ShimmerUiContainer className={styles.shimmerOption} />
                <ShimmerUiContainer className={styles.shimmerOption} />
                <ShimmerUiContainer className={styles.shimmerOption} />
            </section>
            <aside className={styles.sidePanel}>
                <ShimmerUiContainer className={styles.shimmerQuestion} />
            </aside>
        </div>
    );

    const renderError = () => (
        <section className={styles.errorState} role='alert'>
            <Text
                tagType='h2'
                font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                color='red-600'
            >
                {STUDENT_EXAM_TEXT.errorTitle}
            </Text>
            <Button
                type='button'
                label={STUDENT_EXAM_TEXT.retryButton}
                variant={ButtonVariant.OUTLINED}
                color='black'
                onClick={() => examQuestionsQuery.refetch()}
            />
        </section>
    );

    const renderQuestion = () => {
        if (!currentQuestion) {
            return (
                <section className={styles.errorState}>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='gray-500'
                    >
                        {STUDENT_EXAM_TEXT.noQuestionsText}
                    </Text>
                </section>
            );
        }

        return (
            <section className={styles.questionPanel}>
                <div className={styles.questionHeader}>
                    <div className={styles.questionMeta}>
                        <Text
                            font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                            color='orange-700'
                        >
                            {STUDENT_EXAM_TEXT.questionLabel} {currentQuestionIndex + 1} of{' '}
                            {totalQuestions}
                        </Text>
                        <Text
                            font={[FontType.text_xxs_regular, FontType.text_xxs_regular]}
                            className={styles.questionPill}
                        >
                            {currentQuestion.type === 'image-option'
                                ? 'Image Option'
                                : 'Single Choice'}
                        </Text>
                    </div>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {answeredCount} of {questions.length} answered
                    </Text>
                </div>

                <Text
                    tagType='h2'
                    font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}
                    color='black'
                >
                    {currentQuestion.question}
                </Text>

                {currentQuestion.type === 'image-option' ? (
                    <ImageOptionQuestion
                        question={currentQuestion}
                        selectedOptionId={answers[currentQuestion.id]}
                        isSubmitted={false}
                        onSelect={handleSelectAnswer}
                    />
                ) : (
                    <div
                        className={styles.options}
                        role='radiogroup'
                        aria-label={currentQuestion.question}
                    >
                        {currentQuestion.options.map((option, optionIndex) => {
                            const isSelected = answers[currentQuestion.id] === option;

                            return (
                                <div
                                    key={option}
                                    className={cx(
                                        styles.optionCard,
                                        isSelected && styles.selectedOption,
                                    )}
                                    onClick={() => handleSelectAnswer(option)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handleSelectAnswer(option);
                                        }
                                    }}
                                    role='radio'
                                    tabIndex={0}
                                    aria-checked={isSelected}
                                >
                                    <Text className={styles.optionIndex}>
                                        {String.fromCharCode(65 + optionIndex)}
                                    </Text>
                                    <Radio
                                        name={`question-${currentQuestion.id}`}
                                        value={option}
                                        label={option}
                                        checked={isSelected}
                                        readOnly
                                        color='black'
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className={styles.bottomNavigation}>
                    <Button
                        type='button'
                        label={STUDENT_EXAM_TEXT.previousButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        disabled={isFirstQuestion}
                        onClick={handlePreviousQuestion}
                    />
                    <Button
                        type='button'
                        label={STUDENT_EXAM_TEXT.nextButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        disabled={isLastQuestion}
                        onClick={handleNextQuestion}
                    />
                </div>
            </section>
        );
    };

    const renderPalette = () => (
        <aside className={styles.sidePanel}>
            <div className={styles.timerCard}>
                <Text font={[FontType.text_xs_medium, FontType.text_xs_medium]} color='gray-500'>
                    {STUDENT_EXAM_TEXT.timerLabel}
                </Text>
                <Text
                    tagType='strong'
                    font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                    color='black'
                >
                    {formattedRemainingTime}
                </Text>
                <div className={styles.progressBlock}>
                    <div className={styles.progressHeader}>
                        <Text
                            font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                            color='gray-500'
                        >
                            Answered Questions
                        </Text>
                        <Text
                            font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                            color='black'
                        >
                            {answeredCount} / {totalQuestions}
                        </Text>
                    </div>
                    <div className={styles.progressTrack}>
                        <span
                            className={styles.progressFill}
                            style={{
                                width: `${totalQuestions ? (answeredCount / totalQuestions) * 100 : 0}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.paletteCard}>
                <div className={styles.paletteHeader}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_md_semibold, FontType.text_md_semibold]}
                        color='black'
                    >
                        {STUDENT_EXAM_TEXT.paletteTitle}
                    </Text>
                    <Text
                        font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                        color='gray-500'
                    >
                        {totalQuestions} Questions
                    </Text>
                </div>

                <div ref={paletteGridRef} className={styles.paletteGrid}>
                    {questions.map((question, index) => {
                        const state = getQuestionState(question.id, index);

                        return (
                            <button
                                key={question.id}
                                data-current={index === currentQuestionIndex}
                                type='button'
                                className={cx(styles.paletteButton, styles[state])}
                                onClick={() => handleSelectQuestion(index)}
                                aria-label={`Question ${index + 1}, ${paletteStateLabel[state]}`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <div className={styles.legend}>
                    {(Object.keys(paletteStateLabel) as QuestionPaletteState[]).map((state) => (
                        <div key={state} className={styles.legendItem}>
                            <span className={cx(styles.legendDot, styles[state])} />
                            <Text
                                font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                                color='gray-500'
                            >
                                {paletteStateLabel[state]}
                            </Text>
                        </div>
                    ))}
                </div>
            </div>

            <Button
                type='button'
                label={STUDENT_EXAM_TEXT.submitButton}
                variant={ButtonVariant.WARN}
                color='white'
                className={styles.submitButton}
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                loader={isSubmitting}
            />
        </aside>
    );

    useEffect(() => {
        const currentButton = paletteGridRef.current?.querySelector(
            '[data-current="true"]',
        ) as HTMLButtonElement | null;

        currentButton?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    }, [currentQuestionIndex]);

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href);

            showToast({
                type: 'error',
                message: 'You cannot navigate back during the examination.',
            });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                showToast({
                    type: 'error',
                    message: 'Leaving the examination window is not allowed.',
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <div>
                    <Text
                        tagType='h1'
                        font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                        color='black'
                    >
                        {exam?.title || STUDENT_EXAM_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {STUDENT_EXAM_TEXT.studentName} | {STUDENT_EXAM_TEXT.subtitle}
                    </Text>
                </div>
                <div className={styles.mobileTimer}>
                    <Text
                        font={[FontType.text_xs_medium, FontType.text_xs_medium]}
                        color='gray-500'
                    >
                        {STUDENT_EXAM_TEXT.timerLabel}
                    </Text>
                    <Text
                        tagType='strong'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {formattedRemainingTime}
                    </Text>
                </div>
            </section>

            {examQuestionsQuery.isLoading ? renderLoading() : null}
            {examQuestionsQuery.isError ? renderError() : null}
            {!examQuestionsQuery.isLoading && !examQuestionsQuery.isError ? (
                <div className={styles.examGrid}>
                    {renderQuestion()}
                    {renderPalette()}
                </div>
            ) : null}

            <Toaster />
        </main>
    );
};

export default StudentExaminationPage;
