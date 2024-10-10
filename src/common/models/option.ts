export class Option<T> {
    private readonly value: T | undefined;

    private constructor(value?: T) {
        this.value = value;
    }

    public static Some<T>(value: T): Option<T> {
        return new Option(value);
    }

    public static None<T>(): Option<T> {
        return new Option();
    }

    public static fromNullable<T>(value: T | null | undefined): Option<T> {
        if (value === null || value === undefined) {
            return Option.None();
        } else {
            return Option.Some(value);
        }
    }

    public isDefined(): boolean {
        return this.value !== undefined;
    }

    public get(): T {
        if (this.value === undefined) {
            throw new Error('Option is empty');
        }
        return this.value;
    }

    public getOrElse(defaultValue: T): T {
        return this.isDefined() ? this.value! : defaultValue;
    }
}