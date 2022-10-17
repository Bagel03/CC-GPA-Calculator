import { render } from "./renderer.js";
import { DeferredPromise } from "./utils.js";

let needReRender = true;
let progressBar = document.getElementsByClassName(
    "progress-bar"
)[0] as HTMLDivElement;

let nonRenderLoadingPromise = new DeferredPromise();
let isCurrentlyLoadingNonRender = false;

export const startNonRenderLoading = () => {
    nonRenderLoadingPromise.reset();
    isCurrentlyLoadingNonRender = true;
    return nonRenderLoadingPromise;
};

const observer = new MutationObserver(async () => {
    if (!window.location.hash.includes("progress")) return;

    if (isCurrentlyLoadingNonRender) {
        needReRender = false;
        if (progressBar.style.width == "100%") {
            nonRenderLoadingPromise.resolve();
            isCurrentlyLoadingNonRender = false;
        }
        return;
    }

    if (progressBar.style.width !== "100%") {
        needReRender = true;
        return;
    }

    if (needReRender) {
        console.log("Mutation Render");
        render();
    }
    needReRender = false;
});

const domObserver = new MutationObserver(async () => {
    if (document.getElementsByClassName("progress-bar").length < 1) {
        if (progressBar) {
            observer.disconnect();
            //@ts-ignore
            progressBar = null;

            if (isCurrentlyLoadingNonRender) {
                needReRender = false;
                return;
            }

            if (needReRender) {
                console.log("Dom Render");

                render();
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
            if (isCurrentlyLoadingNonRender) {
                nonRenderLoadingPromise.resolve();
                isCurrentlyLoadingNonRender = false;
            }
            needReRender = true;
        }
    }
});

const onEnterProgressPage = () => {
    progressBar = document.getElementsByClassName(
        "progress-bar"
    )[0] as HTMLDivElement;

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

if (window.location.hash.includes("progress")) {
    onEnterProgressPage();
}
