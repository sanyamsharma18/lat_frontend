import {
    ExamInstructionsResponse,
    ExamQuestionsResponse,
    SaveAnswerPayload,
    StudentExamCheckPayload,
    StudentExamCheckResponse,
    StudentProfile,
    SubmitExamPayload,
} from '@/types/studentPortal';
import { ApiResponse } from '@/types/api';
import { API_ROUTES } from '@/config/apiRoutes';
import { HTTP_METHOD } from '@/types/common';
import { serverApi } from '@/lib/serverApi';

const MOCK_STUDENT_PROFILE: StudentProfile = {
    id: 'student-001',
    fullName: 'John Doe',
    username: 'john.doe',
    grade: 'Grade 8',
    section: 'A',
    rollNumber: 'LAT-8A-001',
};

const MOCK_EXAM_INSTRUCTIONS: ExamInstructionsResponse = {
    title: 'Examination Instructions',
    instructions: [
        { id: 'read-carefully', label: 'Read all questions carefully.' },
        { id: 'no-refresh', label: 'Do not refresh the browser.' },
        { id: 'no-tab-switch', label: 'Do not switch tabs during the exam.' },
        { id: 'stable-internet', label: 'Ensure stable internet connection.' },
        { id: 'final-submit', label: 'Once submitted, answers cannot be modified.' },
        { id: 'timer-running', label: 'Examination timer will continue running.' },
        {
            id: 'suspicious-activity',
            label: 'Any suspicious activity may result in auto submission.',
        },
    ],
};

