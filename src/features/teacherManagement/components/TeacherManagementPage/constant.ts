export const TEACHER_MANAGEMENT_TEXT = {
    title: 'Teacher Management',
    subtitle: 'View, add, edit, and remove teachers assigned to schools.',
    addButton: 'Add Teacher',
    uploadButton: 'Upload Teachers',
    clearButton: 'Clear',
    regionFilterLabel: 'Region',
    regionFilterPlaceholder: 'Select region',
    schoolFilterLabel: 'School',
    schoolFilterPlaceholder: 'Select school',
    schoolFilterDisabledPlaceholder: 'Select region first',
    searchLabel: 'Teacher Name',
    searchPlaceholder: 'Search by teacher name',
    emptyText: 'No teachers found',
    errorTitle: 'Unable to load teachers',
    retryButton: 'Retry',
    teacherNameColumn: 'Teacher Name',
    gradeColumn: 'Grade',
    subjectColumn: 'Subject',
    schoolNameColumn: 'School Name',
    regionColumn: 'Region',
    actionsColumn: 'Actions',
    editButton: 'Edit',
    deleteButton: 'Delete',
    paginationLabel: 'Teacher list pagination',
    previousButton: 'Previous',
    nextButton: 'Next',
};

export const TEACHER_FORM_TEXT = {
    addTitle: 'Add Teacher',
    editTitle: 'Edit Teacher',
    firstName: { label: 'First Name', placeholder: 'Enter first name' },
    lastName: { label: 'Last Name', placeholder: 'Enter last name' },
    mobileNo: { label: 'Mobile No', placeholder: 'Enter 10-digit mobile number' },
    email: { label: 'Email', placeholder: 'Enter email address' },
    empCode: { label: 'Employee Code', placeholder: 'Enter employee code' },
    gender: { label: 'Gender', placeholder: 'Select gender' },
    address: { label: 'Address', placeholder: 'Enter address' },
    grade: { label: 'Grade', placeholder: 'Select grade' },
    subject: { label: 'Subject', placeholder: 'Select subject' },
    udisecode: { label: 'UDISE Code', placeholder: 'Enter UDISE code' },
    cancelButton: 'Cancel',
    addSubmitButton: 'Add Teacher',
    editSubmitButton: 'Save Changes',
};

export const DELETE_TEACHER_TEXT = {
    title: 'Delete Teacher',
    description: 'This teacher will be removed from the list. This action cannot be undone.',
    cancelButton: 'Cancel',
    deleteButton: 'Delete Teacher',
};

export const UPLOAD_TEACHER_TEXT = {
    title: 'Upload Teachers',
    description: 'Upload an Excel/CSV file or provide a Google Sheet link.',
    fileLabel: 'Excel or CSV File',
    fileHint: 'Accepted formats: .xlsx, .xls, .csv',
    sheetUrl: {
        label: 'Google Sheet URL',
        placeholder: 'Paste Google Sheet link',
    },
    validationMessage: 'Upload a file or enter a Google Sheet URL',
    cancelButton: 'Cancel',
    submitButton: 'Upload Teachers',
};

export const TEACHER_VALIDATION = {
    firstName: { minLength: 3, maxLength: 50, requiredMessage: 'First name is required', invalidMessage: 'First name must be 3-50 chars' },
    lastName: { minLength: 1, maxLength: 50, requiredMessage: '', invalidMessage: '' },
    mobileNo: { minLength: 10, maxLength: 15, requiredMessage: 'Mobile no is required', invalidMessage: 'Enter valid mobile number' },
    email: { minLength: 5, maxLength: 255, requiredMessage: 'Email is required', invalidMessage: 'Enter valid email' },
    empCode: { minLength: 1, maxLength: 50, requiredMessage: 'Employee code is required', invalidMessage: '' },
    address: { minLength: 1, maxLength: 255, requiredMessage: '', invalidMessage: '' },
    gradeId: { requiredMessage: 'Grade is required' },
    subjectId: { requiredMessage: 'Subject is required' },
    udisecode: { requiredMessage: 'UDISE Code is required' },
    gender: { requiredMessage: '' },
};

export const TEACHER_PAGE_SIZE = 10;
