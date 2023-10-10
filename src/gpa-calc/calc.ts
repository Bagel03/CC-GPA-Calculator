import { renderProgress } from "./pages/progress/progress.js";
import { clearAllElements, anyElementsPresent} from "./utils/elements.js"

// Check for new update
const currentVersion = 3.1;
const lastVersion = localStorage.getItem("gpa-calc-last-version");
if (!lastVersion || parseFloat(lastVersion) < currentVersion) {
    alert("CC GPA Calculator updated successfully to v" + currentVersion);
    localStorage.setItem("gpa-calc-last-version", currentVersion.toString());
}

function main() {
    if (!location.href.includes("progress")) return;

    let alreadyRendered = false;
    const cancelID = setInterval(() => {
        if(anyElementsPresent()) alreadyRendered = true;

        if (alreadyRendered) return;

        const progresses = document.getElementsByClassName("progress-bar");
        if (progresses.length === 0) {
            alreadyRendered = true;
            renderProgress()
                .then((_) => clearInterval(cancelID))
                .catch((err) => {
                    alreadyRendered = false;
                    console.warn(err);

                    // Remove anything that was already rendered to prevent double renedering
                    clearAllElements();
                });
            return;
        }

        const progressBar = progresses[0] as HTMLDivElement;
        if (progressBar.style.width !== "100%") return;
        alreadyRendered = true;

        renderProgress().then(() => clearInterval(cancelID)).catch((err) => {
            alreadyRendered = false;
            console.warn(err);

            // Remove anything that was already rendered to prevent double renedering
            clearAllElements();
        });

    }, 5);
}

main();
window.addEventListener("hashchange", () => main());
