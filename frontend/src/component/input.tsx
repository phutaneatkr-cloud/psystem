import React, { FocusEventHandler, useState } from 'react'
import { RefreshCcw } from 'lucide-react'

import { clsNames } from '../utlis'

interface InputProps {
    label?: string;
    value?: string | number;
    defValue?: string | number;
    className?: string;
    form?: boolean;
    placeholder?: string;
    note?: string;
    multiple?: boolean | number;
    type?: 'text' | 'number' | 'password';
    onChange: (value: string, e?: KeyboardEvent) => void;
    onBlur?: (value: string, e?: KeyboardEvent) => void;
    onRefresh?: () => void;
}

interface InputSearchProps {
    value?: string | number;
    className?: string;
    placeholder?: string;
    onChange: (value: string, e?: KeyboardEvent) => void;
    onRefresh?: () => void;
}

export const InputSearch = (props: InputSearchProps) => {
    return <div className="flex items-center border border-gray-300 rounded w-full focus-within:ring-2 focus-within:ring-blue-500">

        <input
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value)}
            placeholder={props.placeholder || undefined}
            className={`flex-1 text-sm p-2 focus:outline-none bg-transparent pr-1 pl-2`}/>

        {props.onRefresh && <div className="pr-2 text-gray-500 flex items-center">
            <RefreshCcw
                size={16}
                className="cursor-pointer text-green-500 hover:text-green-600 transition-colors duration-200"
                onClick={props.onRefresh}
            />
        </div>}

    </div>
}

export const Input = (props: InputProps) => {

    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = () => setIsFocused(true)

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsFocused(false)
        props.onBlur?.(e.target.value)
    }
    const handleBlurTextArea = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!e.target.value) setIsFocused(false)
        props.onBlur?.(e.target.value)
    }

    return <div className={clsNames('relative ', props.className)}>

        <label
            className={clsNames(
                isFocused || props.value ? '-translate-y-4 text-xs' : 'text-sm',
                'absolute left-2 top-2 bg-white  text-gray-500 transition-all duration-300',
                'pointer-events-none', props.className
            )} style={{ width: 'fit-content' }}>
            {props.label}
        </label>

        {props.multiple ?
            <textarea
                rows={typeof props.multiple == 'number' ? props.multiple : 2}
                value={props.value}
                onFocus={handleFocus}
                onChange={(e) => props.onChange?.(e.target.value)}
                onBlur={handleBlurTextArea}
                className={clsNames(props.className, 'scrollable-div border border-gray-300 text-sm rounded p-2 w-full focus:outline-blue-500')}/> :
            <input
                placeholder={props.placeholder || undefined}
                value={props.value}
                type={props.type || 'text'}
                onFocus={handleFocus}
                onChange={(e) => props.onChange?.(e.target.value)}
                onBlur={handleBlur}
                className={clsNames(props.className, 'border border-gray-300 text-sm rounded p-2 w-full focus:outline-blue-500')}
            />}
        {props.note && <span className={'ml-auto text-xs text-gray-400'}>{props.note}</span>}
    </div>
}

//border border-gray-300 rounded-lg px-4 pt-5 pb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500
