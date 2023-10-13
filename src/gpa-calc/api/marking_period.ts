import { fetchClasses } from "./classes.js";
import { getUserId } from "./context.js";

const markingPeriodCache = {};

export async function fetchMarkingPeriods(year?: string, duration?: string) {
    const shortName = year + "-" + duration;
    if (markingPeriodCache[shortName]) return markingPeriodCache[shortName];

    // durationSectionList [
    //     {
    //         DurationId: 142681,
    //         LeadSectionList: [
    //             { LeadSectionId: 25396896 },
    //             { LeadSectionId: 25454266 },
    //             { LeadSectionId: 25448038 },
    //             { LeadSectionId: 25452902 },
    //             { LeadSectionId: 25463367 },
    //             { LeadSectionId: 25452350 },
    //             { LeadSectionId: 25748625 },
    //             { LeadSectionId: 25388304 },
    //         ],
    //     },
    //     {
    //         DurationId: 142682,
    //         LeadSectionList: [
    //             { LeadSectionId: 25477858 },
    //             { LeadSectionId: 25388347 },
    //             { LeadSectionId: 25454262 },
    //             { LeadSectionId: 25448070 },
    //             { LeadSectionId: 25452898 },
    //             { LeadSectionId: 25463373 },
    //             { LeadSectionId: 25748626 },
    //             { LeadSectionId: 25753408 },
    //         ],
    //     },
    // ];
    const userId = await getUserId();

    const url = new URL("https://catholiccentral.myschoolapp.com/api/gradebook/GradeBookMyDayMarkingPeriods");

    url.searchParams.append("userId", userId.toString());
    url.searchParams.append("personaId", "2");

    const classes = await fetchClasses(year, duration);
    const LeadSectionList = [{
        DurationId: classes.duration,
        LeadSectionList: classes.map(c => ({ LeadSectionId: c.sectionid }))
    }]
    url.searchParams.append("durationSectionList", JSON.stringify(LeadSectionList))

    const result = await fetch(url).then(res => res.json());
    markingPeriodCache[shortName] = result;
    return result;
}


let currentMarkingPeriod;
export async function getCurrentMarkingPeriod(): Promise<string> {
    if (currentMarkingPeriod) return currentMarkingPeriod;

    const result = (await fetchMarkingPeriods()).find(p => p.CurrentMarkingPeriod).MarkingPeriodId
    currentMarkingPeriod = result;
    return result;
}
