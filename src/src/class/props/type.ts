// What kind of class this is
export class ClassType {
    private constructor(
        public readonly string: string,
        public readonly gpaModifier: (num: number) => number,
        public readonly reverseGpaModifier: (num: number) => number,
        // How many "classes" this class counts as
        public readonly classWeight: number = 1
    ) {}

    toString() {
        return this.string;
    }

    public static readonly REGULAR = new ClassType(
        "Regular",
        (num) => num,
        (num) => num
    );
    public static readonly AP = new ClassType(
        "AP",
        (num) => num + 1,
        (num) => num - 1
    );
    public static readonly HONORS = new ClassType(
        "Honors",
        (num) => num + 1,
        (num) => num - 1
    );
    public static readonly UNCOUNTED = new ClassType(
        "Uncounted",
        (num) => 0,
        (num) => 0,
        0
    );

    public static readonly type = [
        this.REGULAR,
        this.AP,
        this.HONORS,
        this.UNCOUNTED,
    ];

    private static readonly classStringMatches: Record<string, ClassType> = {
        ap: this.AP,
        honors: this.HONORS,
        ["physical education"]: this.UNCOUNTED,
        ["study hall"]: this.UNCOUNTED,
    };

    public static getTypeFor(name: string): ClassType {
        name = name.toLowerCase().trim();
        for (const string of Object.keys(this.classStringMatches)) {
            if (name.startsWith(string)) {
                return this.classStringMatches[string];
            }
        }

        return this.REGULAR;
    }
}
