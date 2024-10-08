import { getUserId } from "./context.js";

const classCache = {} as Record<string, any>;

export interface assignmentInfo {
    AssignmentTypeId: number;
    AssignmentType: string;
    Percentage: string;
    Weight: null | number;
    AssignmentId: number;
    Assignment: string;
    AssignmentShortDescription: string;
    DateAssignedTicks: number;
    DateAssigned: string;
    DateDueTicks: number;
    DateDue: string;
    ScaleId: null;
    Points: string;
    Letter: null;
    MaxPoints: number;
    AdditionalInfo: string;
    SectionGrade: string;
    ExemptTotal: number;
    IncompleteTotal: number;
    LateTotal: number;
    MissingTotal: number;
    AssignmentPercentage: number;
    SectionGradeYear: null;
    RubricId: null;
    ShowRubric: null;
    AssignmentIndexId: number;
    FormativeInd: boolean;
}

export async function fetchAssignments(classId: string, markingPeriod: number): Promise<assignmentInfo[]> {
    const shortName = classId + "-" + markingPeriod;
    if (classCache[shortName]) {
        return classCache[shortName];
    }
    // https://catholiccentral.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/?sectionId=25477858&markingPeriodId=13370&studentUserId=6746460&personaId=2
    const url = new URL(
        "https://catholiccentral.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/"
    );

    url.searchParams.append("sectionId", classId);
    url.searchParams.append("markingPeriodId", markingPeriod.toString());
    url.searchParams.append("studentUserId", await getUserId());
    url.searchParams.append("personaId", "2");

    const result = await fetch(url).then(res => res.json());
    classCache[shortName] = result;

    return result;
}

export async function fetchAssignmentsBySection(
    classId: string,
    markingPeriod: number
): Promise<Map<number, assignmentInfo[]>> {
    const assignments = await fetchAssignments(classId, markingPeriod);
    const map = new Map<number, assignmentInfo[]>();

    assignments.forEach(assignment => {
        if (!map.has(assignment.AssignmentTypeId)) {
            map.set(assignment.AssignmentTypeId, []);
        }

        map.get(assignment.AssignmentTypeId)!.push(assignment);
    });

    return map;
}
