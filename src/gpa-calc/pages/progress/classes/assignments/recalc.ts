import { getSectionWeightsAndInfo, TOTAL_POINTS } from "../weights.js";

export async function recalculateGrade(classId: string) {
    // Render individual sections
    const grades = document.querySelectorAll(
        `[data-heading="Points"]`
    ) as NodeListOf<HTMLDivElement>;

    const sectionTotals = new Map<string, { current: number; max: number }>();

    const { weights, droppedAssignments } = await getSectionWeightsAndInfo(
        classId
    );

    const assignmentsBySection = new Map<
        string,
        { score: number; max: number; extraCredit:boolean }[]
    >();

    // Load grades
    grades.forEach((grade) => {
        const section =
            grade.parentElement /* tr */.parentElement
                ./* tbody */ parentElement /* table */.previousElementSibling
                .id;
        if (!sectionTotals.has(section)) {
            sectionTotals.set(section, { current: 0, max: 0 });
        }

        const [score, gradeMax] = grade.innerText
            .split("/")
            .map((x) => parseFloat(x));

        let ecElement = grade.parentElement.firstElementChild.firstElementChild as HTMLInputElement

        if (!assignmentsBySection.has(section)) {
            assignmentsBySection.set(section, []);
        }

        assignmentsBySection.get(section).push({ score, max: gradeMax, extraCredit: ecElement.checked });
        // const sectionTotal = sectionTotals.get(section);

        // sectionTotal.current += score;
        // sectionTotal.max += gradeMax;
    });

    // Factor in the dropped assignments
    for (const [section, dropped] of Object.entries(droppedAssignments)) {
        const assignments = assignmentsBySection.get(section);
        for (let i = 0; i < dropped; i++) {
            let min = Infinity;
            let minIdx = -1;
            for (let i = 0; i < assignments.length; i++) {
                const percentage = assignments[i].score / assignments[i].max;

                if (percentage < min) {
                    minIdx = i;
                    min = percentage;
                }
            }
            assignments.splice(minIdx, 1);
        }
    }

    // Calculate the section totals
    assignmentsBySection.forEach((assignments, section) => {
        assignments = assignments.filter(
            ({ score, max }) => !(Number.isNaN(score) || Number.isNaN(max))
        );

        const max = assignments.reduce((prev, curr) => prev + (curr.extraCredit ? 0 : curr.max), 0);
        const current = assignments.reduce(
            (prev, curr) => prev + curr.score,
            0
        );

        sectionTotals.set(section, { current, max });
    });

    sectionTotals.forEach(({ current, max }, sectionID) => {
        const percentage = (current / max) * 100;
        // Set the text above the table
        document.getElementById(sectionID).querySelector(".muted").innerHTML =
            percentage.toFixed(2) + "%";

        // Set the progress bar
        const bar = document
            .querySelector(`[data-bookmark="#${sectionID}"]`)
            .querySelector(".progress-bar") as HTMLElement;
        bar.innerText = Math.round(percentage).toString();
        bar.style.width = percentage.toFixed(2) + "%";
    });

    let overallGrade = "";
    if (weights == TOTAL_POINTS) {
        let current = 0;
        let max = 0;
        sectionTotals.forEach(({ current: newCurrent, max: newMax }) => {
            current += newCurrent;
            max += newMax;
        });

        overallGrade = ((current / max) * 100).toFixed(2);
    } else {
        let total = 0;
        sectionTotals.forEach(({ current, max }, id) => {
            total += (current / max) * (weights[id] / 100);
        });

        // Check for incomplete grades
        let maxTotal = 0;
        for (const max of Object.values(weights)) {
            maxTotal += max;
        }

        if (maxTotal < 100) {
            total *= 100 / maxTotal;
        }

        overallGrade = (total * 100).toFixed(2);
    }

    // TODO: Make this not so fragile
    const el = document.getElementsByTagName("h1")[1] as HTMLElement;
    const textNode = document.createTextNode(overallGrade);
    el.replaceChild(textNode, el.firstChild);
}
