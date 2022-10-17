// This is the entry point/injector, where we actually inject all the code.

const mainFile = "script.js";
const IS_DEV = true;

// Inject the scripts into the page
function injectScript(fileName: string) {
    const el = document.createElement("script");
    el.setAttribute(
        "src",
        chrome.runtime.getURL((IS_DEV ? "dist/" : "") + "src/" + fileName)
    );
    el.setAttribute("type", "module");

    document.head.insertBefore(el, document.head.lastChild);
}

function injectScripts() {
    console.log("Injecting...");
    injectScript(mainFile);
}

// We also make sure they agreed to the contract
declare const chrome: any;
const agreement = [
    "The CC GPA Calculator MAY NOT BE CORRECT",
    "Do not use it to replace report cards",
    "Do not drop an assignment because it says your grade will not change",
    "Do not blow off studying for an exam because it says you only need an easy grade",
    "It is not my responsibility if that has any impact on your grades",
    "Again: IT COULD BE WRONG!",
];
const agreementToken = "agreed";

function checkAgreement() {
    return new Promise((res, rej) => {
        chrome.storage.sync.get(agreementToken, (data: any) => {
            res(data[agreementToken]);
        });
    });
}

// Main function
(async function () {
    if (!(await checkAgreement())) {
        for (const statement of agreement) {
            if (!window.confirm(`${statement}\n\nPress OK if you understand.`))
                return console.log("Agreement denied");
        }
        chrome.storage.sync.set({ [agreementToken]: true });
    }

    injectScripts();
})();
