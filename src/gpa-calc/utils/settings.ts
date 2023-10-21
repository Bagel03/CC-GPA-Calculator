import { ClassType } from "../grades/class_type";
import { TOTAL_POINTS, WEIGHTED } from "../pages/progress/classes/weights";

export type GPACalcSettings = {
    classes: Record<
        string,
        {
            sectionInfo: Record<
                number,
                {
                    droppedAssignments: number;
                    weight: number;
                    extraCreditAssignments: number[];
                }
            >;
            gradeFormula: TOTAL_POINTS | WEIGHTED;
            type: number;
        }
    >;
};

let defaultSettings = {
    classes: {},
};

let currentSettings: GPACalcSettings;
export function getSettings(): GPACalcSettings {
    if (!currentSettings && !localStorage.getItem("gpa-calc-settings")) {
        currentSettings = defaultSettings;
        saveSettings();
    }
    if (!currentSettings) currentSettings = JSON.parse(localStorage.getItem("gpa-calc-settings"));

    return currentSettings;
}

export function saveSettings() {
    localStorage.setItem("gpa-calc-settings", JSON.stringify(currentSettings));
}
