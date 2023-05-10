declare const chrome: any;

class Injector {
    static readonly dev = localStorage.getItem("gpa-dev-env");

    static injectScript(filepath: string) {
        const script = document.createElement("script");

        if (!Injector.dev)
            filepath =
                `https://bagel03.github.io/CC-GPA-Calculator/` + filepath;
        else filepath = chrome.runtime.getURL("built/" + filepath);

        script.setAttribute("src", filepath);
        script.setAttribute("type", "module");
        script.id = "hello";
        document.head.appendChild(script);

        return new Promise((res) => (script.onload = res));
    }

    static injectCss(filepath: string) {
        if (!Injector.dev)
            filepath =
                `https://bagel03.github.io/CC-GPA-Calculator/` + filepath;
        else filepath = chrome.runtime.getURL("built/" + filepath);

        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", filepath);

        document.head.appendChild(link);
    }
}

console.log("Injecting ");
Injector.injectScript("bundle.js");
Injector.injectCss("bundle.css");
// <link rel="stylesheet" href="" />
