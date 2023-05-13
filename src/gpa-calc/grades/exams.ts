export function getOverallGrade(q1: number, q2: number, exam: number) {
    return 0.4 * q1 + 0.4 * q2 + 0.2 * exam;
}

export function getExamGradeForOverall(
    overall: number,
    q1: number,
    q2: number
) {
    const totalQuarter = q1 * 0.4 + q2 * 0.4;
    return (overall - totalQuarter) / 0.2;
}

export const GradePeriod = {
    Q1: "0",
    Q2: "1",
    EXAM: "3",
    OVERALL: "4",
} as const;
export type GradePeriod = (typeof GradePeriod)[keyof typeof GradePeriod];

export function getNiceNameForGradePeriod(
    period: GradePeriod,
    semester: 0 | 1 = getCurrentSemester()
) {
    switch (period) {
        case GradePeriod.EXAM:
            return "Exam";
        case GradePeriod.OVERALL:
            return "Overall";
        case GradePeriod.Q1:
            return `${semester * 2 + 1}<sup>${
                semester === 0 ? "st" : "nd"
            }</sup> Quarter`;
        case GradePeriod.Q2:
            return `${semester * 2 + 2}<sup>${
                semester === 0 ? "nd" : "th"
            }</sup> Quarter`;
    }
}

export function getCurrentSemester(): 0 | 1 {
    return new Date().getMonth() < 6 ? 1 : 0;
}
