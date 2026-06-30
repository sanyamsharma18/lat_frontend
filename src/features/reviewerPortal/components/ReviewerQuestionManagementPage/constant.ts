import { QuestionOptionItem } from '@/types/questionGenerator';

export const REVIEWER_QUESTION_PAGE_SIZE = 10;

export const REVIEWER_QUESTION_TEXT = {
    searchTitle: 'Search Questions',
    listTitle: 'Question List',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by Question ID / Text.',
    gradeGroupLabel: 'Grade Group',
    gradeLabel: 'Grade',
    subjectLabel: 'Subject',
    termLabel: 'Term',
    competencyLabel: 'Competency',
    statusLabel: 'Status',
    resetButton: 'Reset',
    questionIdColumn: 'Question ID',
    gradeColumn: 'Grade',
    subjectColumn: 'Subject',
    competencyColumn: 'Competency',
    questionTextColumn: 'Question Text',
    statusColumn: 'Status',
    imageColumn: 'Image',
    actionsColumn: 'Actions',
    uploadText: 'Upload',
    viewText: 'View',
    emptyText: 'No questions found',
    errorTitle: 'Unable to load questions',
    retryButton: 'Retry',
    previousButton: 'Previous',
    nextButton: 'Next',
    paginationLabel: 'Reviewer question pagination',
};

export const REVIEW_MODAL_TEXT = {
    title: 'Question Preview',
    remarkLabel: 'Remark',
    remarkPlaceholder: 'Enter reviewer remark',
    approveButton: 'Approve',
    rejectButton: 'Reject',
    closeButton: 'Close',
    optionsTitle: 'Options',
};

export const TERM_OPTIONS: QuestionOptionItem[] = [
    { id: 'Term 1', name: 'Term 1' },
    { id: 'Term 2', name: 'Term 2' },
];

export const STATUS_OPTIONS: QuestionOptionItem[] = [
    { id: '', name: 'All' },
    { id: 'Draft', name: 'Draft' },
    { id: 'Approved', name: 'Approved' },
    { id: 'Rejected', name: 'Rejected' },
];
