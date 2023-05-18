import { renderProgress } from "./pages/progress/progress.js";

// Check for new update
const currentVersion = 2.11;
const lastVersion = localStorage.getItem("gpa-calc-last-version");
if (!lastVersion || parseFloat(lastVersion) < currentVersion) {
    alert("CC GPA Calculator updated successfully to v" + currentVersion);
    localStorage.setItem("gpa-calc-last-version", currentVersion.toString());
}

function main() {
    if (!location.href.includes("progress")) return;

    const cancelID = setInterval(() => {
        const progressBar = document.getElementsByClassName(
            "progress-bar"
        )[0] as HTMLDivElement;
        if (progressBar.style.width !== "100%") return;
        renderProgress();
        clearInterval(cancelID);
    }, 5);
}

main();
window.addEventListener("hashchange", () => main());
