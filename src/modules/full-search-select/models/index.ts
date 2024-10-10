export type SelectOption = { label: string; value: string; }

export type SelectProps = {
    value?: SelectOption;
    width?: number | string;
    debounceTimeout?: number;
    fetchOptions: (value: string) => Promise<Array<SelectOption>>;
    onChange?: (value: SelectOption, options: SelectOption | Array<SelectOption>) => void;
}