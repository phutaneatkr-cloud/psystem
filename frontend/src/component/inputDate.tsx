import React, { useState } from 'react'

import DatePicker, { registerLocale } from 'react-datepicker'
import { format, getYear } from "date-fns";
import 'react-datepicker/dist/react-datepicker.css'

import { th } from 'date-fns/locale/th';
registerLocale('th', th)

import { Icon } from './icon'
import { clsNames } from '../utlis'

interface InputDateProps {
    label?: string;
    value?: string | number;
    className?: string;
    placeholder?: string;
    form?: boolean;
    time?: boolean,
    noClear?: boolean;
    onChange: (value: Date, e?: KeyboardEvent) => void;
    onBlur?: (value: string, e?: KeyboardEvent) => void;
}

export const InputDate = (props: InputDateProps) => {

    const [isFocused, setIsFocused] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        props.value ? new Date(props.value) : null
    )

    const handleChange = (date: Date | null, e?: any) => {
        setSelectedDate(date)
        if (date) props.onChange(date, e)
    }

    const handleClear = () => {
        setSelectedDate(null)
        props.onChange(new Date(''), undefined)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.target.value) setIsFocused(false)
    }

    const handleFocus = () => setIsFocused(true)

    return <div className={clsNames('relative w-full', props.className)}>
            <label
                className={clsNames(
                    isFocused || selectedDate ? '-translate-y-4 text-xs' : 'text-sm',
                    'absolute left-2 top-2 bg-white text-gray-500 transition-all duration-300',
                    'pointer-events-none z-10' // ← เพิ่ม z-index
                )}
                style={{ width: 'fit-content' }}>
                {props.label}
            </label>

            <DatePicker
                wrapperClassName="w-full"
                className="w-full"
                selected={selectedDate}
                onChange={handleChange}
                onCalendarOpen={() => setIsFocused(true)}
                onCalendarClose={() => setIsFocused(false)}
                showTimeSelect={props.time}
                dateFormat={props.time ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
                placeholderText={props.placeholder}
                locale={'th'}
                customInput={
                    <input
                        readOnly
                        placeholder={props.placeholder || undefined}
                        value={
                            selectedDate
                                ? selectedDate.toLocaleDateString('th-TH', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })
                                : ''
                        }
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        className={clsNames(
                            'border border-gray-300 text-sm rounded p-2 w-full pr-8',
                            'focus:outline-blue-500 cursor-pointer'
                        )}
                    />
                }
            />


            {!props.noClear && selectedDate && <Icon name="x" className={clsNames(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )} onClick={handleClear}
            />}
        </div>

}