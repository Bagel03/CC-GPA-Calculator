import { getUserId } from "./context.js";


const classCache = {} as Record<string, any>;

export async function fetchClassInfo(classId: string, markingPeriod: string) {
    const shortName = classId + "-" + markingPeriod
    if (classCache[shortName]) {
        return classCache[shortName]
    }
    const url = new URL("https://catholiccentral.myschoolapp.com/api/datadirect/GradeBookPerformanceAssignmentStudentList/");

    url.searchParams.append("sectionId", classId);
    url.searchParams.append("markingPeriodId", markingPeriod);
    url.searchParams.append("studentUserId", await getUserId());
    url.searchParams.append("personaId", "2");

    const result = await fetch(url).then(res => res.json());
    classCache[shortName] = result;

    return result;
}