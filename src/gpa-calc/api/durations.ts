import { getCurrentSchoolYear } from "../utils/year.js";
import { fetchContext } from "./context.js";

const cachedDurations: Record<string, any> = {};

export interface DurationInfo {
    OfferingType: number;
    DurationId: number;
    DurationDescription: string;
    CurrentInd: number;
}

export async function fetchDurations(schoolYear: string = getCurrentSchoolYear()): Promise<DurationInfo[]> {
    // https://catholiccentral.myschoolapp.com/api/DataDirect/StudentGroupTermList/?studentUserId=6746460&schoolYearLabel=2021+-+2022&personaId=2

    const userId = (await fetchContext()).UserInfo.UserId;

    if (cachedDurations[schoolYear]) {
        return cachedDurations[schoolYear];
    }

    const url = new URL(" https://catholiccentral.myschoolapp.com/api/DataDirect/StudentGroupTermList/");

    url.searchParams.append("studentUserId", userId);
    url.searchParams.append("personaId", "2");

    url.searchParams.append("schoolYearLabel", schoolYear);

    const durations = await fetch(url).then(res => res.json());

    cachedDurations[schoolYear] = durations;

    return durations.filter(dur => dur.OfferingType == 1);
}
