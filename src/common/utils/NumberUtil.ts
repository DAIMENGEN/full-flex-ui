export class NumberUtil {
    static parse(input: number | string): number {
        if (typeof input === "number") {
            return input;
        } else {
            const numberValue = input.replace(/[^\d.-]/g, '');
            return parseInt(numberValue);
        }
    }
}