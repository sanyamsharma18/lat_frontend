import { ServerSideRoutes } from '@/constants/serverSideRoutes';
import callApi from '@/lib/clientApi';

import { ApiResponse } from '@/types/api';
import { StudentExamCheckPayload, StudentExamCheckResponse } from '@/types/studentPortal';

export const checkStudentExam = (payload: StudentExamCheckPayload) =>
    callApi<ApiResponse<StudentExamCheckResponse>>({
        url: ServerSideRoutes.STUDENT_EXAM_CHECK,
        method: 'POST',
        body: payload,
    });
