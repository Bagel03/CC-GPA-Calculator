export function getHTMLTextContent(htmlString: string) {
    const el = document.createElement("span");
    el.innerHTML = htmlString;
    return el.innerText;
}
