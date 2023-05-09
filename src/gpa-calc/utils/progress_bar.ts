export function waitForPromiseBar() {
    const progressBar = (document.getElementsByClassName("progress-bar") as HTMLCollectionOf<HTMLDivElement>)[0];

    return new Promise<void>(res => {
        const id = setInterval(() => {
            if (progressBar.style.width == "100%") {
                window.clearInterval(id);
                res();
            }
        }, 5)
    })
}