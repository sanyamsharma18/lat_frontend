'use client';

import { useMemo } from 'react';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Input from '@/components/ui/Input/Input';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { Reviewer } from '@/types/reviewer';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { useReviewerManagement } from '../../hooks/useReviewerManagement';

import ReviewerFormModal from './components/ReviewerFormModal';
import { REVIEWER_MANAGEMENT_TEXT } from './constant';

import styles from './styles.module.scss';

const formatDate = (value: string) => {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const getFullName = (reviewer: Reviewer) =>
    `${reviewer.firstName || ''} ${reviewer.lastName || ''}`.trim() || '-';

interface ReviewerActionHandlers {
    isStatusUpdating: boolean;
    onEdit: (reviewer: Reviewer) => void;
    onToggleStatus: (reviewer: Reviewer) => void;
}

const ReviewerActions = ({
    isStatusUpdating,
    onEdit,
    onToggleStatus,
    reviewer,
}: ReviewerActionHandlers & { reviewer: Reviewer }) => {
    const isActive = reviewer.status === 1;

    return (
        <div className={styles.rowActions}>
            <button
                type='button'
                className={styles.actionButton}
                onClick={() => onEdit(reviewer)}
            >
                {REVIEWER_MANAGEMENT_TEXT.editButton}
            </button>
            <button
                type='button'
                className={isActive ? styles.deactivateButton : styles.activateButton}
                onClick={() => onToggleStatus(reviewer)}
                disabled={isStatusUpdating}
            >
                {isActive
                    ? REVIEWER_MANAGEMENT_TEXT.deactivateButton
                    : REVIEWER_MANAGEMENT_TEXT.activateButton}
            </button>
        </div>
    );
};

const getReviewerColumns = ({
    isStatusUpdating,
    onEdit,
    onToggleStatus,
}: ReviewerActionHandlers): DataTableColumn<Reviewer>[] => [
    {
        id: 'reviewerName',
        header: REVIEWER_MANAGEMENT_TEXT.reviewerNameColumn,
        cell: (reviewer) => (
            <Text
                tagType='strong'
                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                color='black'
            >
                {getFullName(reviewer)}
            </Text>
        ),
    },
    {
        id: 'email',
        header: 'Email',
        cell: (reviewer) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {reviewer.email || '-'}
            </Text>
        ),
    },
    {
        id: 'mobileNo',
        header: REVIEWER_MANAGEMENT_TEXT.mobileNoColumn,
        cell: (reviewer) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {reviewer.mobileNo || '-'}
            </Text>
        ),
    },
    {
        id: 'status',
        header: REVIEWER_MANAGEMENT_TEXT.statusColumn,
        cell: (reviewer) => {
            const isActive = reviewer.status === 1;

            return (
                <span className={isActive ? styles.activeStatus : styles.inactiveStatus}>
                    {isActive ? 'Active' : 'Inactive'}
                </span>
            );
        },
    },
    {
        id: 'createdAt',
        header: REVIEWER_MANAGEMENT_TEXT.createdAtColumn,
        cell: (reviewer) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {formatDate(reviewer.createdAt)}
            </Text>
        ),
    },
    {
        id: 'actions',
        header: REVIEWER_MANAGEMENT_TEXT.actionsColumn,
        cell: (reviewer) => (
            <ReviewerActions
                reviewer={reviewer}
                isStatusUpdating={isStatusUpdating}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
            />
        ),
    },
];

