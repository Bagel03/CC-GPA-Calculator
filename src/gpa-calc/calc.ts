import { renderProgress } from "./pages/progress/progress.js";

// Check for new update
const currentVersion = 3.0;
const lastVersion = localStorage.getItem("gpa-calc-last-version");
if (!lastVersion || parseFloat(lastVersion) < currentVersion) {
    alert("CC GPA Calculator updated successfully to v" + currentVersion);
    localStorage.setItem("gpa-calc-last-version", currentVersion.toString());
}

function main() {
    if (!location.href.includes("progress")) return;

    const cancelID = setInterval(() => {
        const progresses = document.getElementsByClassName("progress-bar");
        if (progresses.length === 0) {
            renderProgress();
            clearInterval(cancelID);
        }

        const progressBar = progresses[0] as HTMLDivElement;
        if (progressBar.style.width !== "100%") return;
        renderProgress();
        clearInterval(cancelID);
    }, 5);
}

main();
window.addEventListener("hashchange", () => main());
