import { fetchClasses } from "../../api/classes.js";
import { fetchAssignments } from "../../api/assignments.js";
import { fetchMarkingPeriods } from "../../api/marking_period.js";
import { renderToolTip } from "../../utils/tooltip.js";
import { renderBubble } from "./bubble.js";
import { setupObserverToRenderClasses } from "./classes/classes.js";
import { renderGrades } from "./grades.js";
import { renderModal } from "./modal/modal.js";
import { GpaFormula } from "../../grades/gpa.js";

export async function renderProgressPage() {
    console.log("Rendering progress page");
    const classes = await fetchClasses();
    const markingPeriods = await fetchMarkingPeriods();
    renderToolTip();
    setupObserverToRenderClasses();
    renderGrades(classes);
    renderBubble(GpaFormula.CC.getAverageGPAFromRawData(classes));
    // renderModal();
}