const getRenderMobileCard =
    ({ isStatusUpdating, onEdit, onToggleStatus }: ReviewerActionHandlers) =>
    (reviewer: Reviewer) => {
        const { email, status } = reviewer;
        const isActive = status === 1;

        return (
            <div className={styles.mobileCardContent}>
                <div>
                    <Text
                        tagType='strong'
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='black'
                    >
                        {getFullName(reviewer)}
                    </Text>
                    <Text
                        font={[FontType.text_xs_regular, FontType.text_xs_regular]}
                        color='gray-500'
                    >
                        {email || '-'}
                    </Text>
                    <span className={isActive ? styles.activeStatus : styles.inactiveStatus}>
                        {isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <ReviewerActions
                    reviewer={reviewer}
                    isStatusUpdating={isStatusUpdating}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                />
            </div>
        );
    };

const ReviewerManagementPage = () => {
    const {
        handleClearFilters,
        handleOpenAddModal,
        handleOpenEditModal,
        handleSearchChange,
        handleSubmitReviewer,
        handleToggleReviewerStatus,
        hasActiveFilters,
        isFormModalOpen,
        isStatusUpdating,
        isSubmitting,
        modalMode,
        page,
        reviewerListQuery,
        searchValue,
        selectedReviewer,
        setIsFormModalOpen,
        setPage,
        totalPages,
    } = useReviewerManagement();

    const columns = useMemo<DataTableColumn<Reviewer>[]>(
        () =>
            getReviewerColumns({
                isStatusUpdating,
                onEdit: handleOpenEditModal,
                onToggleStatus: handleToggleReviewerStatus,
            }),
        [handleOpenEditModal, handleToggleReviewerStatus, isStatusUpdating],
    );
    const renderMobileCard = useMemo(
        () =>
            getRenderMobileCard({
                isStatusUpdating,
                onEdit: handleOpenEditModal,
                onToggleStatus: handleToggleReviewerStatus,
            }),
        [handleOpenEditModal, handleToggleReviewerStatus, isStatusUpdating],
    );

    const renderTableContent = () => {
        if (reviewerListQuery.isLoading) {
            return (
                <div className={styles.loadingState} role='status' aria-live='polite'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ShimmerUiContainer
                            key={`reviewer-loading-${index + 1}`}
                            className={styles.shimmerRow}
                        />
                    ))}
                </div>
            );
        }

        if (reviewerListQuery.isError) {
            return (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {REVIEWER_MANAGEMENT_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={REVIEWER_MANAGEMENT_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => reviewerListQuery.refetch()}
                    />
                </div>
            );
        }

        if (!reviewerListQuery.data?.reviewers.length) {
            return (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon} aria-hidden='true'>
                        RM
                    </div>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {REVIEWER_MANAGEMENT_TEXT.emptyText}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        Try changing search or add a new reviewer.
                    </Text>
                </div>
            );
        }

        return (
            <DataTable
                columns={columns}
                data={reviewerListQuery.data?.reviewers ?? []}
                getRowKey={(reviewer) => reviewer.id}
                emptyText={REVIEWER_MANAGEMENT_TEXT.emptyText}
                renderMobileCard={renderMobileCard}
            />
        );
    };

    return (
        <main className={styles.page}>
            <section className={styles.header}>
                <div className={styles.titleGroup}>
                    <Text
                        tagType='h1'
                        font={[FontType.text_xxl_semibold, FontType.text_xxl_semibold]}
                        color='black'
                    >
                        {REVIEWER_MANAGEMENT_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {REVIEWER_MANAGEMENT_TEXT.subtitle}
                    </Text>
                </div>

                <Button
                    type='button'
                    label={REVIEWER_MANAGEMENT_TEXT.addButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={handleOpenAddModal}
                />
            </section>

            <section className={styles.toolbar}>
                <Input
                    id='reviewerSearch'
                    label={REVIEWER_MANAGEMENT_TEXT.searchLabel}
                    name='reviewerSearch'
                    type='search'
                    value={searchValue}
                    placeholder={REVIEWER_MANAGEMENT_TEXT.searchPlaceholder}
                    onChange={handleSearchChange}
                    inputBaseClass={styles.searchInput}
                    className={styles.compactInput}
                    autoComplete='off'
                />

                <Button
                    type='button'
                    label={REVIEWER_MANAGEMENT_TEXT.clearButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.clearButton, styles.compactButton)}
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                />
            </section>

            <section className={styles.tableSection}>{renderTableContent()}</section>

            <nav
                className={styles.pagination}
                aria-label={REVIEWER_MANAGEMENT_TEXT.paginationLabel}
            >
                <Button
                    type='button'
                    label={REVIEWER_MANAGEMENT_TEXT.previousButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page <= 1 || reviewerListQuery.isLoading}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                />

                <Text font={[FontType.text_sm_medium, FontType.text_sm_medium]} color='gray-500'>
                    Page {page} of {totalPages}
                </Text>

                <Button
                    type='button'
                    label={REVIEWER_MANAGEMENT_TEXT.nextButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page >= totalPages || reviewerListQuery.isLoading}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                />
            </nav>

            <ReviewerFormModal
                open={isFormModalOpen}
                mode={modalMode}
                reviewer={selectedReviewer}
                isSubmitting={isSubmitting}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmitReviewer}
            />

            <Toaster />
        </main>
    );
};

export default ReviewerManagementPage;
