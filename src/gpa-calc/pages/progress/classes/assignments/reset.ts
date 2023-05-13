import { createEl } from "../../../../utils/elements.js";
import { recalculateGrade } from "./recalc.js";

export function renderResetButton() {
    const footer = document.getElementsByClassName("modal-footer")[0];
    const closer = createEl(
        "button",
        ["btn", "btn-default", "disabled"],
        "Show Real Grades",
        { id: "resetGradesBtn" }
    );
    footer.insertBefore(closer, footer.children[2]);
}

export function enableResetButton(classId: string) {
    const button = document.getElementById(
        "resetGradesBtn"
    ) as HTMLButtonElement;
    if (!button.classList.contains("disabled")) return;

    button.classList.remove("disabled");

    button.addEventListener("click", () => {
        const els = document.querySelectorAll<HTMLDivElement>(
            ".hypotheticalAssignment"
        );
        els.forEach((el) => el.remove());

        recalculateGrade(classId);
        document
            .querySelectorAll(`[data-custom-assignment-dirty="true"]`)
            .forEach((el) => {
                el.removeAttribute("data-custom-assignment-dirty");
                el.removeAttribute("data-hover-tooltip");
            });
    });
}
