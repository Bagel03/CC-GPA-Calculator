import { Class } from "../class.js";
import { CC_GPA_INJECTOR, createEl } from "../renderer.js";

export const renderTableAndGPA = (
    classes: Class[],
    isEditable: boolean,
    unweighted: boolean
) => {
    const GPA = unweighted
        ? Class.totalRawGPA(classes)
        : Class.totalGPA(classes);
    const unweightedGPAString = `${unweighted ? "Unweighted" : "CC"} GPA`;

    const gpaEl = createEl(
        "h1",
        [],
        `${isEditable ? "Hypothetical " : ""}${unweightedGPAString}: `,
        { id: "gpa" }
    );
    const gpaNumEl = createEl(
        "span",
        [],
        GPA.toFixed(3),
        {},
        { color: unweighted ? "#b7da9b" : "#004F9E" }
    );
    gpaEl.append(gpaNumEl);

    const table = createEl("table", [
        "table",
        "table-striped",
        "table-condensed",
        "table-mobile-stacked",
    ]);
    const title = createEl("tr");
    title.append(
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Period"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Class"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Type"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Percent"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Grade"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], unweightedGPAString)
    );
    table.append(title);

    const createEditableTD = (text: string) => {
        const i = createEl(
            "input",
            [CC_GPA_INJECTOR + "Input"],
            "",
            { type: "text" },
            { outline: "none" }
        );
        i.value = text;
        if (!isEditable) i.readOnly = true;

        const td = createEl("td");
        td.append(i);
        return td;
    };

    for (const classInfo of classes) {
        const row = createEl("tr");

        row.append(
            createEl("td", [], classInfo.period + "."),
            createEl("td", [], classInfo.name),
            createEditableTD(classInfo.type),
            createEditableTD(classInfo.grade.percent.toFixed(2)),
            createEditableTD(classInfo.grade.toString()),
            createEditableTD(
                (unweighted
                    ? classInfo.grade.rawGPA()
                    : classInfo.gpa()
                ).toFixed(2)
            )
        );
        table.append(row);
    }

    return { gpaEl, table };
};

let modalIsEditable = false;
let unweighted = false;

// Renders the modal
export const renderModal = (classes: Class[]) => {
    const styles = `

    .${CC_GPA_INJECTOR}ColTitle {
        text-align: center;
    }
    .${CC_GPA_INJECTOR}Input:read-only {
        border: none;
        text-align: center;
    }

    .${CC_GPA_INJECTOR}Input:not(:focus) {
        border: none;
        text-align: center;
    }

    #gpa {
        margin-top: 8px;
    }

    input[type="text"]{
        background: inherit;
    }

    tr:nth-child(even) {background: #f2f2f2}

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
    const stylesEl = createEl("style", [], styles);
    document.head.appendChild(stylesEl);
    const modal = createEl("dialog", [], "", { id: CC_GPA_INJECTOR + "Modal" });
    const close = createEl(
        "a",
        [],
        "Close",
        {
            href: `javascript:document.getElementById("${
                CC_GPA_INJECTOR + "Modal"
            }").close()`,
        },
        {
            cursor: "click",
            position: "absolute",
            top: "2%",
            right: "2%",
        }
    );
    const { gpaEl, table } = renderTableAndGPA(
        classes,
        modalIsEditable,
        unweighted
    );
    const buttons = createButtons(classes, gpaEl, table);
    modal.append(close, gpaEl, table, buttons);
    document.body.appendChild(modal);
};

function createButtons(
    classes: Class[],
    oldGPAEl: HTMLDivElement,
    oldTableEl: HTMLTableElement
) {
    const buttons = createEl("div", [CC_GPA_INJECTOR + "ButtonRow"]);
    const gpaType = createEl("button", [CC_GPA_INJECTOR + "ActionButton"]);

    const editable = createEl("button", [CC_GPA_INJECTOR + "ActionButton"]);
    editable.style.color = gpaType.style.color = "#FFFFFF";
    editable.style.fontWeight = gpaType.style.fontWeight = "bold";
    buttons.append(editable, gpaType);

    function rerenderGPAType() {
        (gpaType.innerHTML = `Show ${unweighted ? "CC GPA" : "Unweighted"}`),
            (gpaType.style.backgroundColor = unweighted
                ? "#004F9E"
                : "#b7da9b");
    }

    function rerenderEditable() {
        editable.innerHTML = modalIsEditable
            ? "Show Real Grades"
            : "Enter Hypothetical Grades";
        editable.style.backgroundColor = modalIsEditable
            ? "#004F9E"
            : "#b7da9b";
    }

    function rerenderTableAndHeader() {
        const { gpaEl, table } = renderTableAndGPA(
            classes,
            modalIsEditable,
            unweighted
        );
        oldGPAEl.parentNode!.insertBefore(gpaEl, oldGPAEl);
        oldGPAEl.remove();
        oldTableEl.parentNode!.insertBefore(table, oldTableEl);
        oldTableEl.remove();
        oldGPAEl = gpaEl;
        oldTableEl = table;
    }

    rerenderGPAType();
    rerenderEditable();

    gpaType.addEventListener("click", () => {
        unweighted = !unweighted;
        rerenderGPAType();
        rerenderTableAndHeader();
    });
    editable.addEventListener("click", () => {
        modalIsEditable = !modalIsEditable;
        rerenderEditable();
        rerenderTableAndHeader();
    });

    return buttons;
}
