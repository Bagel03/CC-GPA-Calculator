export class ClassType {
    private static readonly allClassTypes: ClassType[] = [];
    static getById(id: number) {
        return this.allClassTypes.find(c => c.id === id);
    }

    private static nextId: number = 0;
    public readonly id: number;

    constructor(
        public readonly name: string,
        // Used for whole class names
        public readonly identifyingStrings: string[] = [],
        public readonly identifyingWords: string[] = [],
        public readonly extraHonorsPoint: boolean = false
    ) {
        this.id = ClassType.nextId++;
        ClassType.allClassTypes.push(this);
    }

    public static readonly REGULAR = new ClassType("Regular");
    public static readonly HONORS = new ClassType("Honors", [], ["honors"], true);
    public static readonly AP = new ClassType("AP", [], ["ap"], true);
    public static readonly UNMARKED = new ClassType(
        "Unmarked",
        ["physical education", "study hall", "quiz bowl"],
        ["hr"]
    );
    public static readonly THEOLOGY = new ClassType("Theology", [
        "theology",
        "revelation",
        "chistology",
        "paschal mystery",
        "ecclesiology" /* ... todo */,
    ]);

    public static readonly types = [
        ClassType.REGULAR,
        ClassType.HONORS,
        ClassType.AP,
        ClassType.UNMARKED,
        ClassType.THEOLOGY,
    ];

    public static fromName(name: string): ClassType {
        name = name.toLowerCase();
        const wordsInName = name.split(/\W/);

        for (const type of ClassType.types) {
            if (type.identifyingStrings.some(string => name.includes(string))) return type;
            if (type.identifyingWords.some(word => wordsInName.includes(word))) return type;
        }

        return ClassType.REGULAR;
    }
}

// export const ClassType = {
//     REGULAR: 0,
//     HONORS: 1,
//     AP: 2,
//     UNMARKED: 3,
// } as const;
// export type ClassType = (typeof ClassType)[keyof typeof ClassType];

export function getClassesOfType(classes: any[], type: ClassType): any[] {
    return classes.filter(c => ClassType.fromName(c.sectionidentifier) == type);
}

export function getNumberOfClassesOfType(classes: any[], type: ClassType) {
    return getClassesOfType(classes, type).length;
}
