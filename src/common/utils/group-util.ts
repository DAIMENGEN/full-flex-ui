export class GroupUtil {
    static groupArray<T>(arr: Array<T>, func: (item: T) => string): Record<string, Array<T>> {
        const groupedResult: Record<string, T[]> = {};
        arr.forEach(item => {
            const key = func(item);
            if (groupedResult[key]) {
                groupedResult[key].push(item);
            } else {
                groupedResult[key] = [item];
            }
        });
        return groupedResult;
    }
}