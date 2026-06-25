export const API_URL = `${process.env.NEXT_PUBLIC_APP_URL}api/v1`;

export const MARKETING_EXECUTIVE = `${API_URL}/marketing-executive`;

export const MARKETING_COUNT_DASHBOARD = `${MARKETING_EXECUTIVE}/dashboard-metrics`;
export const MARKETING_LEAD_DASHBOARD = `${MARKETING_EXECUTIVE}/leads-matrix`;
export const MARKETING_LEAD_TIMELINE = `${MARKETING_EXECUTIVE}/timeline/`;

export const API_ROUTES = {
    adminActionRequired: `${API_URL}/admin/action-required`,
    adminApprove: `${API_URL}/admin/approve`,
    adminAssignSiteVisitor: `${API_URL}/admin/assign-site-visitor`,
    adminDashboard: `${API_URL}/admin/dashboard`,
    adminGlobalCounters: `${API_URL}/admin/global-counters`,
    adminLedgerSummary: `${API_URL}/admin/ledger-summary`,
    adminLeads: `${API_URL}/admin/leads`,
    adminPaymentOverview: `${API_URL}/admin/payment-overview`,
    adminPipelineStages: `${API_URL}/admin/pipeline-stages`,
    adminReject: `${API_URL}/admin/reject`,
    adminSetDealAmount: `${API_URL}/admin/set-deal-amount`,
    adminSiteVisitors: `${API_URL}/admin/site-visitors`,
    adminTeachers: `${API_URL}/teachers`,
    uploadTeachers: `${API_URL}/teachers/upload`,
    dashboardSummary: `${API_URL}/admin/dashboard/summary`,
    teacherDashboard: `${API_URL}/teacher/dashboard`,
    teacherStudents: `${API_URL}/teacher/students`,
    regions: `${API_URL}/regions`,
    schools: (regionId: string) => `${API_URL}/regions/${regionId}/schools`,
    subjects: `${API_URL}/subjects`,
    gradeGroup: `${API_URL}/grade-group`,
    grades: (gradeGroupId: string) => `${API_URL}/grade-group/${gradeGroupId}/grades`,
    login: `${API_URL}/login`,
    addNewLead: `${MARKETING_EXECUTIVE}/leads`,
    marketingCountDashboard: MARKETING_COUNT_DASHBOARD,
    marketingLeadDashboard: MARKETING_LEAD_DASHBOARD,
    marketingLeadTimeLine: MARKETING_LEAD_TIMELINE,
};
