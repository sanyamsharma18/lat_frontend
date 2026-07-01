'use client';

import { useMemo } from 'react';
import { useQuery, queryOptions } from '@tanstack/react-query';

import cx from 'classnames';

import Button from '@/components/ui/Button';
import DataTable, { DataTableColumn } from '@/components/ui/DataTable';
import Dropdown from '@/components/ui/Dropdown';
import Input from '@/components/ui/Input/Input';
import ShimmerUiContainer from '@/components/ui/ShimmerUiContainer';
import Text from '@/components/ui/Text';
import Toaster from '@/components/ui/Toaster';
import Toggle from '@/components/ui/Toggle';

import { Student } from '@/types/student';
import { ButtonVariant, FontType } from '@/types/typographyCommon';

import { allGradesQueryOptions } from '@/features/teacherManagement/components/TeacherManagementPage/utils';

import { useStudentManagement } from '../../hooks/useStudentManagement';

import StudentFormModal from './components/StudentFormModal';
import UploadStudentsModal from './components/UploadStudentsModal';
import {
    SECTION_OPTIONS,
    STATUS_OPTIONS,
    STUDENT_MANAGEMENT_TEXT,
} from './constant';

import styles from './styles.module.scss';

interface StudentActionHandlers {
    onEdit: (student: Student) => void;
    onToggleStatus: (isActive: boolean, studentId: string) => void;
}

const StudentActions = ({
    student,
    onEdit,
}: Pick<StudentActionHandlers, 'onEdit'> & { student: Student }) => (
    <div className={styles.rowActions}>
        <button type='button' className={styles.actionButton} onClick={() => onEdit(student)}>
            {STUDENT_MANAGEMENT_TEXT.editButton}
        </button>
    </div>
);

const StudentStatusCell = ({
    student,
    onToggleStatus,
}: Pick<StudentActionHandlers, 'onToggleStatus'> & { student: Student }) => (
    <div className={styles.statusCell}>
        <Toggle
            value={student.id}
            isToggled={student.status === 'Active'}
            onToggle={onToggleStatus}
        />
        <span
            className={cx(
                styles.statusBadge,
                student.status === 'Inactive' && styles.inactiveBadge,
            )}
        >
            <Text
                font={[FontType.text_xs_semibold, FontType.text_xs_semibold]}
                color={student.status === 'Active' ? 'green-600' : 'red-600'}
            >
                {student.status}
            </Text>
        </span>
    </div>
);

