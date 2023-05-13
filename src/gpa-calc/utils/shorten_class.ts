export function shortenClassName(className: string) {
    return className.replace(/ - [0-9] \(Period [0-9]\)/, "").trim();
}
