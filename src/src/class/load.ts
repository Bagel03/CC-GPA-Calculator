import { startNonRenderLoading } from "../script.js";
import { flip, waitForChangesOnElementUntil } from "../utils.js";
import { constructClassesFromPage, updateClassesFromPage } from "./parse.js";
import { GradeTime } from "./props/time.js";

export const quarters = [GradeTime.FIRST_QUARTER, GradeTime.SECOND_QUARTER];

//  This will actually load the classes
export const loadClasses = async (loadBoth = false) => {
    const { dropDown, buttons } = await loadElements();

    const active = dropDown.getElementsByClassName("active")[0];
    const quarterNum = active.parentNode!.firstChild == active ? 0 : 1;

    const defaultQuarter = quarters[quarterNum];
    const classes = constructClassesFromPage(defaultQuarter);
    if (!loadBoth) {
        return classes;
    }

    // Were gonna start loading something, prevent another useless render
    const p = startNonRenderLoading();
    // Click the other button
    buttons[flip(quarterNum)].click();
    // Wait for the page to load
    await p.await();

    updateClassesFromPage(classes, quarters[flip(quarterNum)]);

    // Go back to the original page (do the same thing)
    startNonRenderLoading();
    (await loadElements()).buttons[quarterNum].click();
    await p.await();

    return classes.sort((a, b) => a.getProp("period") - b.getProp("period"));
};

export const loadElements = async () => {
    let showHideGrade = document.getElementById("showHideGrade")!;
    let dropDown = showHideGrade?.getElementsByClassName("dropdown-menu")[0];
    if (!dropDown) {
        await waitForChangesOnElementUntil(
            showHideGrade,
            (ele) => {
                return ele.getElementsByClassName("dropdown-menu").length > 0;
            },
            { subtree: true, childList: true }
        );
        dropDown = showHideGrade.getElementsByClassName("dropdown-menu")[0];
    }
    const buttons = [
        dropDown.firstElementChild!.firstElementChild as HTMLButtonElement,
        dropDown.lastElementChild!.firstElementChild as HTMLButtonElement,
    ];
    return { dropDown, buttons };
};

export const getDefaultQuarter = () => {
    const showHideGrade = document.getElementById("showHideGrade")!;
    const dropDown = showHideGrade.getElementsByClassName("dropdown-menu")[0];
    const active = dropDown.getElementsByClassName("active")[0];
    const quarterNum = active.nextElementSibling ? 0 : 1;
    return quarters[quarterNum];
};
