import { QuestionOptionItem, QuestionStatus } from '@/types/questionGenerator';

export const QUESTION_PAGE_SIZE = 10;

export const QUESTION_GENERATOR_TEXT = {
    title: 'Question Generator',
    subtitle: 'Generate, review, and maintain assessment questions for students.',
    generateTitle: 'Generate Questions',
    searchTitle: 'Search Questions',
    listTitle: 'Question List',
    gradeGroupLabel: 'Grade Group',
    gradeLabel: 'Grade',
    subjectLabel: 'Subject',
    competencyLabel: 'Competency',
    statusLabel: 'Status',
    numberOfQuestionsLabel: 'No. of Questions',
    generateButton: 'Generate Questions',
    addButton: 'Add Question',
    searchButton: 'Search',
    resetButton: 'Reset',
    searchLabel: 'Search',
    searchPlaceholder: 'Search by Question ID / Text...',
    allOption: 'All',
    questionIdColumn: 'Question ID',
    gradeColumn: 'Grade',
    subjectColumn: 'Subject',
    competencyColumn: 'Competency',
    questionTextColumn: 'Question Text',
    statusColumn: 'Status',
    imageColumn: 'Image',
    actionsColumn: 'Actions',
    emptyText: 'No questions found',
    errorTitle: 'Unable to load questions',
    retryButton: 'Retry',
    previousButton: 'Previous',
    nextButton: 'Next',
    paginationLabel: 'Question pagination',
    noImageText: 'No Image',
    addImageText: 'Add',
    changeImageText: 'Change',
    viewAction: 'View question',
    editAction: 'Edit question',
    deleteAction: 'Delete question',
};

export const QUESTION_FORM_TEXT = {
    addTitle: 'Add Question',
    editTitle: 'Edit Question',
    viewTitle: 'Question Details',
    questionText: {
        label: 'Question Text',
        placeholder: 'Enter question text',
    },
    instruction: {
        label: 'Instruction',
        placeholder: 'Enter instruction for this question',
    },
    relationKey: {
        label: 'Relation Key',
        placeholder: 'Enter relation key',
    },
    imageUrl: {
        label: 'Image URL',
        placeholder: 'Optional image URL',
    },
    status: {
        label: 'Status',
        placeholder: 'Select status',
    },
    correctOption: {
        label: 'Correct Option',
        placeholder: 'Select correct option',
    },
    explanation: {
        label: 'Answer Explanation',
        placeholder: 'Optional answer explanation',
    },
    optionLabel: 'Option',
    cancelButton: 'Cancel',
    addSubmitButton: 'Add Question',
    editSubmitButton: 'Save Changes',
};

export const DELETE_QUESTION_TEXT = {
    title: 'Delete Question',
    description: 'This question will be removed from the question list. This action cannot be undone.',
    cancelButton: 'Cancel',
    deleteButton: 'Delete Question',
};

export const REQUIRED_MESSAGE = 'This field is required';

export const GRADE_GROUP_OPTIONS: QuestionOptionItem[] = [
    { id: 'Primary', name: 'Primary' },
    { id: 'Middle', name: 'Middle' },
    { id: 'Secondary', name: 'Secondary' },
];

export const TERM_OPTIONS: QuestionOptionItem[] = [
    { id: 'Term 1', name: 'Term 1' },
    { id: 'Term 2', name: 'Term 2' },
];

export const GRADE_OPTIONS: QuestionOptionItem[] = [
    { id: 'Grade V', name: 'Grade V' },
    { id: 'Grade VI', name: 'Grade VI' },
    { id: 'Grade VII', name: 'Grade VII' },
    { id: 'Grade VIII', name: 'Grade VIII' },
];

export const SUBJECT_OPTIONS: QuestionOptionItem[] = [
    { id: 'English', name: 'English' },
    { id: 'Mathematics', name: 'Mathematics' },
    { id: 'Science', name: 'Science' },
    { id: 'General Knowledge', name: 'General Knowledge' },
];

export const COMPETENCY_OPTIONS: QuestionOptionItem[] = [
    { id: 'Reading Comprehension', name: 'Reading Comprehension' },
    { id: 'Grammar', name: 'Grammar' },
    { id: 'Addition', name: 'Addition' },
    { id: 'Subtraction', name: 'Subtraction' },
    { id: 'Plants', name: 'Plants' },
    { id: 'Environment', name: 'Environment' },
];

export const STATUS_OPTIONS: QuestionOptionItem[] = [
    { id: '1', name: 'Approve' },
    { id: '0', name: 'Reject' },
    { id: '2', name: 'Draft' },
];

export const ALL_STATUS_OPTIONS: QuestionOptionItem[] = [
    { id: '', name: QUESTION_GENERATOR_TEXT.allOption },
    ...STATUS_OPTIONS,
];

export const ALL_GRADE_OPTIONS: QuestionOptionItem[] = [
    { id: '', name: QUESTION_GENERATOR_TEXT.allOption },
    ...GRADE_OPTIONS,
];

export const ALL_SUBJECT_OPTIONS: QuestionOptionItem[] = [
    { id: '', name: QUESTION_GENERATOR_TEXT.allOption },
    ...SUBJECT_OPTIONS,
];

export const ALL_COMPETENCY_OPTIONS: QuestionOptionItem[] = [
    { id: '', name: QUESTION_GENERATOR_TEXT.allOption },
    ...COMPETENCY_OPTIONS,
];

export const CORRECT_OPTION_OPTIONS: QuestionOptionItem[] = [
    { id: 'A', name: 'Option A' },
    { id: 'B', name: 'Option B' },
    { id: 'C', name: 'Option C' },
    { id: 'D', name: 'Option D' },
];

export const DEFAULT_QUESTION_STATUS: QuestionStatus = 'Draft';
