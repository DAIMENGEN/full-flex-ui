import React, {useMemo, useRef, useState} from "react";
import {SelectOption, SelectProps} from "../models";
import debounce from "lodash.debounce";
import {Select, Spin} from "antd";

export const FullSearchSelect: React.FC<SelectProps> = (props) => {

    const {debounceTimeout = 800, value, width, onChange, fetchOptions} = props;

    const fetchRef = useRef(0);

    const [fetching, setFetching] = useState(false);

    const [options, setOptions] = useState<Array<SelectOption>>(value ? [value] : []);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((options) => {
                if (fetchId !== fetchRef.current) return;
                options && setOptions(options);
                setFetching(false);
            });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    const trigger = (value: SelectOption) => onChange && onChange(value, value);

    return (
        <Select style={{width: width}}
                    labelInValue
                    showSearch
                    defaultValue={value}
                    filterOption={false}
                    onSearch={debounceFetcher}
                    notFoundContent={fetching ? <Spin size="small"/> : null}
                    onChange={trigger}
                    options={options}/>
    )
}