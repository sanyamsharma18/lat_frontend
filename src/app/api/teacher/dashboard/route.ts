import { NextResponse } from 'next/server';

import { TeacherDashboardSummary } from '@/types/student';

const MOCK_TEACHER_DASHBOARD: TeacherDashboardSummary = {
    totalStudents: 120,
    activeStudents: 95,
    inactiveStudents: 25,
    totalQuestionsAttempted: 4580,
    isMock: true,
};

export async function GET() {
    return NextResponse.json(MOCK_TEACHER_DASHBOARD);
}
