import { createEl } from "../../../../utils/elements.js";
import { selectContentEditableElement } from "../../../../utils/select.js";
import { addToolTip } from "../../../../utils/tooltip.js";
import { recalculateGrade } from "./recalc.js";
import { enableResetButton } from "./reset.js";



export function renderNewAssignment(sectionID: string, classID: string) {
    const element = document.getElementById(sectionID);
    const table = element.nextElementSibling;
    const body = table.getElementsByTagName("tbody")[0];

    const row = createEl("tr", ["hypotheticalAssignment"]);

    const scoreContainer = createEl("td", ["col-md-2"], "", { contentEditable: "true", "data-heading": "Points" });
    const score = createEl("h4", [], `100<span class="muted">/100</span>`, {}, { margin: "0px" });
    scoreContainer.append(score)

    row.append(
        createEl("td", ["col-md-3"], "New Assignment"),
        createEl("td", ["col-md-1"], "N/A"),
        createEl("td", ["col-md-1"], "N/A"),
        scoreContainer,
        createEl("td", [], "Hypothetical Assignment"),
    )

    addToolTip(row.children[0] as any, "This is a custom assignment that doesn't actually exist");

    body.append(row);
    selectContentEditableElement(scoreContainer);

    const handler = (ev: KeyboardEvent) => {
        if (ev.key == "Enter") {
            scoreContainer.blur();
        }
    }
    window.addEventListener("keydown", handler)

    scoreContainer.addEventListener("blur", () => {
        window.removeEventListener("keydown", handler)
        let text = scoreContainer.innerText;
        text = text.replaceAll(" ", "");
        if (!text.match(/[0-9]+\/[0-9]+/)) {
            score.innerText = "!!!";
            return;
        }

        const [grade, total] = text.split("/");
        score.innerHTML = `${grade}<span class="muted">/${total}</span>`;

        recalculateGrade(classID);

        // Mark the section and class as dirty
        // TODO: Make this not so fragile
        const el = document.getElementsByTagName("h1")[1] as HTMLElement;
        el.firstChild.textContent += "*";
        // el.setAttribute("data-hover-tooltip", "This grade includes one or more custom assignments");
        // el.setAttribute("data-custom-assignment-dirty", "true");
        // Set the text above the table
        const above = document.getElementById(sectionID).querySelector(".muted") as HTMLDivElement;
        addToolTip(above, "This section contains one or more custom assignments");
        // above.innerHTML = above.innerHTML.replace("%", "*%");
        // above.setAttribute("data-custom-assignment-dirty", "true");
        // above.setAttribute("data-hover-tooltip", "This section contains one or more custom assignments")
    })

    enableResetButton(classID);


    // scoreContainer.onfocusout
}
