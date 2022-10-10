import { Class, ClassProperties } from "../../class.js";
import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";
import { rerenderGPA } from "./gpa.js";

export const getTableCSS = () => `
input[type="text"]{
    background: inherit;
}

tr:nth-child(even) {background: #f2f2f2}

.${CC_GPA_INJECTOR}ColTitle {
    text-align: center;
}

.${CC_GPA_INJECTOR}Input:not(:focus).${CC_GPA_INJECTOR}Input:read-write {
    border: none !important;
    text-align: center;
}
.${CC_GPA_INJECTOR}Input:read-only {
    border: none !important;
    text-align: center;
}
.${CC_GPA_INJECTOR}Input{
    outline: none;
}



.${CC_GPA_INJECTOR}ClassName{
    padding-right: 3em;
}

.${CC_GPA_INJECTOR}ClassType {
    text-align: center
}
`;
export const renderTable = () => {
    const table = createEl(
        "table",
        ["table", "table-striped", "table-condensed", "table-mobile-stacked"],
        "",
        { id: CC_GPA_INJECTOR + "Table" }
    );
    const titleRow = createEl("tr");

    titleRow.append(
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Period"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Class"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Type"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Percent"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle"], "Grade"),
        createEl("td", [CC_GPA_INJECTOR + "ColTitle", "GpaType"])
    );
    table.append(titleRow);

    for (const classInfo of modalOptions.classes) {
        const row = createEl("tr");
        row.append(
            createEl("td", [], classInfo.period + "."),
            createEl("td", [CC_GPA_INJECTOR + "ClassName"], classInfo.name),
            createEl("td", [CC_GPA_INJECTOR + "ClassType"], classInfo.type)
        );

        const classProps: (keyof ClassProperties)[] = [
            "percent",
            "letterGrade",
            "gpa",
        ];
        for (const classProp of classProps) {
            const el = createEl("td");
            el.append(
                createEl("input", [CC_GPA_INJECTOR + "Input"], "", {
                    type: "text",
                    targetClassProp: classProp,
                    targetClassPeriod: classInfo.period.toString(),
                })
            );
            row.append(el);
        }
        table.append(row);
    }

    rerenderTable(table);
    setupEventListeners(table);
    return table;
};

function setupEventListeners(table: HTMLTableElement) {
    for (const el of table.getElementsByClassName(
        CC_GPA_INJECTOR + "Input"
    ) as HTMLCollectionOf<HTMLInputElement>) {
        const targetProp = el.getAttribute(
            "targetClassProp"
        ) as keyof ClassProperties;

        el.addEventListener("change", (e) => {
            const classInfo = modalOptions.classes.find(
                (c) =>
                    c.period.toString() == el.getAttribute("targetClassPeriod")
            )!;
            const val = classInfo.isValid(targetProp, el.value);
            if (val !== false) {
                classInfo.set(targetProp, val);
            }
            el.blur();
            rerenderClass(classInfo, table);
            rerenderGPA(
                document.getElementById(
                    CC_GPA_INJECTOR + "ModalGpa"
                ) as HTMLHeadingElement,
                document.getElementById(CC_GPA_INJECTOR + "ModalGpaNum")!
            );
        });

        el.addEventListener("keydown", (e) => {
            if (e.key == "Enter") (e.target as HTMLInputElement).blur();
        });
    }
}

export function rerenderClass(classInfo: Class, table: HTMLTableElement) {
    const items = table.querySelectorAll(
        `[targetClassPeriod="${classInfo.period}"]`
    ) as NodeListOf<HTMLInputElement>;
    items[0].value = classInfo.grade.percent.toFixed(2);
    items[1].value = classInfo.grade.toString();
    items[2].value = modalOptions.isUnweighted
        ? classInfo.grade.rawGPA().toFixed(2)
        : classInfo.gpa().toFixed(2);
    items[0].readOnly =
        items[1].readOnly =
        items[2].readOnly =
            !modalOptions.isHypothetical;

    items[2].setAttribute(
        "targetClassProp",
        modalOptions.isUnweighted ? "unweightedGpa" : "gpa"
    );
}

export function rerenderTable(table: HTMLTableElement) {
    (table.getElementsByClassName(
        "GpaType"
    )[0] as HTMLTableCellElement)!.innerText = modalOptions.isUnweighted
        ? "Unweighted GPA"
        : "CC GPA";

    modalOptions.classes.forEach((c) => rerenderClass(c, table));
}
