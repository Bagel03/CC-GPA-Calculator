import { getCurrentSchoolYear } from "../utils/year.js";
import { cache } from "./cache.js";
import { fetchContext } from "./context.js";
import { fetchDurations } from "./durations.js";

const classesCache = {} as Record<string, any>;

export const fetchClasses = async function (year: string = getCurrentSchoolYear(), duration?: string) {
    const name = year + "-" + duration;
    if (classesCache[name]) return classesCache[name]

    const userId = (await fetchContext()).UserInfo.UserId;

    const url = new URL("https://catholiccentral.myschoolapp.com/api/datadirect/ParentStudentUserAcademicGroupsGet");


    url.searchParams.set("userId", userId);
    url.searchParams.set("schoolYearLabel", year);
    url.searchParams.set("memberLevel", "3");
    url.searchParams.set("persona", "2");

    if (!duration) {
        const durations = await fetchDurations(year);
        duration = durations.find(dur => dur.CurrentInd).DurationId;
    }


    url.searchParams.set("durationList", duration);

    const classes = await fetch(url).then(res => res.json());
    classes.duration = duration;

    classesCache[name] = classes;
    return classes;
}