import { createEl } from "../../../../utils/elements.js";
import { getClassSettingsBody, renderClassSettings } from "../settings.js";
import { renderNewAssignment } from "./new_assignment.js";
import { fetchClassInfo } from "../../../../api/class_info.js";
import { getCurrentMarkingPeriod } from "../../../../api/marking_period.js";

// Renders the "+ Add assignment links"  and the "change settings"
export async function renderLinks(classId: string) {
    // Array.from().forEach()
    const els = document.getElementsByClassName("back-to-top");


    // Make sure all the elements are already loaded
    // If not, throw an erorr which will reset all the rest of the elements 
    const classData = await fetchClassInfo(
        classId,
        await getCurrentMarkingPeriod()
    );
    
    const sections = new Set(
    classData.map(({AssignmentTypeId}) => AssignmentTypeId)
    );
    const numSections = sections.size;
    
    if(els.length < numSections) throw new Error("Not all sections loaded")

    // <div class="pull-right back-to-top cursor-pointer ws-nw"><h6>Back to top <i class="icon-arrow-up"></i></h6></div>
    for (let i = els.length - 1; i > -1; i--) {
        const el = els[i];
        const newDiv = createEl(
            "div",
            ["pull-right", "cursor-pointer", "ws-nw"],
            `<h6>+ Add Assignment</h6>`
        );
        el.hidden = true;
        el.insertAdjacentElement("beforebegin", newDiv);
        // el.replaceWith(newDiv);
        // el.children[0].innerHTML = "➕ Add Assignment";
        // el.classList.remove("back-to-top");
        newDiv.addEventListener("click", () => {
            renderNewAssignment(newDiv.parentElement.id, classId);
        });
    }

    const body = document.querySelector(".modal-body");
    const openSettings = createEl(
        "div",
        ["cursor-pointer", "ws-nw", "text-align"],
        "<a>Class GPA Settings...</a>",
        {},
        { textAlign: "center" }
    );

    body.appendChild(openSettings);

    openSettings.addEventListener("click", async () => {
        await renderClassSettings(classId);
    });
}
