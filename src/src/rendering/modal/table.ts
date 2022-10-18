import { Class, ClassProps } from "../../class.js";
import { EditableClassProp } from "../../class/prop.js";
import { GradeProp } from "../../class/props/grade.js";
import { GradeTime } from "../../class/props/time.js";
import { ClassType } from "../../class/props/type.js";
import { CC_GPA_INJECTOR, createEl } from "../../renderer.js";
import { modalOptions } from "../modal.js";
import { rerenderGpa } from "./gpa.js";

export const getTableCSS = () => `
input[type="text"]{
    background: inherit;
}

tr.${CC_GPA_INJECTOR}:nth-child(even) {background: #f2f2f2}

td.${CC_GPA_INJECTOR}:nth-child(2) {
    padding-right: 2em;
}

.${CC_GPA_INJECTOR}ColSpace {
    width: 10em;
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
    width: 6em;
}

.${CC_GPA_INJECTOR}ClassName{
    padding-right: 3em;
}

.${CC_GPA_INJECTOR}Center {
    text-align: center
}
`;

const tableHeadingsAndProps: Record<
    GradeTime,
    ([string, keyof ClassProps] | "SPACE")[]
> = {
    [GradeTime.FIRST_QUARTER]: [
        ["!Period", "period"],
        ["!Class", "name"],
        ["!Type*", "type"],
        "SPACE",
        ["Percent", "gradePercent-0"],
        ["Grade", "gradeLetter-0"],
        ["GPA", "gpa-0"],
    ],
    [GradeTime.SECOND_QUARTER]: [
        ["!Period", "period"],
        ["!Class", "name"],
        ["!Type*", "type"],
        "SPACE",
        ["Percent", "gradePercent-1"],
        ["Grade", "gradeLetter-1"],
        ["GPA", "gpa-1"],
    ],
    [GradeTime.EXAM]: [],
    [GradeTime.OVERALL]: [
        ["!Period", "period"],
        ["!Class", "name"],
        "SPACE",
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
        const arr = tableHeadingsAndProps[modalOptions.currentView][i];

        if (arr == "SPACE") {
            continue;
        }

        const [title, propKey] = arr;
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

    for (const arr of headingsAndProps) {
        const td = createEl("td");

        if (arr == "SPACE") {
            td.classList.add(CC_GPA_INJECTOR + "ColSpace");
            row.append(td);
            continue;
        }

        const [heading, propKey] = arr;

        if (heading.includes("*")) td.classList.add(CC_GPA_INJECTOR + "Center");

        if (!heading.startsWith("!")) {
            // td.style.width = `${spots[4] / (headingsAndProps.length - 3)}%`;

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
    for (const arr of tableHeadingsAndProps[modalOptions.currentView]) {
        if (arr === "SPACE") {
            row.append(
                createEl("th", [
                    CC_GPA_INJECTOR + "ColTitle",
                    CC_GPA_INJECTOR + "ColSpace",
                ])
            );
            continue;
        }
        const [heading] = arr;
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
