import { getSectionWeights, TOTAL_POINTS } from "../weights.js";

export async function recalculateGrade(classId: string) {
    // Render individual sections
    const grades = document.querySelectorAll(
        `[data-heading="Points"]`
    ) as NodeListOf<HTMLDivElement>;

    const sectionTotals = new Map<string, { current: number; max: number }>();

    // Load grades
    for (const grade of grades) {
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

        const sectionTotal = sectionTotals.get(section);
        sectionTotal.current += score;
        sectionTotal.max += gradeMax;
    }

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

    const weights = await getSectionWeights(classId);

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
            total += (current / max) * (weights.get(parseInt(id)) / 100);
        });

        // Check for incomplete grades

        let maxTotal = 0;
        for (const max of weights.values()) {
            maxTotal += max;
        }

        if (maxTotal < 100) {
            total *= 100 / maxTotal;
        }

        console.log(maxTotal);

        overallGrade = (total * 100).toFixed(2);
    }

    // TODO: Make this not so fragile
    const el = document.getElementsByTagName("h1")[1] as HTMLElement;
    const textNode = document.createTextNode(overallGrade);
    el.replaceChild(textNode, el.firstChild);
}
