export interface ReviewerDashboardSummary {
    totalQuestions: number;
    approvedQuestions: number;
    rejectedQuestions: number;
    draftQuestions: number;
    isMock?: boolean;
}
