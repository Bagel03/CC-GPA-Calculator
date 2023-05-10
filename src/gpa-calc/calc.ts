import { renderProgress } from "./pages/progress/progress.js";

function main() {
    if (!location.href.includes("progress")) return;

    const progressBar = document.getElementsByClassName(
        "progress-bar"
    )[0] as HTMLDivElement;
    const cancelID = setInterval(() => {
        if (progressBar.style.width !== "100%") return;
        renderProgress();
        clearInterval(cancelID);
    }, 5);
}

main();
window.addEventListener("hashchange", () => main());
