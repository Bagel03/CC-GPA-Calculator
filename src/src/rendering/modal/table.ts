import { Class, ClassProps } from "../../class.js";
import { EditableClassProp } from "../../class/prop.js";
import { GradeProp } from "../../class/props/grade.js";
import { GradeTime } from "../../class/props/time.js";
import { ClassType } from "../../class/props/type.js";
import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";
import { rerenderGpa } from "./gpa.js";

const spots = [5, 20, 10, 15, 30];
export const getTableCSS = () => `
input[type="text"]{
    background: inherit;
}

tr.${CC_GPA_INJECTOR}:nth-child(even) {background: #f2f2f2}

td.${CC_GPA_INJECTOR}:nth-child(1) {
    width: ${spots[0]}%;
    text-align: center;
    padding: 2px;
}
td.${CC_GPA_INJECTOR}:nth-child(1)::after {
    content: " . "
}

td.${CC_GPA_INJECTOR}:nth-child(2) {
    padding-right: 4em;
    width: ${spots[1]}%;
}

td.${CC_GPA_INJECTOR}:nth-child(3) {
    margin-right: ${spots[3]}%;
    width: ${spots[2]}%;
}

td.${CC_GPA_INJECTOR}:nth-child(4) {
    margin-left: auto;
}

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
    width: 100%;
}

.${CC_GPA_INJECTOR}ClassName{
    padding-right: 3em;
}

.${CC_GPA_INJECTOR}Center {
    text-align: center
}
`;

const tableHeadingsAndProps: Record<GradeTime, [string, keyof ClassProps][]> = {
    [GradeTime.FIRST_QUARTER]: [
        ["!Period", "period"],
        ["!Class", "name"],
        ["!Type*", "type"],
        ["Percent", "gradePercent-0"],
        ["Grade", "gradeLetter-0"],
        ["GPA", "gpa-0"],
    ],
    [GradeTime.SECOND_QUARTER]: [
        ["!Period", "period"],
        ["!Class", "name"],
        ["!Type*", "type"],
        ["Percent", "gradePercent-1"],
        ["Grade", "gradeLetter-1"],
        ["GPA", "gpa-1"],
    ],
    [GradeTime.EXAM]: [],
    [GradeTime.OVERALL]: [
        ["!Period", "period"],
        ["!Class", "name"],
        ["1st Qtr", "gradePercent-0"],
        ["2nd Qtr", "gradePercent-1"],
        ["Exam", "gradePercent-2"],
        ["Overall", "gradePercent-3"],
        ["Grade", "gradeLetter-3"],
        ["GPA", "gpa-3"],
    ],
};

// Define GPA
{
    const getTitle = () => ({
        get: () => (modalOptions.isUnweighted ? "Unweighted GPA" : "GPA"),
    });

    const getProp = (time: GradeTime) => ({
        get: () =>
            modalOptions.isUnweighted ? `rawGpa-${time}` : `gpa-${time}`,
    });

    Object.defineProperties(tableHeadingsAndProps[GradeTime.FIRST_QUARTER][5], {
        [0]: getTitle(),
        [1]: getProp(GradeTime.FIRST_QUARTER),
    });
    Object.defineProperties(
        tableHeadingsAndProps[GradeTime.SECOND_QUARTER][5],
        {
            [0]: getTitle(),
            [1]: getProp(GradeTime.SECOND_QUARTER),
        }
    );
    Object.defineProperties(tableHeadingsAndProps[GradeTime.OVERALL][7], {
        [0]: getTitle(),
        [1]: getProp(GradeTime.OVERALL),
    });
}

export function rerenderClass(classInfo: Class, table: HTMLTableElement) {
    const row = table.querySelector(`[targetClass="${classInfo.id}"]`)!;
    for (
        let i = 0;
        i < tableHeadingsAndProps[modalOptions.currentView].length;
        i++
    ) {
        const [title, propKey] =
            tableHeadingsAndProps[modalOptions.currentView][i];
        const prop = classInfo.getProp(propKey);

        if (
            typeof prop === "number" ||
            typeof prop == "string" ||
            prop instanceof ClassType
        ) {
            row.children[i].innerHTML = prop.toString();
        } else if (!(prop instanceof GradeProp)) {
            if (prop.isPresent()) {
                (row.children[i].firstElementChild as HTMLInputElement).value =
                    prop.getString();
            } else {
                (row.children[i].firstElementChild as HTMLInputElement).value =
                    "?";
            }
        }
    }
}

export const renderClass = (classInfo: Class) => {
    const row = createEl("tr", [], "", {
        targetClass: classInfo.id.toString(),
    });

    const headingsAndProps = tableHeadingsAndProps[modalOptions.currentView];

    for (const [heading, propKey] of headingsAndProps) {
        const td = createEl("td");
        if (heading.includes("*")) td.classList.add(CC_GPA_INJECTOR + "Center");

        if (!heading.startsWith("!")) {
            td.style.width = `${spots[4] / (headingsAndProps.length - 3)}%`;

            const input = createEl("input", [CC_GPA_INJECTOR + "Input"], "", {
                type: "text",
            });
            if (!modalOptions.isHypothetical) {
                input.setAttribute("readonly", "readonly");
            }
            td.append(input);

            input.onchange = () => {
                const prop = classInfo.getProp(propKey);

                if (!prop || !(prop instanceof EditableClassProp)) return;
                input.value = input.value.trim();

                const value = prop.parseFromString(input.value);
                if (input.value == "?") {
                    prop.markInvalid();
                } else if (!value) {
                    input.value = prop.getString();
                    return;
                } else {
                    //@ts-ignore
                    prop.update(value);
                }

                input.blur();
                rerenderClass(
                    classInfo,
                    input.parentElement!.parentElement!
                        .parentElement! as HTMLTableElement
                );
                rerenderGpa();
            };
        }

        row.append(td);
    }
    return row;
};

export const renderTitle = () => {
    const row = createEl("tr");
    for (const [heading] of tableHeadingsAndProps[modalOptions.currentView]) {
        row.append(
            createEl(
                "th",
                [CC_GPA_INJECTOR + "ColTitle"],
                heading.replace("!", "").replace("*", "")
            )
        );
    }
    return row;
};

export const renderTable = () => {
    const table = createEl(
        "table",
        ["table", "table-striped", "table-condensed"],
        "",
        { id: CC_GPA_INJECTOR + "Table" }
    );

    table.append(renderTitle());
    for (const c of modalOptions.classes) {
        table.append(renderClass(c));
        rerenderClass(c, table);
    }

    return table;
};

export const rerenderTable = () => {
    const table = document.getElementById(CC_GPA_INJECTOR + "Table")!;
    table.replaceWith(renderTable());
};