const MOCK_EXAM_QUESTIONS: ExamQuestionsResponse = {
    examId: 1,
    title: 'Semi-Annual Assessment',
    duration: 60,
    totalQuestions: 45,
    questions: [
        {
            id: 1,
            question: 'Which shape should be placed on top to build a stable tower?',
            type: 'image-option',
            options: [
                {
                    id: 'cone',
                    label: 'Cone',
                    imageUrl: '/images/shapes/cone.png',
                    isCorrect: true,
                },
                {
                    id: 'cube',
                    label: 'Cube',
                    imageUrl: '/images/shapes/cube.png',
                    isCorrect: false,
                },
                {
                    id: 'sphere',
                    label: 'Sphere',
                    imageUrl: '/images/shapes/sphere.png',
                    isCorrect: false,
                },
                {
                    id: 'rectangle',
                    label: 'Rectangle',
                    imageUrl: '/images/shapes/rectangle.png',
                    isCorrect: false,
                },
            ],
        },
        {
            id: 2,
            question: 'Which activity helps keep your body healthy?',
            options: [
                'Playing outside',
                'Watching TV all day',
                'Eating only candy',
                'Sleeping all day',
            ],
            correctAnswer: 'Playing outside',
        },
        {
            id: 3,
            question: 'Choose the correct sentence.',
            options: ['He are playing.', 'He is playing.', 'He am playing.', 'He playing.'],
            correctAnswer: 'He is playing.',
        },
        {
            id: 4,
            question:
                'A shopkeeper has 20 balloons. He sells 5 balloons. How many balloons remain?',
            options: ['10', '15', '20', '25'],
            correctAnswer: '15',
        },
        {
            id: 5,
            question: 'Which part of a plant absorbs water from the soil?',
            options: ['Leaf', 'Flower', 'Root', 'Fruit'],
            correctAnswer: 'Root',
        },
        {
            id: 6,
            question: 'Which word rhymes with "cat"?',
            options: ['Hat', 'Car', 'Sun', 'Pen'],
            correctAnswer: 'Hat',
        },
        {
            id: 7,
            question: 'If today is Monday, what day comes after Tuesday?',
            options: ['Sunday', 'Wednesday', 'Thursday', 'Friday'],
            correctAnswer: 'Wednesday',
        },
        {
            id: 8,
            question: 'Why do we drink water?',
            options: ['To stay hydrated', 'To make noise', 'To sleep faster', 'To grow flowers'],
            correctAnswer: 'To stay hydrated',
        },
        {
            id: 9,
            question: 'Which number is greater?',
            options: ['24', '42', '14', '22'],
            correctAnswer: '42',
        },
        {
            id: 10,
            question: 'What should you do before eating food?',
            options: ['Wash hands', 'Watch TV', 'Run outside', 'Sleep'],
            correctAnswer: 'Wash hands',
        },
        {
            id: 11,
            question: 'Choose the naming word (noun).',
            options: ['Run', 'Beautiful', 'School', 'Quickly'],
            correctAnswer: 'School',
        },
        {
            id: 12,
            question: 'A bus has 18 passengers. 6 passengers get down. How many are left?',
            options: ['10', '12', '14', '16'],
            correctAnswer: '12',
        },
        {
            id: 13,
            question: 'Which animal gives us milk?',
            options: ['Cow', 'Tiger', 'Lion', 'Elephant'],
            correctAnswer: 'Cow',
        },
        {
            id: 14,
            question: 'What is half of 10?',
            options: ['2', '4', '5', '6'],
            correctAnswer: '5',
        },
        {
            id: 15,
            question: 'Which sentence ends with a question mark?',
            options: [
                'Where are you going?',
                'I am going home.',
                'What a beautiful day!',
                'Please sit down.',
            ],
            correctAnswer: 'Where are you going?',
        },
        {
            id: 16,
            question: 'Which object is used to tell time?',
            options: ['Clock', 'Chair', 'Book', 'Bottle'],
            correctAnswer: 'Clock',
        },
        {
            id: 17,
            question:
                'Ravi bought 3 pencils and then bought 2 more. How many pencils does he have?',
            options: ['4', '5', '6', '7'],
            correctAnswer: '5',
        },
        {
            id: 18,
            question: 'Which season is usually the coldest?',
            options: ['Summer', 'Winter', 'Rainy', 'Spring'],
            correctAnswer: 'Winter',
        },
        {
            id: 19,
            question: 'Choose the opposite of "big".',
            options: ['Tall', 'Small', 'Fast', 'Wide'],
            correctAnswer: 'Small',
        },
        {
            id: 20,
            question: 'How many sides does a triangle have?',
            options: ['2', '3', '4', '5'],
            correctAnswer: '3',
        },
        {
            id: 21,
            question: 'Which place do you go to borrow books?',
            options: ['Library', 'Hospital', 'Bank', 'Market'],
            correctAnswer: 'Library',
        },
        {
            id: 22,
            question: 'What is 9 + 7?',
            options: ['14', '15', '16', '17'],
            correctAnswer: '16',
        },
        {
            id: 23,
            question: 'Which bird cannot fly?',
            options: ['Sparrow', 'Crow', 'Penguin', 'Parrot'],
            correctAnswer: 'Penguin',
        },
        {
            id: 24,
            question: 'Choose the correct spelling.',
            options: ['Frend', 'Friend', 'Freind', 'Frind'],
            correctAnswer: 'Friend',
        },
        {
            id: 25,
            question: 'What comes next? 2, 4, 6, 8, __',
            options: ['9', '10', '11', '12'],
            correctAnswer: '10',
        },
        {
            id: 26,
            question: 'Why do we use traffic lights?',
            options: ['To control traffic', 'To decorate roads', 'To play games', 'To sell food'],
            correctAnswer: 'To control traffic',
        },
        {
            id: 27,
            question: 'Choose the action word (verb).',
            options: ['Jump', 'Table', 'Blue', 'Happy'],
            correctAnswer: 'Jump',
        },
        {
            id: 28,
            question: 'If a chocolate costs ₹5, how much do 4 chocolates cost?',
            options: ['₹15', '₹20', '₹25', '₹30'],
            correctAnswer: '₹20',
        },
        {
            id: 29,
            question: 'Which planet do we live on?',
            options: ['Mars', 'Jupiter', 'Earth', 'Venus'],
            correctAnswer: 'Earth',
        },
        {
            id: 30,
            question: 'Choose the correct word: The sun is very __.',
            options: ['Hot', 'Cold', 'Wet', 'Soft'],
            correctAnswer: 'Hot',
        },
        {
            id: 31,
            question: 'How many months are there in a year?',
            options: ['10', '11', '12', '13'],
            correctAnswer: '12',
        },
        {
            id: 32,
            question: 'Which source gives us light during the day?',
            options: ['Moon', 'Sun', 'Lamp', 'Torch'],
            correctAnswer: 'Sun',
        },
        {
            id: 33,
            question: 'What is 15 - 8?',
            options: ['5', '6', '7', '8'],
            correctAnswer: '7',
        },
        {
            id: 34,
            question: 'Where do fish live?',
            options: ['Tree', 'Water', 'Nest', 'Cave'],
            correctAnswer: 'Water',
        },
        {
            id: 35,
            question: 'Choose the correct plural form of "book".',
            options: ['Books', 'Bookes', 'Bookies', 'Book'],
            correctAnswer: 'Books',
        },
        {
            id: 36,
            question: 'A rectangle has how many corners?',
            options: ['2', '3', '4', '5'],
            correctAnswer: '4',
        },
        {
            id: 37,
            question: 'What should you do if you see litter on the ground?',
            options: ['Throw more litter', 'Ignore it', 'Put it in a dustbin', 'Kick it away'],
            correctAnswer: 'Put it in a dustbin',
        },
        {
            id: 38,
            question: 'Which word describes a colour?',
            options: ['Run', 'Blue', 'Sing', 'Chair'],
            correctAnswer: 'Blue',
        },
        {
            id: 39,
            question: 'How many tens are there in 50?',
            options: ['3', '4', '5', '6'],
            correctAnswer: '5',
        },
        {
            id: 40,
            question: 'Which animal is known as the king of the jungle?',
            options: ['Tiger', 'Lion', 'Bear', 'Wolf'],
            correctAnswer: 'Lion',
        },
        {
            id: 41,
            question: 'Choose the correct sentence.',
            options: ['She are reading.', 'She is reading.', 'She am reading.', 'She reading.'],
            correctAnswer: 'She is reading.',
        },
        {
            id: 42,
            question: 'What is the value of 3 × 4?',
            options: ['7', '10', '12', '14'],
            correctAnswer: '12',
        },
        {
            id: 43,
            question: 'Which festival is known as the festival of lights?',
            options: ['Holi', 'Diwali', 'Eid', 'Christmas'],
            correctAnswer: 'Diwali',
        },
        {
            id: 44,
            question: 'Which object floats on water?',
            options: ['Stone', 'Iron nail', 'Wood', 'Brick'],
            correctAnswer: 'Wood',
        },
        {
            id: 45,
            question: 'You have finished your homework. What should you do next?',
            options: ['Check your work', 'Throw it away', 'Tear the pages', 'Hide the notebook'],
            correctAnswer: 'Check your work',
        },
    ],
};

