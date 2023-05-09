import { fetchClasses } from "../../../api/classes.js";
import { waitForPromiseBar } from "../../../utils/progress_bar.js";
import { renderLinks } from "./assignments/links.js";
import { renderResetButton } from "./assignments/reset.js";
import { renderClassPercentage } from "./percentage.js";

export function renderClasses() {
    const siteModal = document.getElementById("site-modal")

    const observer = new MutationObserver(async (ev) => {
        if (siteModal.children.length == 0) return;
        if (siteModal.children[0]?.children[0]?.classList.contains("gpa-calc-modal")) return;

        await waitForPromiseBar();
        // const progressBar = (document.getElementsByClassName("progress-bar") as HTMLCollectionOf<HTMLDivElement>)[0];
        // if (progressBar.style.width !== "100%") return;

        const name = document.getElementsByClassName("modal-header")[0].children[1].innerHTML;
        const currentClass = await fetchClasses().then(res => res.find(c => c.sectionidentifier == name));

        // await new Promise(res => setTimeout(res, 300))


        renderClassPercentage(currentClass.sectionid);
        renderResetButton();
        renderLinks(currentClass.sectionid);
        // observer.disconnect();
    })

    observer.observe(siteModal, { childList: true });
}