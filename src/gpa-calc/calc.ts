import { renderClassPage } from "./pages/class/class.js";
import { renderProgressPage } from "./pages/progress/progress.js";
import { clearAllElements, anyElementsPresent } from "./utils/elements.js";
import "./utils/polyfills.js";

// Check for new update
const currentVersion = 3.5;
const lastVersion = localStorage.getItem("gpa-calc-last-version");
if (!lastVersion || parseFloat(lastVersion) < currentVersion) {
    alert("CC GPA Calculator updated successfully to v" + currentVersion);
    alert(
        "CC GPA Calculator is currently disabled because of updates to blackbaud, it will be re-enabled as soon as it is ready"
    );
    localStorage.setItem("gpa-calc-last-version", currentVersion.toString());
}

const pageStringsToRenderers: Record<string, () => Promise<any>> = {
    progress: renderProgressPage,
    academicclass: renderClassPage,
};

function main() {
    return;
    let renderFn: () => Promise<any>;
    for (const [key, fn] of Object.entries(pageStringsToRenderers)) {
        if (location.href.includes(key)) {
            renderFn = fn;
            break;
        }
    }

    if (!renderFn) return;

    let alreadyRendered = false;
    const cancelID = setInterval(() => {
        if (anyElementsPresent()) {
            alreadyRendered = true;
        }

        if (alreadyRendered) return;
        alreadyRendered = true;

        renderFn()
            .then(() => {
                clearInterval(cancelID);
                alreadyRendered = false;
            })
            .catch(() => {
                clearAllElements();
                alreadyRendered = false;
            });
    }, 50);
    // const cancelID = setInterval(() => {
    //     console.log(alreadyRendered, cancelID);
    //     if (anyElementsPresent()) {
    //         alreadyRendered = true;
    //     }

    //     if (alreadyRendered) return;

    //     const progresses = document.getElementsByClassName("progress-bar");
    //     if (progresses.length === 0) {
    //         alreadyRendered = true;
    //         renderFn()
    //             .then(_ => {
    //                 console.log("Canceling");
    //                 if (!anyElementsPresent()) console.log("Canceling with no elements present");
    //                 clearInterval(cancelID);
    //             })
    //             .catch(err => {
    //                 alreadyRendered = false;
    //                 console.warn(err);

    //                 // Remove anything that was already rendered to prevent double renedering
    //                 clearAllElements();
    //             });
    //         return;
    //     }

    //     const progressBar = progresses[0] as HTMLDivElement;
    //     if (progressBar.style.width !== "100%") return;
    //     alreadyRendered = true;

    //     renderFn()
    //         .then(() => {
    //             console.log("Canceling");
    //             if (!anyElementsPresent()) console.log("Canceling with no elements present");

    //             clearInterval(cancelID);
    //         })
    //         .catch(err => {
    //             alreadyRendered = false;
    //             console.warn(err);

    //             // Remove anything that was already rendered to prevent double renedering
    //             clearAllElements();
    //         });
    // }, 5);

    function cancelIntervalOnHashChange() {
        alreadyRendered = false;

        clearInterval(cancelID);
        window.removeEventListener("hashchange", cancelIntervalOnHashChange);
    }
    window.addEventListener("hashchange", cancelIntervalOnHashChange);
}

main();
window.addEventListener("hashchange", () => main());
