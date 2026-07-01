import { FIFTY_MAX_LENGTH, THREE_MIN_LENGTH } from '@/constants/appConstants';

import { StudentOption } from '@/types/student';

export const STUDENT_MANAGEMENT_TEXT = {
    title: 'Student Management',
    subtitle: 'View, add, edit, upload, and manage your students.',
    addButton: 'Add Student',
    uploadButton: 'Upload Students',
    clearButton: 'Clear',
    searchLabel: 'Student Name',
    searchPlaceholder: 'Search by student name',
    gradeFilterLabel: 'Grade',
    gradeFilterPlaceholder: 'Select grade',
    sectionFilterLabel: 'Section',
    sectionFilterPlaceholder: 'Select section',
    statusFilterLabel: 'Status',
    statusFilterPlaceholder: 'Select status',
    emptyText: 'No students found',
    errorTitle: 'Unable to load students',
    retryButton: 'Retry',
    studentNameColumn: 'Student Name',
    gradeColumn: 'Grade',
    sectionColumn: 'Section',
    fatherNameColumn: 'Father Name',
    motherNameColumn: 'Mother Name',
    genderColumn: 'Gender',
    dobColumn: 'DOB',
    statusColumn: 'Status',
    actionsColumn: 'Actions',
    editButton: 'Edit',
    deleteButton: 'Delete',
    paginationLabel: 'Student list pagination',
    previousButton: 'Previous',
    nextButton: 'Next',
    mockAlert: 'Backend student data is unavailable. Showing temporary student data.',
};

export const STUDENT_FORM_TEXT = {
    addTitle: 'Add Student',
    editTitle: 'Edit Student',
    studentName: { label: 'Student Name', placeholder: 'Enter student name' },
    grade: { label: 'Grade', placeholder: 'Select grade' },
    section: { label: 'Section', placeholder: 'Select section' },
    fatherName: { label: 'Father Name', placeholder: 'Enter father name' },
    motherName: { label: 'Mother Name', placeholder: 'Enter mother name' },
    gender: { label: 'Gender', placeholder: 'Select Gender' },
    dateOfBirth: { label: 'Date of Birth', placeholder: 'Select Date' },
    status: { label: 'Status', placeholder: 'Select Status' },
    parentMobile: { label: 'Parent Mobile', placeholder: 'Enter parent mobile' },
    email: { label: 'Email', placeholder: 'Enter email address' },
    rollNo: { label: 'Roll Number', placeholder: 'Enter roll number' },
    udisecode: { label: 'UDISE Code', placeholder: 'Enter UDISE code' },
    address: { label: 'Address', placeholder: 'Enter address' },
    cancelButton: 'Cancel',
    addSubmitButton: 'Add Student',
    editSubmitButton: 'Save Changes',
};

export const DELETE_STUDENT_TEXT = {
    title: 'Delete Student',
    description: 'This student will be removed from the list. This action cannot be undone.',
    cancelButton: 'Cancel',
    deleteButton: 'Delete Student',
};

export const UPLOAD_STUDENT_TEXT = {
    title: 'Upload Students',
    description: 'Upload the backend student template file. Validation runs during upload.',
    fileLabel: 'Excel or CSV File',
    fileHint: 'Accepted formats: .xlsx, .csv',
    cancelButton: 'Cancel',
    submitButton: 'Import Students',
    validationMessage: 'Select a CSV or Excel file before import.',
    previewTitle: 'Upload Preview',
};

export const GRADE_OPTIONS: StudentOption[] = Array.from({ length: 12 }, (_, index) => ({
    id: `Grade ${index + 1}`,
    name: `Grade ${index + 1}`,
}));

export const SECTION_OPTIONS: StudentOption[] = ['A', 'B', 'C', 'D'].map((section) => ({
    id: `Section ${section}`,
    name: `Section ${section}`,
}));

export const STATUS_OPTIONS: StudentOption[] = [
    { id: '1', name: 'Active' },
    { id: '0', name: 'Inactive' },
];

export const GENDER_OPTIONS: StudentOption[] = ['Male', 'Female', 'Other'].map((gender) => ({
    id: gender,
    name: gender,
}));

export const STUDENT_VALIDATION = {
    studentName: {
        minLength: THREE_MIN_LENGTH,
        maxLength: FIFTY_MAX_LENGTH,
        requiredMessage: 'Student name is required',
        invalidMessage: 'Student name should be 3 to 50 characters',
    },
    fatherName: {
        minLength: THREE_MIN_LENGTH,
        maxLength: FIFTY_MAX_LENGTH,
        requiredMessage: 'Father name is required',
        invalidMessage: 'Father name should be 3 to 50 characters',
    },
    motherName: {
        minLength: THREE_MIN_LENGTH,
        maxLength: FIFTY_MAX_LENGTH,
        requiredMessage: 'Mother name is required',
        invalidMessage: 'Mother name should be 3 to 50 characters',
    },
    grade: { requiredMessage: 'Grade is required' },
    section: { requiredMessage: 'Section is required' },
    gender: { requiredMessage: 'Gender is required' },
    dateOfBirth: { requiredMessage: 'Date of birth is required' },
    status: { requiredMessage: 'Status is required' },
    parentMobile: { requiredMessage: 'Parent Mobile is required' },
    email: { requiredMessage: 'Email is required' },
    rollNo: { requiredMessage: '' },
    udisecode: { requiredMessage: 'UDISE Code is required' },
    address: { requiredMessage: '' },
};

export const STUDENT_PAGE_SIZE = 10;
