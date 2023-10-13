import { fetchClasses } from "./classes.js";
import { getUserId } from "./context.js";

const markingPeriodCache = {};

export async function fetchMarkingPeriods(year?: string, duration?: string) {
    const shortName = year + "-" + duration;
    if (markingPeriodCache[shortName]) return markingPeriodCache[shortName];

    //https://catholiccentral.myschoolapp.com/api/gradebook/GradeBookMyDayMarkingPeriods?durationSectionList=%5B%7B%22DurationId%22%3A142681%2C%22LeadSectionList%22%3A%5B%7B%22LeadSectionId%22%3A25396896%7D%2C%7B%22LeadSectionId%22%3A25454266%7D%2C%7B%22LeadSectionId%22%3A25448038%7D%2C%7B%22LeadSectionId%22%3A25452902%7D%2C%7B%22LeadSectionId%22%3A25463367%7D%2C%7B%22LeadSectionId%22%3A25452350%7D%2C%7B%22LeadSectionId%22%3A25748625%7D%2C%7B%22LeadSectionId%22%3A25388304%7D%5D%7D%2C%7B%22DurationId%22%3A142682%2C%22LeadSectionList%22%3A%5B%7B%22LeadSectionId%22%3A25477858%7D%2C%7B%22LeadSectionId%22%3A25388347%7D%2C%7B%22LeadSectionId%22%3A25454262%7D%2C%7B%22LeadSectionId%22%3A25448070%7D%2C%7B%22LeadSectionId%22%3A25452898%7D%2C%7B%22LeadSectionId%22%3A25463373%7D%2C%7B%22LeadSectionId%22%3A25748626%7D%2C%7B%22LeadSectionId%22%3A25753408%7D%5D%7D%5D&userId=6746460&personaId=2

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
