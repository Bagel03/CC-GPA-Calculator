import { createEl } from "../../../../utils/elements.js";
import { renderNewAssignment } from "./new_assignment.js";

export function renderLinks(classId: string) {
    console.log("rendered")
    // Array.from().forEach()
    const els = document.getElementsByClassName("back-to-top");
    console.log(els, document.getElementById("site-modal").querySelectorAll("table").length)
    // <div class="pull-right back-to-top cursor-pointer ws-nw"><h6>Back to top <i class="icon-arrow-up"></i></h6></div>
    for (let i = els.length - 1; i > -1; i--) {
        const el = els[i];
        const newDiv = createEl("div", ["pull-right", "cursor-pointer", "ws-nw"], `<h6>+ Add Assignment</h6>`)
        el.replaceWith(newDiv)
        // el.children[0].innerHTML = "➕ Add Assignment";
        // el.classList.remove("back-to-top");
        console.log("placed", el)
        newDiv.addEventListener("click", () => {
            renderNewAssignment(newDiv.parentElement.id, classId);
        })
    }
    // for (const el of els) {
    //     el.classList.remove("back-to-top")
    // }
}