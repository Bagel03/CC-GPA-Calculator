// A promise that can be resolved from another scope
export class DeferredPromise<T extends unknown = undefined> {
    public promise: Promise<T>;

    private internalResHandler: (val: T) => void = () => {};
    private internalRejHandler: (reason: any) => void = () => {};

    constructor() {
        this.promise = new Promise((res, rej) => {
            this.internalResHandler = res;
            this.internalRejHandler = rej;
        });
    }

    reset() {
        this.promise = new Promise((res, rej) => {
            this.internalResHandler = res;
            this.internalRejHandler = rej;
        });
    }

    await() {
        return this.promise;
    }

    resolve(val: T = undefined as T) {
        this.internalResHandler(val);
    }

    reject(reason: any) {
        this.internalRejHandler(reason);
    }
}

export const waitForChangesOnElementUntil = (
    element: HTMLElement,
    checkerFunc: (ele: HTMLElement) => boolean,
    options: MutationObserverInit & { timeout?: number } = {
        childList: true,
        timeout: 1000,
    }
) => {
    return new Promise<void>((res, rej) => {
        if (options.timeout) {
            setTimeout(() => rej("timeout"), options.timeout);
        }
        const observer = new MutationObserver(() => {
            if (checkerFunc(element)) {
                observer.disconnect();
                res();
            }
        });
        observer.observe(element, options);
    });
};

export const roundNumberToDivisions = (num: number, divisions: number) => {
    return Math.round(num * divisions) / divisions;
};

export const clamp = (num: number, low: number, high: number) => {
    return Math.max(low, Math.min(num, high));
};

declare global {
    interface Object {
        pipe<
            T extends this,
            A extends any[],
            F extends (input: T, ...args: A) => any
        >(
            this: T,
            func: F,
            ...args: A
        ): ReturnType<F>;

        setProp<T extends this>(this: T, key: string, value: any): T;
    }
}

Object.defineProperty(Object.prototype, "pipe", {
    value: function (func: (...args: any[]) => any, ...args: any[]) {
        return func(this, ...args);
    },
    enumerable: false,
});

Object.defineProperty(Object.prototype, "setProp", {
    value: function (key: string, value: any) {
        //@ts-ignore
        this[key] = value;
        return this;
    },
    enumerable: false,
});

export const fullMap = <T, O>(
    arr: Array<T>,
    mapFn: (value: T, index: number, arr: Array<T>) => O | undefined
): Array<O> => {
    return arr.map(mapFn).filter((obj): obj is O => obj !== undefined);
};

export const flip = (num: 0 | 1) => Math.abs(num - 1);
