'use client';

import { CSSProperties } from 'react';
import cx from 'classnames';
import { queryOptions, useQuery } from '@tanstack/react-query';

import Button from '@/components/ui/Button';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';

import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useSpaceMissionGame } from '../../hooks/useSpaceMissionGame';
import { studentProfileQueryOptions } from '../StudentDashboardPage/utils';

import { getAverageTime } from './utils';

import styles from './styles.module.scss';

const BALLOON_COLORS = ['#ff5d8f', '#58d5ff', '#ffd166', '#7cf29a'];

const SpaceMissionGamePage = () => {
    const profileQuery = useQuery(queryOptions(studentProfileQueryOptions()));
    const {
        burstAnswer,
        burstBalloonAnswer,
        challenge,
        completeMission,
        exitToDashboard,
        grade,
        isMuted,
        isPaused,
        lastResult,
        missionText,
        openMap,
        planets,
        progress,
        rank,
        remainingSeconds,
        restartGame,
        restartMission,
        selectedAnswer,
        selectedPlanet,
        selectedPlanetIndex,
        setIsMuted,
        setIsPaused,
        setShowHint,
        setStage,
        showHint,
        stage,
        startPlanetMission,
    } = useSpaceMissionGame({ profile: profileQuery.data });

    const renderShellActions = () => (
        <div className={styles.shellActions}>
            <button type='button' className={styles.iconButton} onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? missionText.unmute : missionText.mute}
            </button>
            <button type='button' className={styles.iconButton} onClick={exitToDashboard}>
                {missionText.exit}
            </button>
        </div>
    );

    const renderIntro = () => (
        <section className={styles.heroPanel}>
            <div className={styles.rocket} aria-hidden='true'>▲</div>
            <Text tagType='h1' font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}>
                {missionText.introTitle}
            </Text>
            <Text font={[FontType.text_md_regular, FontType.text_md_regular]}>
                {missionText.introBody}
            </Text>
            <div className={styles.actionRow}>
                <Button
                    type='button'
                    label={missionText.startMission}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={() => setStage('briefing')}
                />
                <Button
                    type='button'
                    label={missionText.dashboard}
                    variant={ButtonVariant.OUTLINED}
                    color='white'
                    onClick={exitToDashboard}
                />
            </div>
        </section>
    );

    const renderBriefing = () => (
        <section className={styles.panel}>
            <Text tagType='h1' font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}>
                {missionText.briefingTitle}
            </Text>
            <Text font={[FontType.text_md_regular, FontType.text_md_regular]}>
                {missionText.briefingBody}
            </Text>
            <div className={styles.statsGrid}>
                <div>
                    <span>Class</span>
                    <strong>{grade}</strong>
                </div>
                <div>
                    <span>Rank</span>
                    <strong>{rank}</strong>
                </div>
                <div>
                    <span>Energy Crystals</span>
                    <strong>{progress.crystals}</strong>
                </div>
            </div>
            <Button
                type='button'
                label={missionText.galaxyMap}
                variant={ButtonVariant.SOLID}
                color='white'
                onClick={openMap}
            />
        </section>
    );

    const renderMap = () => (
        <section className={styles.panel}>
            <div className={styles.sectionHeader}>
                <div>
                    <Text tagType='h1' font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}>
                        {missionText.galaxyMap}
                    </Text>
                    <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]}>
                        Complete planets in order to restore the Space Station.
                    </Text>
                </div>
                <div className={styles.scorePill}>{progress.xp} XP</div>
            </div>
            <div className={styles.galaxyGrid}>
                {planets.map((planet, index) => {
                    const isUnlocked =
                        index === 0 || progress.completedPlanetIds.includes(planets[index - 1].id);
                    const isComplete = progress.completedPlanetIds.includes(planet.id);

                    return (
                        <button
                            type='button'
                            key={planet.id}
                            className={cx(
                                styles.planetCard,
                                !isUnlocked && styles.planetLocked,
                                selectedPlanetIndex === index && styles.planetActive,
                            )}
                            onClick={() => startPlanetMission(index)}
                            disabled={!isUnlocked}
                        >
                            <span
                                className={styles.planetOrb}
                                style={{ backgroundColor: planet.color }}
                                aria-hidden='true'
                            />
                            <strong>{planet.name}</strong>
                            <span>{planet.subtitle}</span>
                            <em>{isComplete ? 'Badge earned' : isUnlocked ? missionText.launch : missionText.locked}</em>
                        </button>
                    );
                })}
            </div>
        </section>
    );

    const renderPauseMenu = () =>
        isPaused ? (
            <div className={styles.pauseOverlay} role='dialog' aria-modal='true'>
                <div className={styles.pausePanel}>
                    <Text tagType='h2' font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}>
                        Mission Paused
                    </Text>
                    <Button
                        type='button'
                        label={missionText.resume}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={() => setIsPaused(false)}
                    />
                    <Button
                        type='button'
                        label={missionText.restart}
                        variant={ButtonVariant.OUTLINED}
                        color='white'
                        onClick={restartMission}
                    />
                    <Button
                        type='button'
                        label={missionText.dashboard}
                        variant={ButtonVariant.OUTLINED}
                        color='white'
                        onClick={exitToDashboard}
                    />
                </div>
            </div>
        ) : null;

    const renderMission = () => (
        <section className={styles.missionPanel}>
            {renderPauseMenu()}
            <div className={styles.missionTopbar}>
                <div>
                    <Text font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}>
                        {selectedPlanet.name}
                    </Text>
                    <span>{challenge.competency}</span>
                </div>
                <div className={styles.timer}>{remainingSeconds}s</div>
                <button type='button' className={styles.iconButton} onClick={() => setIsPaused(true)}>
                    {missionText.pause}
                </button>
            </div>
            <div className={styles.challengeCard}>
                <div className={styles.missionQuestion}>
                    <span className={styles.missionEyebrow}>
                        Burst the correct answer balloon
                    </span>
                    <Text tagType='h1' font={[FontType.text_xl_semibold, FontType.text_xl_semibold]}>
                        {challenge.prompt}
                    </Text>
                </div>
                <div className={styles.balloonGalaxy} aria-label='Answer balloons'>
                    <div className={styles.orbitRing} aria-hidden='true' />
                    {challenge.options.map((option, optionIndex) => {
                        const isBurst = burstAnswer === option;
                        const isSelected = selectedAnswer === option;

                        return (
                            <button
                                type='button'
                                key={option}
                                className={cx(
                                    styles.answerBalloon,
                                    isSelected && styles.balloonSelected,
                                    isBurst && styles.balloonBurst,
                                )}
                                style={{
                                    '--balloon-color': BALLOON_COLORS[optionIndex],
                                    '--float-delay': `${optionIndex * 0.35}s`,
                                } as CSSProperties}
                                onClick={() => burstBalloonAnswer(option)}
                                disabled={Boolean(lastResult || burstAnswer)}
                                aria-pressed={isSelected}
                            >
                                <span className={styles.balloonShine} aria-hidden='true' />
                                <span className={styles.balloonText}>{option}</span>
                                <span className={styles.balloonKnot} aria-hidden='true' />
                            </button>
                        );
                    })}
                </div>
                {showHint ? <p className={styles.hint}>{challenge.hint}</p> : null}
                {lastResult ? (
                    <div
                        className={cx(
                            styles.resultBanner,
                            lastResult === 'correct' ? styles.resultCorrect : styles.resultWrong,
                        )}
                    >
                        {lastResult === 'correct'
                            ? 'Crystal secured! Great thinking.'
                            : `Almost there. Correct answer: ${challenge.answer}`}
                    </div>
                ) : null}
                <div className={styles.actionRow}>
                    <Button
                        type='button'
                        label={missionText.hint}
                        variant={ButtonVariant.OUTLINED}
                        color='white'
                        onClick={() => setShowHint(true)}
                        disabled={showHint}
                    />
                    {lastResult ? (
                        <Button
                            type='button'
                            label={missionText.continueMission}
                            variant={ButtonVariant.SOLID}
                            color='white'
                            onClick={completeMission}
                        />
                    ) : null}
                </div>
            </div>
        </section>
    );

    const renderReward = () => (
        <section className={styles.panel}>
            <div className={styles.confetti} aria-hidden='true'>✦ ✦ ✦</div>
            <Text tagType='h1' font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}>
                {missionText.rewardTitle}
            </Text>
            <div className={styles.statsGrid}>
                <div>
                    <span>XP</span>
                    <strong>{progress.xp}</strong>
                </div>
                <div>
                    <span>Coins</span>
                    <strong>{progress.coins}</strong>
                </div>
                <div>
                    <span>Crystals</span>
                    <strong>{progress.crystals}</strong>
                </div>
            </div>
            <Button
                type='button'
                label={missionText.nextPlanet}
                variant={ButtonVariant.SOLID}
                color='white'
                onClick={openMap}
            />
        </section>
    );

    const renderReport = () => (
        <section className={styles.panel}>
            <Text tagType='h1' font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}>
                {missionText.reportTitle}
            </Text>
            <div className={styles.reportGrid}>
                <div>Overall Score <strong>{progress.xp}</strong></div>
                <div>Accuracy <strong>{progress.accuracy}%</strong></div>
                <div>Average Time <strong>{getAverageTime(progress)}s</strong></div>
                <div>Astronaut Rank <strong>{rank}</strong></div>
                <div>Reaction Time <strong>{Math.max(10, 60 - getAverageTime(progress))}</strong></div>
                <div>Stars <strong>{progress.stars}</strong></div>
            </div>
            <div className={styles.badgeList}>
                {progress.badges.map((badge) => (
                    <span key={badge}>{badge}</span>
                ))}
            </div>
            <div className={styles.actionRow}>
                <Button
                    type='button'
                    label='Restart Adventure'
                    variant={ButtonVariant.OUTLINED}
                    color='white'
                    onClick={restartGame}
                />
                <Button
                    type='button'
                    label={missionText.dashboard}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={exitToDashboard}
                />
            </div>
        </section>
    );

    const renderStage = () => {
        if (stage === 'intro') return renderIntro();
        if (stage === 'briefing') return renderBriefing();
        if (stage === 'map') return renderMap();
        if (stage === 'mission') return renderMission();
        if (stage === 'reward') return renderReward();

        return renderReport();
    };

    return (
        <main className={styles.page}>
            <div className={styles.stars} aria-hidden='true' />
            <header className={styles.header}>
                <Text tagType='strong' font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}>
                    {missionText.title}
                </Text>
                {renderShellActions()}
            </header>
            {profileQuery.isLoading ? <ShimmerUiContainer className={styles.loading} /> : renderStage()}
        </main>
    );
};

export default SpaceMissionGamePage;
