export const REVIEWER_PAGE_SIZE = 10;

export const REVIEWER_MANAGEMENT_TEXT = {
    title: 'Reviewer Management',
    subtitle: 'Add and manage reviewers for assessment review workflows.',
    addButton: 'Add Reviewer',
    clearButton: 'Clear',
    retryButton: 'Retry',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by name, email, or employee code',
    reviewerNameColumn: 'Reviewer Name',
    mobileNoColumn: 'Mobile No',
    statusColumn: 'Status',
    createdAtColumn: 'Created At',
    actionsColumn: 'Actions',
    emptyText: 'No reviewers found',
    errorTitle: 'Unable to load reviewers.',
    paginationLabel: 'Reviewer list pagination',
    previousButton: 'Previous',
    nextButton: 'Next',
    editButton: 'Edit',
    activateButton: 'Activate',
    deactivateButton: 'Deactivate',
};

export const REVIEWER_FORM_TEXT = {
    addTitle: 'Add Reviewer',
    editTitle: 'Edit Reviewer',
    addSubmitButton: 'Add Reviewer',
    editSubmitButton: 'Update Reviewer',
    cancelButton: 'Cancel',
    firstName: {
        label: 'First Name',
        placeholder: 'Enter first name',
    },
    lastName: {
        label: 'Last Name',
        placeholder: 'Enter last name',
    },
    mobileNo: {
        label: 'Mobile No',
        placeholder: 'Enter mobile number',
    },
    email: {
        label: 'Email',
        placeholder: 'Enter email address',
    },
};

export const REVIEWER_VALIDATION = {
    firstName: {
        requiredMessage: 'First name is required',
        minLength: 2,
        maxLength: 50,
        invalidMessage: 'First name must be 2 to 50 characters',
    },
    mobileNo: {
        requiredMessage: 'Mobile number is required',
        minLength: 10,
        maxLength: 15,
        invalidMessage: 'Mobile number must be 10 to 15 digits',
    },
    email: {
        requiredMessage: 'Email is required',
        minLength: 5,
        maxLength: 255,
        invalidMessage: 'Email must be a valid length',
    },
};
