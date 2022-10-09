import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";
import { rerenderGPA } from "./gpa.js";
import { rerenderTable } from "./table.js";

export const getButtonCSS = () => `
    .${CC_GPA_INJECTOR}ActionButton {
        float: right;
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
    const semester = createEl("button", [CC_GPA_INJECTOR + "ActionButton"]);
    const calcMin = createEl("button", [CC_GPA_INJECTOR + "ActionButton"]);

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
    const table = document.querySelector(
        "#" + CC_GPA_INJECTOR + "Table"
    )! as HTMLTableElement;
    const gpa = document.querySelector(
        "#" + CC_GPA_INJECTOR + "ModalGpa"
    )! as HTMLHeadingElement;
    const gpaNum = document.querySelector(
        "#" + CC_GPA_INJECTOR + "ModalGpaNum"
    )! as HTMLSpanElement;

    console.log(gpa);
    GPAType.addEventListener("click", (e) => {
        modalOptions.isUnweighted = !modalOptions.isUnweighted;
        rerenderGPATypeButton(GPAType);
        rerenderGPA(gpa, gpaNum);
        rerenderTable(table);
    });

    hypothetical.addEventListener("click", (e) => {
        modalOptions.isHypothetical = !modalOptions.isHypothetical;
        rerenderHypotheticalButton(hypothetical);
        rerenderGPA(gpa, gpaNum);
        rerenderTable(table);
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
        : "Enter Hypothetical Grades";
    button.style.backgroundColor = modalOptions.isHypothetical
        ? "#004F9E"
        : "#b7da9b";
    button.style.color = modalOptions.isHypothetical ? "#ffffff" : "#000000";
}
