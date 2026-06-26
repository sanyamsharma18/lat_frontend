import type { Metadata } from 'next';

import { StudentDashboardPage } from '@/features/studentPortal';
import {
    getStudentProfile,
    getExamInstructions,
    checkStudentExamStatus,
} from '@/services/studentPortal/studentPortal.service';

export const metadata: Metadata = {
    title: 'Student Dashboard | Lat Portal',
};

const Page = async () => {
    const profileResult = await getStudentProfile();
    const profile = profileResult.data;

    const instructionsResult = await getExamInstructions();
    const instructions = instructionsResult.data;

    let examStatus = undefined;
    if (profile?.id) {
        const numericStudentId = Number(profile.id);
        if (Number.isFinite(numericStudentId) && numericStudentId > 0) {
            try {
                const statusResult = await checkStudentExamStatus({
                    studentId: numericStudentId,
                    termId: 1,
                    subjectId: 1,
                });
                examStatus = statusResult.data;
            } catch {
                examStatus = undefined;
            }
        }
    }

    return (
        <StudentDashboardPage
            initialProfile={profile}
            initialInstructions={instructions}
            initialExamStatus={examStatus}
        />
    );
};

export default Page;
