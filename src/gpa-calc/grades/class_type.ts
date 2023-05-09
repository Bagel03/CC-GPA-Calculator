export const ClassType = {
    REGULAR: 0,
    HONORS: 1,
    AP: 2,
    UNMARKED: 3
} as const;
export type ClassType = (typeof ClassType)[keyof typeof ClassType];

const IGNORED = ["physical education", "study hall", "hr", "quiz bowl"];
export function getClassTypeFromName(name: string) {
    const words = name.toLowerCase().split(" ");

    if (IGNORED.some(i => name.toLowerCase().includes(i))) return ClassType.UNMARKED;

    if (words.includes("ap")) return ClassType.AP;
    if (words.includes("honors")) return ClassType.HONORS;
    return ClassType.REGULAR;
}

export function getClassTypeName(type: ClassType) {
    switch (type) {
        case ClassType.AP: return "AP";
        case ClassType.HONORS: return "Honors";
        case ClassType.REGULAR: return "Regular";
        case ClassType.UNMARKED: return "Unmarked";

    }
}

export function getNumberOfClassesOfType(classes: any[], type: ClassType) {
    return classes.filter(c => getClassTypeFromName(c.sectionidentifier) == type).length;
}