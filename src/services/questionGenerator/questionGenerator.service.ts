import {
    GenerateQuestionsPayload,
    QuestionFormValues,
    QuestionListFilters,
    QuestionListResponse,
    QuestionRecord,
    QuestionStatus,
} from '@/types/questionGenerator';

const now = () => new Date().toISOString();

let mockQuestions: QuestionRecord[] = [
    {
        id: '1',
        questionId: 'Q0001',
        gradeGroup: 'Primary',
        grade: 'Grade V',
        subject: 'English',
        competency: 'Reading Comprehension',
        instruction: 'Read the sentence and select the best answer.',
        questionText: '<p>What is the synonym of <strong>"Happy"</strong>?</p>',
        status: 'Active',
        imageUrl: '/images/shapes/cone.png',
        options: [
            { id: 'A', relationKey: 'happy_synonym_a', text: 'Joyful', isCorrect: true },
            { id: 'B', relationKey: 'happy_synonym_b', text: 'Angry', isCorrect: false },
            { id: 'C', relationKey: 'happy_synonym_c', text: 'Tired', isCorrect: false },
            { id: 'D', relationKey: 'happy_synonym_d', text: 'Silent', isCorrect: false },
        ],
        answerExplanation: 'Joyful means feeling or expressing happiness.',
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: '2',
        questionId: 'Q0002',
        gradeGroup: 'Primary',
        grade: 'Grade V',
        subject: 'Mathematics',
        competency: 'Addition',
        instruction: 'Solve the following arithmetic problem.',
        questionText: '<p><strong>25 + 35</strong> = ?</p>',
        status: 'Draft',
        options: [
            { id: 'A', relationKey: 'addition_25_35_a', text: '50', isCorrect: false },
            { id: 'B', relationKey: 'addition_25_35_b', text: '60', isCorrect: true },
            { id: 'C', relationKey: 'addition_25_35_c', text: '70', isCorrect: false },
            { id: 'D', relationKey: 'addition_25_35_d', text: '80', isCorrect: false },
        ],
        answerExplanation: '25 plus 35 equals 60.',
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: '3',
        questionId: 'Q0003',
        gradeGroup: 'Middle',
        grade: 'Grade VI',
        subject: 'Science',
        competency: 'Plants',
        instruction: 'Observe the plant concept and choose the correct option.',
        questionText: '<p>Which part of the plant <em>prepares food</em>?</p>',
        status: 'Active',
        imageUrl: '/images/shapes/rectangle.png',
        options: [
            { id: 'A', relationKey: 'plant_food_a', text: 'Root', isCorrect: false },
            { id: 'B', relationKey: 'plant_food_b', text: 'Stem', isCorrect: false },
            { id: 'C', relationKey: 'plant_food_c', text: 'Leaf', isCorrect: true },
            { id: 'D', relationKey: 'plant_food_d', text: 'Flower', isCorrect: false },
        ],
        answerExplanation: 'Leaves prepare food through photosynthesis.',
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: '4',
        questionId: 'Q0004',
        gradeGroup: 'Middle',
        grade: 'Grade VI',
        subject: 'English',
        competency: 'Grammar',
        instruction: 'Identify the part of speech asked in the question.',
        questionText: '<p>Identify the noun in the sentence: <strong>The boy is playing.</strong></p>',
        status: 'Inactive',
        options: [
            { id: 'A', relationKey: 'noun_sentence_a', text: 'The', isCorrect: false },
            { id: 'B', relationKey: 'noun_sentence_b', text: 'boy', isCorrect: true },
            { id: 'C', relationKey: 'noun_sentence_c', text: 'is', isCorrect: false },
            { id: 'D', relationKey: 'noun_sentence_d', text: 'playing', isCorrect: false },
        ],
        answerExplanation: 'Boy is the naming word in the sentence.',
        createdAt: now(),
        updatedAt: now(),
    },
    {
        id: '5',
        questionId: 'Q0005',
        gradeGroup: 'Middle',
        grade: 'Grade VII',
        subject: 'Mathematics',
        competency: 'Subtraction',
        instruction: 'Solve the subtraction problem.',
        questionText: '<p><strong>72 - 18</strong> = ?</p>',
        status: 'Active',
        imageUrl: '/images/shapes/cube.png',
        options: [
            { id: 'A', relationKey: 'subtraction_72_18_a', text: '44', isCorrect: false },
            { id: 'B', relationKey: 'subtraction_72_18_b', text: '54', isCorrect: true },
            { id: 'C', relationKey: 'subtraction_72_18_c', text: '64', isCorrect: false },
            { id: 'D', relationKey: 'subtraction_72_18_d', text: '90', isCorrect: false },
        ],
        answerExplanation: '72 minus 18 equals 54.',
        createdAt: now(),
        updatedAt: now(),
    },
];

const buildQuestionId = () => {
    const highestNumber = mockQuestions.reduce((highest, question) => {
        const questionNumber = Number(question.questionId.replace(/\D/g, ''));

        return Number.isFinite(questionNumber) ? Math.max(highest, questionNumber) : highest;
    }, 0);

    return `Q${String(highestNumber + 1).padStart(4, '0')}`;
};

const buildApiResult = <TData>(response: TData, message = 'Success') => ({
    data: {
        status: true,
        message,
        response,
    },
    status: 200,
    ok: true,
});

const normalize = (value: string) => value.trim().toLowerCase();

