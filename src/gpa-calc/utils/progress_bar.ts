export function waitForPromiseBar() {
    return new Promise<void>((res) => {
        const id = setInterval(() => {
            if (
                (
                    document.getElementsByClassName(
                        "progress-bar"
                    )?.[0] as HTMLElement
                ).style.width == "100%"
            ) {
                window.clearInterval(id);
                res();
            }
        }, 5);
    });
}
