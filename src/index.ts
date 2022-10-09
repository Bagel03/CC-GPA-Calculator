// This is the entry point, where we actually inject all the code.
const mainFile = "script.js";

// Inject the scripts into the page
function injectScript(fileName: string) {
    const el = document.createElement("script");
    el.setAttribute("src", chrome.runtime.getURL("dist/" + fileName));
    el.setAttribute("type", "module");

    document.head.insertBefore(el, document.head.lastChild);
}

function injectScripts() {
    injectScript(mainFile);
}

// We also make sure they agreed to the contract
declare const chrome: any;
const agreement = `The CC GPA Calculator is NOT to be used as a replacement for report cards, and should NOT BE COMPLETELY TRUSTED. 
This means: DO NOT DROP an assignment because it says you will be fine. 

Your grades are your grades, the tool shouldn't affect that.

Press OK if you understand`;
const agreementToken = "agreed";

function checkAgreement() {
    return new Promise((res, rej) => {
        console.log("Checking agreement...");
        chrome.storage.sync.get(agreementToken, (data: any) => {
            res(data[agreementToken]);
        });
    });
}

// Main function
(async function () {
    // If were not on the progress page, quick exit
    if (!window.location.toString().includes("progress")) return;

    if (!(await checkAgreement())) {
        if (!window.confirm(agreement)) return;
        chrome.storage.sync.set({ [agreementToken]: true });
    }

    injectScripts();
})();
