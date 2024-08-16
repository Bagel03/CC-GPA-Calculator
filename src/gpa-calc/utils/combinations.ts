// copied from stack overflow
export function getCombinations<T>(valuesArray: T[]): T[][] {
    const combi: T[][] = [];
    let temp: T[] = [];
    const slent = Math.pow(2, valuesArray.length);

    for (let i = 0; i < slent; i++) {
        temp = [];
        for (let j = 0; j < valuesArray.length; j++) {
            if (i & Math.pow(2, j)) {
                temp.push(valuesArray[j]);
            }
        }
        if (temp.length > 0) {
            combi.push(temp);
        }
    }
    return combi;
}
