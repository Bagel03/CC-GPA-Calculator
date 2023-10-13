export const ClassType = {
    REGULAR: 0,
    HONORS: 1,
    AP: 2,
    THEOLOGY: 3,
    UNMARKED: 4,
} as const;
export type ClassType = (typeof ClassType)[keyof typeof ClassType];

const THEOLOGY = ["theology", "revelation", "chistology", "paschal mystery", "ecclesiology",  /* ... todo */]
const IGNORED = ["physical education", "study hall", "hr", "quiz bowl"];
export function getClassTypeFromName(name: string) {
    const words = name.toLowerCase().split(" ");

    if (IGNORED.some((i) => name.toLowerCase().includes(i)))
        return ClassType.UNMARKED;
    if (THEOLOGY.some((i) => name.toLowerCase().includes(i)))
        return ClassType.THEOLOGY;

    if (words.includes("ap")) return ClassType.AP;
    if (words.includes("honors")) return ClassType.HONORS;
    if(words.includes())
    return ClassType.REGULAR;
}

export function getClassTypeName(type: ClassType) {
    switch (type) {
        case ClassType.AP:
            return "AP";
        case ClassType.HONORS:
            return "Honors";
        case ClassType.REGULAR:
            return "Regular";
        case ClassType.UNMARKED:
            return "Unmarked";
        case ClassType.THEOLOGY:
            return "Theology"
    }
}

export function getClassesOfType(classes: any[], type: ClassType): any[] {
    return classes.filter(
        (c) => getClassTypeFromName(c.sectionidentifier) == type
    );
}

export function getNumberOfClassesOfType(classes: any[], type: ClassType) {
    return getClassesOfType(classes, type).length;
}
