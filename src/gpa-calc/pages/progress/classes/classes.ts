import { fetchClasses } from "../../../api/classes.js";
import { waitForPromiseBar } from "../../../utils/progress_bar.js";
import { renderLinks } from "./assignments/links.js";
import { renderResetButton } from "./assignments/reset.js";
import { renderClassPercentage } from "./percentage.js";

async function renderClassModalAfterFullyLoaded() {
    console.log("Rendering");
    const name =
        document.getElementsByClassName("modal-header")[0].children[1]
            .innerHTML;
    const currentClass = await fetchClasses().then((res) =>
        res.find((c) => c.sectionidentifier == name)
    );

    await Promise.all([
        renderClassPercentage(currentClass.sectionid),
        renderResetButton(),
        renderLinks(currentClass.sectionid),
    ]);
}

function renderClasses() {
    console.log("Will render classes when ready....");

    let alreadyRendered = false;
    const cancelID = setInterval(() => {
        if (alreadyRendered) return;

        const progresses = document.getElementsByClassName("progress-bar-info");
        if (progresses.length === 0) {
            alreadyRendered = true;
            renderClassModalAfterFullyLoaded()
                .then((_) => clearInterval(cancelID))
                .catch((err) => {
                    alreadyRendered = false;
                    console.warn("err");
                    // Remove stuff that was already rendered
                    for(const el of document.getElementById("site-modal")?.getElementsByClassName("CC_GPA_INJECTOR")) {
                        el.remove();
                    }
                });
            return;
        }

        const progressBar = progresses[0] as HTMLDivElement;
        if (progressBar.style.width !== "100%") return;
        renderClassModalAfterFullyLoaded();
        clearInterval(cancelID);
    }, 5);
}

export function setupObserverToRenderClasses() {
    let currentlyRendered = false;
    const observer = new MutationObserver((ev) => {
        const { classList } = document.body;
        if (
            !classList.contains("modal-open") ||
            classList.contains("gpa-calc-modal-open")
        ) {
            currentlyRendered = false;
            return;
        }

        if (!currentlyRendered && classList.contains("modal-open")) {
            renderClasses();
            currentlyRendered = true;
        }
    });

    console.log("Setup");

    observer.observe(document.body, { attributeFilter: ["class"] });
}
