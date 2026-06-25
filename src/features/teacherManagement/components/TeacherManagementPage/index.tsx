'use client';

import { useMemo } from 'react';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';

import { ButtonVariant, FontType } from '@/types/typographyCommon';
import { Teacher } from '@/types/teacher';

import { useTeacherManagement } from '../../hooks/useTeacherManagement';

import DeleteTeacherModal from './components/DeleteTeacherModal';
import TeacherFormModal from './components/TeacherFormModal';
import UploadTeacherModal from './components/UploadTeacherModal';
import { TEACHER_MANAGEMENT_TEXT } from './constant';

import styles from './styles.module.scss';

interface TeacherActionHandlers {
    onEdit: (teacher: Teacher) => void;
    onDelete: (teacher: Teacher) => void;
}

const TeacherActions = ({
    teacher: selectedTeacher,
    onEdit,
    onDelete,
}: TeacherActionHandlers & { teacher: Teacher }) => (
    <div className={styles.rowActions}>
        <button
            type='button'
            className={styles.actionButton}
            onClick={() => onEdit(selectedTeacher)}
        >
            {TEACHER_MANAGEMENT_TEXT.editButton}
        </button>
        <button
            type='button'
            className={styles.deleteButton}
            onClick={() => onDelete(selectedTeacher)}
        >
            {TEACHER_MANAGEMENT_TEXT.deleteButton}
        </button>
    </div>
);

