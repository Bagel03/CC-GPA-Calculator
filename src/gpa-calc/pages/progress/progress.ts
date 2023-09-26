import { fetchClasses } from "../../api/classes.js";
import { fetchClassInfo } from "../../api/class_info.js";
import { fetchMarkingPeriods } from "../../api/marking_period.js";
import { getAverageGPA } from "../../grades/gpa.js";
import { renderToolTip } from "../../utils/tooltip.js";
import { renderBubble } from "./bubble.js";
import { setupObserverToRenderClasses } from "./classes/classes.js";
import { renderGrades } from "./grades.js";
import { renderModal } from "./modal/modal.js";

export async function renderProgress() {
    const classes = await fetchClasses();
    const markingPeriods = await fetchMarkingPeriods();
    renderToolTip();
    setupObserverToRenderClasses();
    renderGrades(classes);
    renderBubble(getAverageGPA(classes));
    // renderModal();
}
