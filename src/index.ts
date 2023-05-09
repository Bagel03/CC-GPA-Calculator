declare const chrome: any;

class Injector {
    static injectScript(filepath: string) {
        const script = document.createElement("script");
        if (localStorage.getItem("DEV")) {
            filepath = "dist/" + filepath;
        }
        script.setAttribute("src", chrome.runtime.getURL(filepath));
        script.setAttribute("type", "module");
        script.id = "hello"
        document.head.appendChild(script);

        return new Promise(res => script.onload = res);
    }

    static injectExternalCss(filepath: string) {

        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", filepath);

        document.head.appendChild(link);
    }

    static injectCss(filepath: string) {
        if (localStorage.getItem("DEV")) {
            filepath = "dist/" + filepath;
        }
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", chrome.runtime.getURL(filepath));

        document.head.appendChild(link);
    }
}

console.log("Injecting ");
Injector.injectCss("gpa-calc/styles/styles.css");
Injector.injectCss("gpa-calc/styles/hover.css")
Injector.injectScript("gpa-calc/calc.js");
Injector.injectExternalCss("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
// <link rel="stylesheet" href="" />