const mapFormValuesToQuestion = (
    values: QuestionFormValues,
    existingQuestion?: QuestionRecord,
): QuestionRecord => {
    const timestamp = now();

    return {
        id: existingQuestion?.id ?? String(Date.now()),
        questionId: existingQuestion?.questionId ?? buildQuestionId(),
        gradeGroup: values.gradeGroup,
        grade: values.grade,
        subject: values.subject,
        competency: values.competency,
        instruction: values.instruction.trim(),
        questionText: values.questionText.trim(),
        status: values.status,
        imageUrl: values.imageUrl.trim() || undefined,
        options: [
            {
                id: 'A',
                relationKey: values.optionARelationKey.trim(),
                text: values.optionA.trim(),
                isCorrect: values.correctOptionId === 'A',
            },
            {
                id: 'B',
                relationKey: values.optionBRelationKey.trim(),
                text: values.optionB.trim(),
                isCorrect: values.correctOptionId === 'B',
            },
            {
                id: 'C',
                relationKey: values.optionCRelationKey.trim(),
                text: values.optionC.trim(),
                isCorrect: values.correctOptionId === 'C',
            },
            {
                id: 'D',
                relationKey: values.optionDRelationKey.trim(),
                text: values.optionD.trim(),
                isCorrect: values.correctOptionId === 'D',
            },
        ],
        answerExplanation: values.answerExplanation.trim(),
        createdAt: existingQuestion?.createdAt ?? timestamp,
        updatedAt: timestamp,
    };
};

const generateQuestion = (
    payload: GenerateQuestionsPayload,
    competency: string,
    index: number,
): QuestionRecord => {
    const questionTemplates: Record<string, string[]> = {
        Mathematics: [
            'Solve the expression: 18 + 24 = ?',
            'Which number is greater than 56?',
            'What is the missing number in 5, 10, 15, __?',
        ],
        Science: [
            'Which organ helps us breathe?',
            'Which source gives us light during the day?',
            'What do plants need to make food?',
        ],
        English: [
            'Choose the correct spelling of the word.',
            'Identify the verb in the sentence.',
            'Choose the opposite of "small".',
        ],
    };
    const templates = questionTemplates[payload.subject] ?? [
        `Sample ${payload.subject} question for ${competency}.`,
    ];
    const questionText = `<p>${templates[index % templates.length]}</p>`;

    return {
        id: `${Date.now()}-${index}`,
        questionId: buildQuestionId(),
        gradeGroup: payload.gradeGroup,
        grade: payload.grade,
        subject: payload.subject,
        competency,
        instruction: 'Review the generated instruction and update it before publishing.',
        questionText,
        status: 'Draft',
        options: [
            { id: 'A', relationKey: `${competency}_a`, text: 'Option A', isCorrect: true },
            { id: 'B', relationKey: `${competency}_b`, text: 'Option B', isCorrect: false },
            { id: 'C', relationKey: `${competency}_c`, text: 'Option C', isCorrect: false },
            { id: 'D', relationKey: `${competency}_d`, text: 'Option D', isCorrect: false },
        ],
        answerExplanation: 'Review and update this generated question before publishing.',
        createdAt: now(),
        updatedAt: now(),
    };
};

export const getQuestions = async (
    filters: QuestionListFilters,
): Promise<ReturnType<typeof buildApiResult<QuestionListResponse>>> => {
    const searchValue = normalize(filters.search);
    const filteredQuestions = mockQuestions.filter((question) => {
        const matchesSearch = searchValue
            ? normalize(`${question.questionId} ${question.questionText}`).includes(searchValue)
            : true;
        const matchesGrade = filters.grade ? question.grade === filters.grade : true;
        const matchesSubject = filters.subject ? question.subject === filters.subject : true;
        const matchesCompetency = filters.competency
            ? question.competency === filters.competency
            : true;
        const matchesStatus = filters.status ? question.status === filters.status : true;

        return (
            matchesSearch &&
            matchesGrade &&
            matchesSubject &&
            matchesCompetency &&
            matchesStatus
        );
    });

    const startIndex = (filters.page - 1) * filters.limit;
    const response: QuestionListResponse = {
        questions: filteredQuestions.slice(startIndex, startIndex + filters.limit),
        total: filteredQuestions.length,
        page: filters.page,
        limit: filters.limit,
    };

    return buildApiResult(response);
};

export const createQuestion = async (values: QuestionFormValues) => {
    const question = mapFormValuesToQuestion(values);
    mockQuestions = [question, ...mockQuestions];

    return buildApiResult(question, 'Question added successfully');
};

export const updateQuestion = async (questionId: string, values: QuestionFormValues) => {
    const existingQuestion = mockQuestions.find((question) => question.id === questionId);

    if (!existingQuestion) {
        return {
            data: {
                status: false,
                message: 'Question not found',
                response: null as QuestionRecord | null,
            },
            status: 404,
            ok: false,
        };
    }

    const updatedQuestion = mapFormValuesToQuestion(values, existingQuestion);
    mockQuestions = mockQuestions.map((question) =>
        question.id === questionId ? updatedQuestion : question,
    );

    return buildApiResult<QuestionRecord | null>(updatedQuestion, 'Question updated successfully');
};

export const deleteQuestion = async (questionId: string) => {
    mockQuestions = mockQuestions.filter((question) => question.id !== questionId);

    return buildApiResult({ id: questionId }, 'Question deleted successfully');
};

export const generateQuestions = async (payload: GenerateQuestionsPayload) => {
    const competencies = payload.competencyIds.length ? payload.competencyIds : ['General'];
    const generatedQuestions = Array.from({ length: payload.count }).map((_, index) =>
        generateQuestion(payload, competencies[index % competencies.length], index),
    );

    mockQuestions = [...generatedQuestions, ...mockQuestions];

    return buildApiResult(generatedQuestions, 'Questions generated successfully');
};

export const QUESTION_STATUS_OPTIONS: QuestionStatus[] = ['Active', 'Draft', 'Inactive'];
