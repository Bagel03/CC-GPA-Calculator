import { GradeTime } from "../../class/props/time.js";
import { createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";
import { rerenderGpa } from "./gpa.js";
import { rerenderTable } from "./table.js";

export const getSelectorCss = () => ``;

export const renderTimeSelector = () => {
    const selector = createEl("select", ["input-sm"]);
    const options = [
        createEl("option", [], "1st Quarter", {
            value: GradeTime.FIRST_QUARTER.toString(),
        }),
        createEl("option", [], "2nd Quarter", {
            value: GradeTime.SECOND_QUARTER.toString(),
        }),
        createEl("option", [], "Overall", {
            value: GradeTime.OVERALL.toString(),
        }),
    ];

    selector.append(...options);
    selector.value = modalOptions.currentView.toString();

    selector.onchange = () => {
        modalOptions.currentView = parseInt(selector.value);
        rerenderTable();
        rerenderGpa();
    };
    return selector;
};
