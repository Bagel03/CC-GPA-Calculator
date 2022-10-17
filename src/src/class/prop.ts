import { Class, ClassProps } from "../class.js";

// export abstract class ClassProp<T, I extends any[]> {
//     constructor(public readonly owner: Class, ...args: I) {
//         this.init(...args);
//     }

//     init(...args: I): void {}
// }

export abstract class EditableClassProp<T, O extends {} = {}> {
    public readonly owner!: Class;

    constructor(public options: O) {}

    clone() {
        let temp = this.owner;
        //@ts-ignore
        this.owner = null;
        //@ts-ignore
        const c = new this.constructor(this.options);
        //@ts-ignore

        this.owner = temp;
        return c;
    }

    connectTo(owner: Class) {
        //@ts-ignore
        this.owner = owner;
    }

    abstract getValue(): T;
    getString(): string {
        const v = this.getValue();
        if (typeof v == "number") return v.toFixed(2);

        return (v as any).toString();
    }
    abstract isPresent(): boolean;
    abstract parseFromString(str: string): T | false;
    abstract update(val: T): void;
}