const getTeacherColumns = ({
    onEdit,
    onDelete,
}: TeacherActionHandlers): DataTableColumn<Teacher>[] => [
    {
        id: 'teacherName',
        header: TEACHER_MANAGEMENT_TEXT.teacherNameColumn,
        cell: (teacher) => (
            <Text
                tagType='strong'
                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                color='black'
            >
                {`${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || '-'}
            </Text>
        ),
    },
    {
        id: 'email',
        header: 'Email',
        cell: (teacher) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {teacher.email || '-'}
            </Text>
        ),
    },
    {
        id: 'mobileNo',
        header: 'Mobile No',
        cell: (teacher) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {teacher.mobileNo || '-'}
            </Text>
        ),
    },
    {
        id: 'schoolName',
        header: TEACHER_MANAGEMENT_TEXT.schoolNameColumn,
        cell: (teacher) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {teacher.schoolName || '-'}
            </Text>
        ),
    },
    {
        id: 'regionName',
        header: TEACHER_MANAGEMENT_TEXT.regionColumn,
        cell: (teacher) => (
            <Text font={[FontType.text_sm_regular, FontType.text_sm_regular]} color='gray-500'>
                {teacher.regionName || '-'}
            </Text>
        ),
    },
    {
        id: 'actions',
        header: TEACHER_MANAGEMENT_TEXT.actionsColumn,
        cell: (teacher) => <TeacherActions teacher={teacher} onEdit={onEdit} onDelete={onDelete} />,
    },
];

const getRenderMobileCard =
    ({ onEdit, onDelete }: TeacherActionHandlers) =>
    (teacher: Teacher) => {
        const { id, firstName, lastName, gradeId, subjectId, regionId, schoolId, schoolName, regionName } = teacher;
        const fullName = `${firstName || ''} ${lastName || ''}`.trim() || '-';
        return (
        <div className={styles.mobileCardContent}>
            <div>
                <Text
                    tagType='strong'
                    font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                    color='black'
                >
                    {fullName}
                </Text>
                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]} color='gray-500'>
                    {schoolName || '-'}
                </Text>
                <Text font={[FontType.text_xs_regular, FontType.text_xs_regular]} color='gray-500'>
                    {regionName || '-'}
                </Text>
            </div>

            <TeacherActions
                teacher={teacher}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    )};

const TeacherManagementPage = () => {
    const {
        handleClearFilters,
        handleDeleteTeacher,
        handleDownloadTeacherTemplate,
        handleOpenAddModal,
        handleOpenDeleteModal,
        handleOpenEditModal,
        handleOpenUploadModal,
        handleRegionChange,
        handleSearchChange,
        handleSchoolChange,
        handleSubmitTeacher,
        handleUploadTeachers,
        hasActiveFilters,
        isDeleteModalOpen,
        isDeleting,
        isFormModalOpen,
        isSubmitting,
        isTemplateDownloading,
        isUploadModalOpen,
        isUploading,
        modalMode,
        page,
        regionListQuery,
        searchValue,
        schoolListQuery,
        selectedRegion,
        selectedSchool,
        selectedTeacher,
        setIsDeleteModalOpen,
        setIsFormModalOpen,
        setIsUploadModalOpen,
        setPage,
        teacherListQuery,
        totalPages,
    } = useTeacherManagement();

    const columns = useMemo<DataTableColumn<Teacher>[]>(
        () =>
            getTeacherColumns({
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
            }),
        [handleOpenDeleteModal, handleOpenEditModal],
    );

    const renderMobileCard = useMemo(
        () =>
            getRenderMobileCard({
                onEdit: handleOpenEditModal,
                onDelete: handleOpenDeleteModal,
            }),
        [handleOpenDeleteModal, handleOpenEditModal],
    );

    const renderTableContent = () => {
        if (teacherListQuery.isLoading) {
            return (
                <div className={styles.loadingState} role='status' aria-live='polite'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ShimmerUiContainer
                            key={`teacher-loading-${index + 1}`}
                            className={styles.shimmerRow}
                        />
                    ))}
                </div>
            );
        }

        if (teacherListQuery.isError) {
            return (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {TEACHER_MANAGEMENT_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={TEACHER_MANAGEMENT_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => teacherListQuery.refetch()}
                    />
                </div>
            );
        }

        if (!teacherListQuery.data?.teachers.length) {
            return (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon} aria-hidden='true'>
                        TM
                    </div>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {TEACHER_MANAGEMENT_TEXT.emptyText}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        Try changing filters or add a new teacher.
                    </Text>
                    <Button
                        type='button'
                        label={TEACHER_MANAGEMENT_TEXT.addButton}
                        variant={ButtonVariant.SOLID}
                        color='white'
                        onClick={handleOpenAddModal}
                    />
                </div>
            );
        }

        return (
            <DataTable
                columns={columns}
                data={teacherListQuery.data?.teachers ?? []}
                getRowKey={(teacher) => teacher.id}
                emptyText={TEACHER_MANAGEMENT_TEXT.emptyText}
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
                        {TEACHER_MANAGEMENT_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {TEACHER_MANAGEMENT_TEXT.subtitle}
                    </Text>
                </div>

                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.addButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    onClick={handleOpenAddModal}
                    className={styles.headerAction}
                />
            </section>

            <section className={styles.toolbar}>
                <Dropdown
                    label={TEACHER_MANAGEMENT_TEXT.regionFilterPlaceholder}
                    dropDownTitle={TEACHER_MANAGEMENT_TEXT.regionFilterLabel}
                    options={regionListQuery.data ?? []}
                    selectValue='name'
                    value={selectedRegion}
                    loading={regionListQuery.isLoading}
                    onChange={handleRegionChange}
                    isSearchable={false}
                    widthClassName={styles.filterControl}
                    optionAreaHeight={styles.filterOptions}
                    className={styles.compactDropdown}
                />

                <Dropdown
                    label={
                        selectedRegion
                            ? TEACHER_MANAGEMENT_TEXT.schoolFilterPlaceholder
                            : TEACHER_MANAGEMENT_TEXT.schoolFilterDisabledPlaceholder
                    }
                    dropDownTitle={TEACHER_MANAGEMENT_TEXT.schoolFilterLabel}
                    options={schoolListQuery.data ?? []}
                    selectValue='name'
                    value={selectedSchool}
                    loading={schoolListQuery.isLoading}
                    onChange={handleSchoolChange}
                    isSearchable={false}
                    disable={!selectedRegion}
                    widthClassName={styles.filterControl}
                    optionAreaHeight={styles.filterOptions}
                    className={styles.compactDropdown}
                />

                <Input
                    id='teacherSearch'
                    label={TEACHER_MANAGEMENT_TEXT.searchLabel}
                    name='teacherSearch'
                    type='search'
                    value={searchValue}
                    placeholder={TEACHER_MANAGEMENT_TEXT.searchPlaceholder}
                    onChange={handleSearchChange}
                    inputBaseClass={styles.searchInput}
                    className={styles.compactInput}
                    autoComplete='off'
                />

                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.clearButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.clearButton, styles.compactButton)}
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                />

                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.addButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    className={cx(styles.addButton, styles.compactButton)}
                    onClick={handleOpenAddModal}
                />

                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.uploadButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.uploadButton, styles.compactButton)}
                    onClick={handleOpenUploadModal}
                />
            </section>

            {teacherListQuery.data?.isFallback ? (
                <div className={styles.warningAlert} role='status'>
                    <Text
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='amber-700'
                    >
                        Backend data is unavailable. Showing development fallback data.
                    </Text>
                </div>
            ) : null}

            <section className={styles.tableSection}>{renderTableContent()}</section>

            <nav className={styles.pagination} aria-label={TEACHER_MANAGEMENT_TEXT.paginationLabel}>
                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.previousButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page <= 1 || teacherListQuery.isLoading}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                />

                <Text font={[FontType.text_sm_medium, FontType.text_sm_medium]} color='gray-500'>
                    Page {page} of {totalPages}
                </Text>

                <Button
                    type='button'
                    label={TEACHER_MANAGEMENT_TEXT.nextButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page >= totalPages || teacherListQuery.isLoading}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                />
            </nav>

            <TeacherFormModal
                open={isFormModalOpen}
                mode={modalMode}
                teacher={selectedTeacher}
                isSubmitting={isSubmitting}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmitTeacher}
            />

            <DeleteTeacherModal
                open={isDeleteModalOpen}
                teacher={selectedTeacher}
                isDeleting={isDeleting}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteTeacher}
            />

            <UploadTeacherModal
                open={isUploadModalOpen}
                isUploading={isUploading}
                isTemplateDownloading={isTemplateDownloading}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleUploadTeachers}
                onDownloadTemplate={handleDownloadTeacherTemplate}
            />

            <Toaster />
        </main>
    );
};

export default TeacherManagementPage;
