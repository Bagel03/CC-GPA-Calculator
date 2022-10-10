import { parseClasses } from "./parser.js";
import { render } from "./renderer.js";
/*
Letter Numerical Academic Honors / Advanced
Grade Grade Courses Courses
A+ 100 - 97 4.33 5.33
A 96 - 93 4.00 5.00
A- 92 - 90 3.67 4.67
B+ 89 - 87 3.33 4.33
B 86 - 83 3.00 4.00
B- 82 - 80 2.67 3.67
C+ 79 - 77 2.33 3.33
C 76 - 73 2.00 3.00
C- 72 - 70 1.67 2.67
D+ 69 - 67 1.33 2.33
D 66 - 63 1.00 2.00
D- 62 - 60 0.67 1.67
F Below 60 0.00 0.00
*/

let needReRender = true;
let progressBar = document.getElementsByClassName(
    "progress-bar"
)[0] as HTMLDivElement;

const observer = new MutationObserver(() => {
    if (!window.location.hash.includes("progress")) return;

    if (progressBar.style.width !== "100%") {
        needReRender = true;
        return;
    }
    if (needReRender) render(parseClasses());
    needReRender = false;
});

const domObserver = new MutationObserver(() => {
    if (document.getElementsByClassName("progress-bar").length < 1) {
        if (progressBar) {
            observer.disconnect();
            //@ts-ignore
            progressBar = null;

            if (needReRender) {
                render(parseClasses());
                needReRender = false;
            }
        }
        return;
    } else {
        if (!progressBar) {
            progressBar = document.getElementsByClassName(
                "progress-bar"
            )[0] as HTMLDivElement;
            observer.observe(progressBar, {
                attributes: true,
                attributeFilter: ["style"],
            });
            needReRender = true;
        }
    }
});

const onEnterProgressPage = () => {
    observer.observe(progressBar, {
        attributes: true,
        attributeFilter: ["style"],
    });

    domObserver.observe(document.body, { childList: true });
};
const onExitProgressPage = () => {
    observer.disconnect();
    domObserver.disconnect();
};

window.addEventListener("hashchange", () => {
    if (window.location.hash.includes("progress")) {
        onEnterProgressPage();
    } else {
        onExitProgressPage();
    }
});
