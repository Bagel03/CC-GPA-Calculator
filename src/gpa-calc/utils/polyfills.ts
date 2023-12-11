declare global {
    interface String {
        toBool(): boolean;
    }

    interface ObjectConstructor {
        groupBy<Item, Key extends PropertyKey>(
            items: Iterable<Item>,
            keySelector: (item: Item, index: number) => Key
        ): Record<Key, Item[]>;
    }

    interface MapConstructor {
        groupBy<Item, Key>(
            items: Iterable<Item>,
            keySelector: (item: Item, index: number) => Key
        ): Map<Key, Item[]>;
    }
}

String.prototype.toBool = function (this: string) {
    if (this === "true") return true;
    return false;
};
export {};
