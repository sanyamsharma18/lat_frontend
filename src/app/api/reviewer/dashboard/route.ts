import { NextResponse } from 'next/server';

import { ReviewerDashboardSummary } from '@/types/reviewerDashboard';

const MOCK_REVIEWER_DASHBOARD: ReviewerDashboardSummary = {
    totalQuestions: 240,
    approvedQuestions: 164,
    rejectedQuestions: 28,
    pendingQuestions: 48,
    isMock: true,
};

export async function GET() {
    return NextResponse.json({
        status: true,
        statusCode: 200,
        message: 'Success',
        response: MOCK_REVIEWER_DASHBOARD,
    });
}
