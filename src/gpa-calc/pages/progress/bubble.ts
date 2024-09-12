import { createEl } from "../../utils/elements.js";
import { openModal, renderModal } from "./modal/modal.js";

export function renderBubble(gpa: number) {
    // Renders the quarter and semester gpa
    const parent = document
        .getElementById("performanceCollapse")!
        .getElementsByTagName("div")[0];

    const link = createEl(
        "a",
        ["accordion-toggle"],
        "",
        {
            id: "gpaLink",
        },
        {
            color: "#007ca6",
        }
    );

    const bubble = createEl(
        "span",
        ["label", "label-success"],
        "",
        {
            id: "gpaBubble",
        },
        {
            backgroundColor: "#004F9E",
        }
    );

    parent.append(bubble, link, createEl("br"), createEl("hr"));


    const isNaN = Number.isNaN(gpa);
    const linkTitle = isNaN ? "No Grades" : "CC GPA";
    const bubbleTitle = isNaN ? "N/A" : gpa.toFixed(3);

    link!.innerHTML = linkTitle;
    bubble!.innerHTML = bubbleTitle;

    link.onclick = () => {
        renderModal();
        openModal();
    }
}