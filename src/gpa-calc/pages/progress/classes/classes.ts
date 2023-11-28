import { fetchClasses } from "../../../api/classes.js";
import { waitForPromiseBar } from "../../../utils/progress_bar.js";
import { renderLinks } from "./assignments/links.js";
import { renderResetButton } from "./assignments/reset.js";
import { renderClassPercentage } from "./percentage.js";
import { clearAllElements, anyElementsPresent } from "../../../utils/elements.js";
import {appendExtraCreditInfo} from "./assignments/extra_credit";

async function renderClassModalAfterFullyLoaded() {
    const name = document.getElementsByClassName("modal-header")[0].children[1].innerHTML;
    const currentClass = await fetchClasses().then(res => res.find(c => c.sectionidentifier == name));

    await Promise.all([
        renderClassPercentage(currentClass.sectionid.toString()),
        renderResetButton(),
        renderLinks(currentClass.sectionid.toString()),
        appendExtraCreditInfo(),
    ]);
}

function renderClasses() {
    console.log("Will render classes when ready...");

    let alreadyRendered = false;
    const siteModal = document.getElementById("site-modal")!;

    const cancelID = setInterval(() => {
        const siteModal = document.getElementById("site-modal");
        if (anyElementsPresent(siteModal)) alreadyRendered = true;
        if (alreadyRendered) return;


        const progresses = document.getElementsByClassName("progress-bar-info");
        if (progresses.length === 0) {
            alreadyRendered = true;
            renderClassModalAfterFullyLoaded()
                .then(_ => clearInterval(cancelID))
                .catch(err => {
                    clearAllElements(siteModal);
                    alreadyRendered = false;
                    console.warn("err");
                    // Remove stuff that was already rendered
                    // for (const el of document
                    //     .getElementById("site-modal")
                    //     ?.querySelectorAll("CC_GPA_INJECTOR")) {
                    //     el.remove();
                    // }

                });
            return;
        }

        const progressBar = progresses[0] as HTMLDivElement;
        if (progressBar.style.width !== "100%") return;
        alreadyRendered = true;

        renderClassModalAfterFullyLoaded()
            .then(() => clearInterval(cancelID))
            .catch(err => {
                clearAllElements(siteModal);
                alreadyRendered = false;
                console.warn(err);
            });
    }, 5);
}

let observerIsAlreadySetUp = false;
export function setupObserverToRenderClasses() {
    if (observerIsAlreadySetUp) return;

    let currentlyRendered = false;
    const observer = new MutationObserver(ev => {
        const { classList } = document.body;
        if (!classList.contains("modal-open") || classList.contains("gpa-calc-modal-open")) {
            currentlyRendered = false;
            return;
        }

        if (!currentlyRendered && classList.contains("modal-open")) {
            renderClasses();
            currentlyRendered = true;
        }
    });

    observer.observe(document.body, { attributeFilter: ["class"] });
    observerIsAlreadySetUp = true;
}
