interface SelectProps {
    label?: string;
    value?: (string | string[]) | number | undefined | any;
    className?: string;
    form?: boolean;
    multiple?: boolean;
    sm?: boolean;
    noClear?: boolean;
    note?: string;
    options: any[],
    onChange: (value: any, e?: KeyboardEvent) => void;
}

export const Selects = (props: SelectProps) => {

    return <div>
        xxx
    </div>
}