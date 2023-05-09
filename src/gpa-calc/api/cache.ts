export function cache<T extends () => Promise<any>>(fn: T) {
    let oldValue = null;
    return async () => {
        if (oldValue) return oldValue;
        return oldValue = await fn();

    }
}