const buildMockResult = <TData>(data: TData, message = 'Success') => ({
    data: {
        status: true,
        message,
        response: data,
    },
    status: 200,
    ok: true,
});

export const studentLogin = async () =>
    buildMockResult({
        accessToken: 'mock-student-token',
        user: {
            ...MOCK_STUDENT_PROFILE,
            roleName: 'Student',
        },
    });

export const getStudentProfile = async () => buildMockResult(MOCK_STUDENT_PROFILE);

export const getExamInstructions = async () => buildMockResult(MOCK_EXAM_INSTRUCTIONS);

export const checkStudentExamStatus = async (payload: StudentExamCheckPayload, bearerToken: string) =>
    serverApi<ApiResponse<StudentExamCheckResponse>>({
        url: API_ROUTES.studentExamCheck,
        method: HTTP_METHOD.POST,
        body: payload,
        bearerToken,
    });

export const getExamQuestions = async () => buildMockResult(MOCK_EXAM_QUESTIONS);

export const saveExamAnswer = async (payload: SaveAnswerPayload) =>
    buildMockResult(payload, 'Answer saved successfully');

export const submitExam = async (payload: SubmitExamPayload) =>
    buildMockResult(
        {
            examId: payload.examId,
            submittedAnswers: Object.keys(payload.answers).length,
            submittedAt: new Date().toISOString(),
        },
        'Examination submitted successfully',
    );
