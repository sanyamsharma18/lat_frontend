import { useQuery } from '@tanstack/react-query';
import { checkStudentExam } from '../components/StudentDashboardPage/studentExam';


interface Props {
    studentId: number;
    termId: number;
    subjectId: number;
}

export const useCheckStudentExam = ({
    studentId,
    termId,
    subjectId,
}: Props) => useQuery({
        queryKey: ['student-exam-check', studentId, termId, subjectId],
        queryFn: () =>
            checkStudentExam({
                studentId,
                termId,
                subjectId,
            }),
        enabled: !!studentId && !!termId && !!subjectId,
        retry: 1,
    });