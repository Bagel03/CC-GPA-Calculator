export function getOverallGrade(q1: number, q2: number, exam: number) {
    return 0.4 * q1 + 0.4 * q2 + 0.2 * exam;
}

export function getExamGradeForOverall(overall: number, q1: number, q2: number) {
    const totalQuarter = q1 * 0.4 + q2 * 0.4
    return (overall - totalQuarter) / 0.2
}

export const GradePeriod = {
    Q1: "0",
    Q2: "1",
    EXAM: "3",
    OVERALL: "4"
} as const;
export type GradePeriod = keyof typeof GradePeriod;