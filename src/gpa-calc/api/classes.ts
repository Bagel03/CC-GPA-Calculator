import { getCurrentSchoolYear } from "../utils/year.js";
import { cache } from "./cache.js";
import { fetchContext } from "./context.js";
import { fetchDurations } from "./durations.js";

const classesCache = {} as Record<string, any>;

export interface ClassInfo {
    sectionid: number;
    sectionidentifier: string;
    room: null;
    coursedescription: string;
    schoollevel: string;
    groupownername: string;
    OwnerId: number;
    groupowneremail: string;
    groupownerphoto: string;
    currentterm: string;
    assignmentactivetoday: number;
    assignmentduetoday: number;
    assignmentassignedtoday: number;
    OverdueCount: number;
    UpcomingCount: number;
    mostrecentgroupphoto: null;
    AlbumId: null;
    DurationId: number;
    gradebookcumgpa: boolean;
    publishgrouptouser: boolean;
    markingperiodid: number;
    leadsectionid: number;
    cumgrade: string;
    FilePath: null;
    PhotoEditSettings: null;
    AttendanceTaken: boolean;
    canviewassignments: boolean;
}

export const fetchClasses = async function (
    year: string = getCurrentSchoolYear(),
    duration?: number
): Promise<ClassInfo[] & { duration: string }> {
    const name = year + "-" + duration;
    if (classesCache[name]) return classesCache[name];

    const userId = (await fetchContext()).UserInfo.UserId;

    const url = new URL(
        "https://catholiccentral.myschoolapp.com/api/datadirect/ParentStudentUserAcademicGroupsGet"
    );

    url.searchParams.set("userId", userId);
    url.searchParams.set("schoolYearLabel", year);
    url.searchParams.set("memberLevel", "3");
    url.searchParams.set("persona", "2");

    if (!duration) {
        const durations = await fetchDurations(year);
        duration = durations.find(dur => dur.CurrentInd).DurationId;
    }

    url.searchParams.set("durationList", duration.toString());

    const classes = await fetch(url).then(res => res.json());
    classes.duration = duration;

    classesCache[name] = classes;
    return classes;
};
