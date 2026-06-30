import { NextRequest, NextResponse } from 'next/server';

import { ReviewerQuestion } from '@/types/reviewerQuestion';

const MOCK_QUESTIONS: ReviewerQuestion[] = [
    {
        id: '43',
        questionId: '43',
        gradeGroup: 'Middle',
        grade: 'Grade 6',
        subject: 'Social Science',
        term: 'Term 1',
        competency: 'Geographic interpretation.',
        instruction: '<p>Read the scenario and answer carefully.</p>',
        stimulus:
            '<p>A coastal region is facing repeated flooding, soil erosion, and damage to houses near the shoreline.</p>',
        questionText:
            'Which of the following geographical concepts best describes the primary environmental challenge faced by the coastal region in the given scenario?',
        status: 'Draft',
        imageUrl: null,
        options: [
            { id: 'A', label: 'A', text: 'Deforestation in hilly areas.' },
            { id: 'B', label: 'B', text: 'Coastal erosion caused by sea waves.' },
            { id: 'C', label: 'C', text: 'Urban heat island effect.' },
        ],
    },
    {
        id: '42',
        questionId: '42',
        gradeGroup: 'Middle',
        grade: 'Grade 6',
        subject: 'Social Science',
        term: 'Term 1',
        competency: 'Historical analysis.',
        instruction: '<p>Read the historical account and choose the best answer.</p>',
        stimulus:
            '<p>During British rule, many traditional Indian industries faced competition from machine-made imported goods.</p>',
        questionText:
            'Based on the provided historical account, what was a primary consequence of British economic policies on traditional Indian industries during the 19th century?',
        status: 'Draft',
        imageUrl: null,
        options: [
            { id: 'A', label: 'A', text: 'Traditional industries expanded quickly.' },
            { id: 'B', label: 'B', text: 'Many artisans lost their livelihoods.' },
            { id: 'C', label: 'C', text: 'Imports from Britain stopped completely.' },
        ],
    },
    {
        id: '41',
        questionId: '41',
        gradeGroup: 'Secondary',
        grade: 'Grade 9',
        subject: 'Environmental Education',
        term: 'Term 2',
        competency: 'Sustainable decision-making.',
        instruction: '<p>Consider the principles of sustainable development.</p>',
        stimulus:
            '<p>Veridian Cove town council needs a long-term water management plan for a growing population.</p>',
        questionText:
            'Considering the principles of sustainable development, which of the following approaches should the Veridian Cove town council prioritize for its long-term water management plan?',
        status: 'Draft',
        imageUrl: null,
        options: [
            { id: 'A', label: 'A', text: 'Use groundwater without monitoring usage.' },
            { id: 'B', label: 'B', text: 'Build rainwater harvesting and reuse systems.' },
            { id: 'C', label: 'C', text: 'Ignore household water consumption.' },
        ],
    },
    {
        id: '40',
        questionId: '40',
        gradeGroup: 'Secondary',
        grade: 'Grade 9',
        subject: 'Environmental Education',
        term: 'Term 2',
        competency: 'Sustainable decision-making.',
        instruction: '<p>Review the city proposal and answer.</p>',
        stimulus:
            '<p>Greenville City Council is comparing policies to reduce waste and improve resource use.</p>',
        questionText:
            'Considering the principles of sustainable decision-making, which proposal should the Greenville City Council prioritize to reduce waste over time?',
        status: 'Approved',
        imageUrl: null,
        options: [
            { id: 'A', label: 'A', text: 'Promote recycling and composting programs.' },
            { id: 'B', label: 'B', text: 'Increase single-use plastic distribution.' },
            { id: 'C', label: 'C', text: 'Close all public awareness campaigns.' },
        ],
    },
];

const normalize = (value: string) => value.trim().toLowerCase();

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page') || 1);
    const limit = Number(searchParams.get('limit') || 10);
    const search = normalize(searchParams.get('search') || '');
    const gradeGroup = searchParams.get('gradeGroup') || '';
    const grade = searchParams.get('grade') || '';
    const subject = searchParams.get('subject') || '';
    const term = searchParams.get('term') || '';
    const competency = searchParams.get('competency') || '';
    const status = searchParams.get('status') || '';

    const filteredQuestions = MOCK_QUESTIONS.filter((question) => {
        const matchesSearch =
            !search ||
            normalize(question.questionId).includes(search) ||
            normalize(question.questionText).includes(search);
        const matchesGradeGroup = !gradeGroup || question.gradeGroup === gradeGroup;
        const matchesGrade = !grade || question.grade === grade;
        const matchesSubject = !subject || question.subject === subject;
        const matchesTerm = !term || question.term === term;
        const matchesCompetency = !competency || question.competency === competency;
        const matchesStatus = !status || question.status === status;

        return (
            matchesSearch &&
            matchesGradeGroup &&
            matchesGrade &&
            matchesSubject &&
            matchesTerm &&
            matchesCompetency &&
            matchesStatus
        );
    });

    const startIndex = (page - 1) * limit;

    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'Success',
        response: {
            data: filteredQuestions.slice(startIndex, startIndex + limit),
            total: filteredQuestions.length,
            page,
            limit,
        },
    });
}
