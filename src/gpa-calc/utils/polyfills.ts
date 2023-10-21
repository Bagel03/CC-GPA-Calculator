declare global {
    interface String {
        toBool(): boolean;
    }
}

String.prototype.toBool = function (this: string) {
    if (this === "true") return true;
    return false;
};
export {};
