import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions, resetClasses } from "../modal.js";
import { rerenderGpaBeforeAdded, rerenderGpa } from "./gpa.js";
import { rerenderTable } from "./table.js";

export const getButtonCSS = () => `
    .${CC_GPA_INJECTOR}ActionButton {
        float: right;
        user-select: none;
        width: 20%;
    }
    .${CC_GPA_INJECTOR}ActionButton:last-child {
        margin-right: 8px;
    }

    .${CC_GPA_INJECTOR}ButtonRow {
        margin-top: 10px;
    }

`;

export const renderButtons = () => {
    const buttons = createEl("div", [CC_GPA_INJECTOR + "ButtonRow"]);
    const GPAType = createEl("button", [CC_GPA_INJECTOR + "ActionButton"], "", {
        id: CC_GPA_INJECTOR + "GpaTypeButton",
    });
    const hypothetical = createEl(
        "button",
        [CC_GPA_INJECTOR + "ActionButton"],
        "",
        { id: CC_GPA_INJECTOR + "HypotheticalButton" }
    );

    rerenderGPATypeButton(GPAType);
    rerenderHypotheticalButton(hypothetical);

    buttons.append(GPAType, hypothetical);
    return buttons;
};

export const initButtonEventListeners = () => {
    setupEventListeners(
        document.querySelector("#" + CC_GPA_INJECTOR + "GpaTypeButton")!,
        document.querySelector("#" + CC_GPA_INJECTOR + "HypotheticalButton")!
    );
};

function setupEventListeners(
    GPAType: HTMLButtonElement,
    hypothetical: HTMLButtonElement
) {
    GPAType.addEventListener("click", (e) => {
        modalOptions.isUnweighted = !modalOptions.isUnweighted;
        rerenderGPATypeButton(GPAType);
        rerenderGpa();
        rerenderTable();
    });

    hypothetical.addEventListener("click", (e) => {
        modalOptions.isHypothetical = !modalOptions.isHypothetical;
        if (!modalOptions.isHypothetical) {
            resetClasses();
        }
        rerenderHypotheticalButton(hypothetical);
        rerenderGpa();
        rerenderTable();
    });
}

function rerenderGPATypeButton(button: HTMLButtonElement) {
    button.innerHTML = `Show ${
        modalOptions.isUnweighted ? "CC GPA" : "Unweighted"
    }`;
    button.style.backgroundColor = modalOptions.isUnweighted
        ? "#004F9E"
        : "#b7da9b";
    button.style.color = modalOptions.isUnweighted ? "#ffffff" : "#000000";
}

function rerenderHypotheticalButton(button: HTMLButtonElement) {
    button.innerHTML = modalOptions.isHypothetical
        ? "Show Real Grades"
        : "Edit Grades";
    button.style.backgroundColor = modalOptions.isHypothetical
        ? "#004F9E"
        : "#b7da9b";
    button.style.color = modalOptions.isHypothetical ? "#ffffff" : "#000000";
}
