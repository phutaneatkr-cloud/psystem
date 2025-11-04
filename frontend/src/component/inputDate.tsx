import React, { forwardRef, useState } from 'react'

import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { th } from 'date-fns/locale/th'

registerLocale('th', th)

import { Icon } from './icon'
import { clsNames } from '../utlis'

interface InputDateProps {
    label?: string
    value?: Date | string | number | null
    className?: string
    placeholder?: string
    form?: boolean
    time?: boolean
    timeScale?: number // จำนวนนาทีต่อช่วง (default 10)
    noClear?: boolean
    onChange: (value: Date, e?: KeyboardEvent) => void
    onBlur?: (value: string, e?: KeyboardEvent) => void
}

const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onFocus, onBlur, placeholder, displayValue }: any, ref) => (
        <input
            readOnly
            ref={ref}
            placeholder={placeholder}
            value={displayValue || ''}
            onClick={onClick}
            onFocus={onFocus}
            onBlur={onBlur}
            className={clsNames(
                'border border-gray-300 text-sm rounded p-2 w-full pr-8',
                'focus:outline-blue-500 cursor-pointer'
            )}
        />
    )
)

export const InputDate = (props: InputDateProps) => {
    const [onFocus, setOnFocus] = useState(false)

    const parseInitialValue = () => {
        if (!props.value) return null

        let date: Date

        if (typeof props.value === 'number') date = new Date(props.value)
        else if (typeof props.value === 'string') date = new Date(props.value)
        else date = new Date(props.value)

        return isNaN(date.getTime()) ? null : date
    }

    const [selectedDate, setSelectedDate] = useState<Date | null>(parseInitialValue())

    const handleChange = (date: Date | null, e?: any) => {
        setSelectedDate(date)
        if (date) props.onChange(date, e)
    }

    const handleClear = () => {
        setSelectedDate(null)
        props.onChange(new Date(''), undefined)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!e.target.value) setOnFocus(false)
        props.onBlur?.(e.target.value, e as any)
    }

    const handleFocus = () => setOnFocus(true)

    const formatDateToBuddhistEra = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear() + 543

        if (props.time) {
            const hour = date.getHours().toString().padStart(2, '0')
            const minute = date.getMinutes().toString().padStart(2, '0')
            return `${day}/${month}/${year} ${hour}:${minute}`
        }

        return `${day}/${month}/${year}`
    }

    const timeScale = props.timeScale || 10

    const CustomHeader = ({ date, changeYear, changeMonth, backMonth, nextMonth }: any) => {

        const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

        const currentYear = date.getFullYear() + 543
        const currentMonth = date.getMonth()

        const years = createYearRange(currentYear, 100, 100)

        return <div className="flex items-center justify-between gap-2 h-6 px-2 py-1">

            <Icon name="chevron-left" onClick={backMonth}/>

            <div className="flex items-center gap-1 flex-1 justify-center">
                <select
                    value={currentMonth}
                    onChange={(e) => changeMonth(Number(e.target.value))}
                    className="font-semibold bg-transparent  rounded px-2 py-1 cursor-pointer hover:text-gray-600 focus:outline-none focus:border-blue-300">
                    {months.map((m, i) => (
                        <option className={clsNames(currentMonth === i && 'bg-blue-400 text-white')} key={i} value={i}>{m}</option>
                    ))}
                </select>

                <select
                    value={currentYear}
                    onChange={(e) => changeYear(Number(e.target.value) - 543)}
                    className="font-semibold bg-transparent border-gray-300 rounded px-2 py-1 cursor-pointer hover:text-gray-600 focus:outline-none focus:border-blue-300">
                    {years.map((year) => (
                        <option className={clsNames(currentYear === year && 'bg-blue-400 text-white')} key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <Icon name="chevron-right" onClick={nextMonth}/>
        </div>
    }

    return <div className={clsNames('relative', props.className)}>


        <label
            className={clsNames(
                onFocus || selectedDate ? '-translate-y-4 text-xs' : 'text-sm',
                'absolute left-2 top-2 bg-white text-gray-500 transition-all duration-300',
                'pointer-events-none z-10'
            )}
            style={{ width: 'fit-content' }}>
            {props.label}
        </label>

        <DatePicker
            calendarClassName="datepicker-horizontal"
            wrapperClassName="w-full"
            className="w-full"
            selected={selectedDate}
            onChange={handleChange}
            onCalendarOpen={() => setOnFocus(true)}
            onCalendarClose={() => setOnFocus(false)}
            showTimeSelect={props.time}
            timeIntervals={timeScale}
            timeCaption="เวลา"
            dateFormat={props.time ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy'}
            placeholderText={props.placeholder}
            locale="th"
            renderCustomHeader={CustomHeader}
            popperContainer={({ children }) => (
                <div style={{ position: 'fixed', zIndex: 100 }}>{children}</div>
            )}
            customInput={
                <CustomInput
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={props.placeholder}
                    displayValue={selectedDate && formatDateToBuddhistEra(selectedDate)}/>
            }
        />

        {!props.noClear && selectedDate && <Icon
            name="x"
            className={clsNames(
                'absolute right-1.5 top-2.5 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )}
            onClick={handleClear}
        />
        }
    </div>

}

function createYearRange (cyear: number, syear: number, eyear: number) {
    const startYear = cyear - syear
    const endYear = cyear + eyear
    const yearArray = []

    for (let year = startYear; year <= endYear; year++) {
        yearArray.push(year)
    }

    return yearArray
}