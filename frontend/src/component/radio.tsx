import React, { useState } from 'react'
import { clsNames, num } from '../utlis'

interface RadioProps {
    label?: string;
    value?: string | number | null | undefined;
    className?: string;
    form?: boolean;
    sm?: boolean;
    note?: string;
    options: any[],
    onChange: (value: any, e?: KeyboardEvent) => void;
}

export const Radio = (props: RadioProps) => {

    const onChange = (value: any, e?: KeyboardEvent) => {
        onClick(num(value.target.value))
    }

    const onClick = (id: number) => {
        const v = props.options.find(d => d.id === id)
        props.onChange(id, v)
    }

    return <div className={clsNames('relative', props.className)}>

        <label className={'text-xs text-gray-500'}>
            {props.label}
        </label>

        <div className={'flex w-full text-center text-sm'}>
            {props.options.map((e, i: number) => {
                return <div key={'item_' + i} className={'flex items-center cursor-pointer mr-1'} onClick={() => onClick(e.id)}>
                    <input
                        className={'mr-1'}
                        value={e.id}
                        checked={e.id === props.value}
                        name={'group1'}
                        type="radio"
                        onChange={onChange}/>
                    <span className={clsNames(props.sm ? 'text-sm' : 'text-sm', 'cursor-pointer hover:text-blue-300')}>
                        {e.name || e.text}
                    </span>
                </div>
            })}
        </div>
    </div>
}