const getStudentColumns = ({
    onEdit,
    onToggleStatus,
}: StudentActionHandlers): DataTableColumn<Student>[] => [
    {
        id: 'studentName',
        header: STUDENT_MANAGEMENT_TEXT.studentNameColumn,
        cell: (student) => (
            <Text
                tagType='strong'
                font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                color='black'
            >
                {student.studentName}
            </Text>
        ),
    },
    {
        id: 'grade',
        header: STUDENT_MANAGEMENT_TEXT.gradeColumn,
        cell: (student) => student.grade,
    },
    {
        id: 'section',
        header: STUDENT_MANAGEMENT_TEXT.sectionColumn,
        cell: (student) => student.section,
    },
    {
        id: 'fatherName',
        header: STUDENT_MANAGEMENT_TEXT.fatherNameColumn,
        cell: (student) => student.fatherName,
    },
    {
        id: 'motherName',
        header: STUDENT_MANAGEMENT_TEXT.motherNameColumn,
        cell: (student) => student.motherName,
    },
    {
        id: 'gender',
        header: STUDENT_MANAGEMENT_TEXT.genderColumn,
        cell: (student) => student.gender,
    },
    {
        id: 'dateOfBirth',
        header: STUDENT_MANAGEMENT_TEXT.dobColumn,
        cell: (student) => {
            if (!student.dateOfBirth) return '';
            const parts = student.dateOfBirth.split('-');
            if (parts.length === 3) {
                return `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
            return student.dateOfBirth;
        },
    },
    {
        id: 'status',
        header: STUDENT_MANAGEMENT_TEXT.statusColumn,
        cell: (student) => <StudentStatusCell student={student} onToggleStatus={onToggleStatus} />,
    },
    {
        id: 'actions',
        header: STUDENT_MANAGEMENT_TEXT.actionsColumn,
        cell: (student) => <StudentActions student={student} onEdit={onEdit} />,
    },
];

const StudentManagementPage = () => {
    const {
        handleClearFilters,
        handleGradeChange,
        handleOpenAddModal,
        handleOpenEditModal,
        handleSearchChange,
        handleSectionChange,
        handleStatusChange,
        handleSubmitStudent,
        handleToggleStatus,
        handleUploadStudents,
        hasActiveFilters,
        isFormModalOpen,
        isSubmitting,
        isUploadModalOpen,
        isUploading,
        modalMode,
        page,
        searchValue,
        selectedGrade,
        selectedSection,
        selectedStatus,
        selectedStudent,
        setIsFormModalOpen,
        setIsUploadModalOpen,
        setPage,
        studentListQuery,
        totalPages,
    } = useStudentManagement();

    const gradeListQuery = useQuery(queryOptions(allGradesQueryOptions()));

    const columns = useMemo(
        () =>
            getStudentColumns({
                onEdit: handleOpenEditModal,
                onToggleStatus: handleToggleStatus,
            }),
        [handleOpenEditModal, handleToggleStatus],
    );

    const renderTableContent = () => {
        if (studentListQuery.isLoading) {
            return (
                <div className={styles.loadingState} role='status' aria-live='polite'>
                    {Array.from({ length: 6 }).map((_, index) => (
                        <ShimmerUiContainer
                            key={`student-loading-${index + 1}`}
                            className={styles.shimmerRow}
                        />
                    ))}
                </div>
            );
        }

        if (studentListQuery.isError) {
            return (
                <div className={styles.errorState} role='alert'>
                    <Text
                        font={[FontType.text_sm_semibold, FontType.text_sm_semibold]}
                        color='red-600'
                    >
                        {STUDENT_MANAGEMENT_TEXT.errorTitle}
                    </Text>
                    <Button
                        type='button'
                        label={STUDENT_MANAGEMENT_TEXT.retryButton}
                        variant={ButtonVariant.OUTLINED}
                        color='black'
                        onClick={() => studentListQuery.refetch()}
                    />
                </div>
            );
        }

        if (!studentListQuery.data?.students.length) {
            return (
                <div className={styles.emptyState}>
                    <Text
                        tagType='h2'
                        font={[FontType.text_lg_semibold, FontType.text_lg_semibold]}
                        color='black'
                    >
                        {STUDENT_MANAGEMENT_TEXT.emptyText}
                    </Text>
                    <Button
                        type='button'
                        label={STUDENT_MANAGEMENT_TEXT.addButton}
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
                data={studentListQuery.data?.students ?? []}
                getRowKey={(student) => student.id}
                emptyText={STUDENT_MANAGEMENT_TEXT.emptyText}
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
                        {STUDENT_MANAGEMENT_TEXT.title}
                    </Text>
                    <Text
                        font={[FontType.text_sm_regular, FontType.text_sm_regular]}
                        color='gray-500'
                    >
                        {STUDENT_MANAGEMENT_TEXT.subtitle}
                    </Text>
                </div>
            </section>

            <section className={styles.toolbar}>
                <Input
                    id='studentSearch'
                    label={STUDENT_MANAGEMENT_TEXT.searchLabel}
                    name='studentSearch'
                    type='search'
                    value={searchValue}
                    placeholder={STUDENT_MANAGEMENT_TEXT.searchPlaceholder}
                    onChange={handleSearchChange}
                    inputBaseClass={styles.searchInput}
                    className={styles.compactInput}
                    autoComplete='off'
                />
                <Dropdown
                    label={STUDENT_MANAGEMENT_TEXT.gradeFilterPlaceholder}
                    dropDownTitle={STUDENT_MANAGEMENT_TEXT.gradeFilterLabel}
                    options={gradeListQuery.data ?? []}
                    selectValue='name'
                    value={selectedGrade}
                    loading={gradeListQuery.isLoading}
                    onChange={handleGradeChange}
                    isSearchable={false}
                    widthClassName={styles.filterControl}
                    optionAreaHeight={styles.filterOptions}
                    className={styles.compactDropdown}
                />
                <Dropdown
                    label={STUDENT_MANAGEMENT_TEXT.sectionFilterPlaceholder}
                    dropDownTitle={STUDENT_MANAGEMENT_TEXT.sectionFilterLabel}
                    options={SECTION_OPTIONS}
                    selectValue='name'
                    value={selectedSection}
                    onChange={handleSectionChange}
                    isSearchable={false}
                    widthClassName={styles.filterControl}
                    optionAreaHeight={styles.filterOptions}
                    className={styles.compactDropdown}
                />
                <Dropdown
                    label={STUDENT_MANAGEMENT_TEXT.statusFilterPlaceholder}
                    dropDownTitle={STUDENT_MANAGEMENT_TEXT.statusFilterLabel}
                    options={STATUS_OPTIONS}
                    selectValue='name'
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    isSearchable={false}
                    widthClassName={styles.filterControl}
                    optionAreaHeight={styles.filterOptions}
                    className={styles.compactDropdown}
                />
                <Button
                    type='button'
                    label='Search'
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.searchButton, styles.compactButton)}
                    onClick={() => studentListQuery.refetch()}
                />
                <Button
                    type='button'
                    label={STUDENT_MANAGEMENT_TEXT.clearButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.clearButton, styles.compactButton)}
                    onClick={handleClearFilters}
                    disabled={!hasActiveFilters}
                />
                <Button
                    type='button'
                    label={STUDENT_MANAGEMENT_TEXT.addButton}
                    variant={ButtonVariant.SOLID}
                    color='white'
                    className={cx(styles.addButton, styles.compactButton)}
                    onClick={handleOpenAddModal}
                />
                <Button
                    type='button'
                    label={STUDENT_MANAGEMENT_TEXT.uploadButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    className={cx(styles.uploadButton, styles.compactButton)}
                    onClick={() => setIsUploadModalOpen(true)}
                />
            </section>

            {studentListQuery.data?.isMock ? (
                <div className={styles.warningAlert} role='status'>
                    <Text
                        font={[FontType.text_sm_medium, FontType.text_sm_medium]}
                        color='amber-700'
                    >
                        {STUDENT_MANAGEMENT_TEXT.mockAlert}
                    </Text>
                </div>
            ) : null}

            <section className={styles.tableSection}>{renderTableContent()}</section>

            <nav className={styles.pagination} aria-label={STUDENT_MANAGEMENT_TEXT.paginationLabel}>
                <Button
                    type='button'
                    label={STUDENT_MANAGEMENT_TEXT.previousButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page <= 1 || studentListQuery.isLoading}
                    onClick={() => setPage(Math.max(page - 1, 1))}
                />
                <Text font={[FontType.text_sm_medium, FontType.text_sm_medium]} color='gray-500'>
                    Page {page} of {totalPages}
                </Text>
                <Button
                    type='button'
                    label={STUDENT_MANAGEMENT_TEXT.nextButton}
                    variant={ButtonVariant.OUTLINED}
                    color='black'
                    disabled={page >= totalPages || studentListQuery.isLoading}
                    onClick={() => setPage(Math.min(page + 1, totalPages))}
                />
            </nav>

            <StudentFormModal
                open={isFormModalOpen}
                mode={modalMode}
                student={selectedStudent}
                isSubmitting={isSubmitting}
                gradeOptions={gradeListQuery.data ?? []}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleSubmitStudent}
            />
            <UploadStudentsModal
                open={isUploadModalOpen}
                isUploading={isUploading}
                onClose={() => setIsUploadModalOpen(false)}
                onSubmit={handleUploadStudents}
            />
            <Toaster />
        </main>
    );
};

export default StudentManagementPage;
