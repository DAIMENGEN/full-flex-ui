export class StyleUtil {

    static numberToPixels(value: number): string {
        return value + "px";
    }
    
    static pixelsToNumber(value: string): number {
        const match = value.match(/-?\d+/);
        if (match) {
            return parseInt(match[0], 10);
        }
        return 0;
    }
}