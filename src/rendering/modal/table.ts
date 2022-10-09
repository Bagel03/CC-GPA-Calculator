import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";

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
            createEl("td", [], classInfo.name)
        );

        for (let i = 0; i < 4; i++) {
            const el = createEl("td");
            el.append(
                createEl("input", [CC_GPA_INJECTOR + "Input"], "", {
                    type: "text",
                })
            );
            row.append(el);
        }
        table.append(row);
    }

    rerenderTable(table);
    return table;
};

export function rerenderTable(table: HTMLTableElement) {
    (table.getElementsByClassName(
        "GpaType"
    )[0] as HTMLTableCellElement)!.innerText = modalOptions.isUnweighted
        ? "Unweighted GPA"
        : "CC GPA";

    const classEls = Array.from(table.getElementsByTagName("tr"));
    classEls.shift();
    for (let i = 0; i < classEls.length; i++) {
        let items = Array.from(classEls[i].getElementsByTagName("td"))
            .slice(2)
            .map((cell) => cell.children[0] as HTMLInputElement);
        items[0].value = modalOptions.classes[i].type;
        items[1].value = modalOptions.classes[i].grade.percent.toFixed(2);
        items[2].value = modalOptions.classes[i].grade.toString();
        items[3].value = modalOptions.isUnweighted
            ? modalOptions.classes[i].grade.rawGPA().toFixed(2)
            : modalOptions.classes[i].gpa().toFixed(2);

        items[0].readOnly =
            items[1].readOnly =
            items[2].readOnly =
            items[3].readOnly =
                !modalOptions.isHypothetical;
        console.log(items[0].readOnly);
    }
}
