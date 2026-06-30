export interface ReviewerDashboardSummary {
    totalQuestions: number;
    approvedQuestions: number;
    rejectedQuestions: number;
    pendingQuestions: number;
    isMock?: boolean;
}
