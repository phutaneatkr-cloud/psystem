import { useMemo, useRef, useState } from 'react'
import { clsNames } from '../utlis'

import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/material_blue.css' // สามารถเปลี่ยนธีมได้ตามต้องการ
import 'flatpickr/dist/l10n/th.js' // นำเข้าภาษาไทย

interface InputDateProps {
    label?: string;
    value?: string | number;
    defValue?: string | number;
    className?: string;
    type?: 'text' | 'number' | 'password';
    form?: boolean;
    time?: boolean,
    noClear?: boolean;
    onChange: (value: Date, e?: KeyboardEvent) => void;
}

export const InputDate = (props: InputDateProps) => {
    const datePickerRef: any = useRef(null)

    const handleClear = () => {
        if (datePickerRef.current) {
            datePickerRef.current.flatpickr.clear() // ใช้ clear() ของ Flatpickr เพื่อเคลียร์วันที่
        }
    }

    const vValue = useMemo(() => {
        return typeof props.value === 'string' ? new Date(props.value) : props.value
    }, [props.value])

    return <div className={clsNames('mt-3 relative flex-1', props.className)}>

        <label
            className={clsNames(
                'absolute left-2 top-2 bg-white  text-gray-500 transition-all duration-300',
                props.value ? '-translate-y-4 text-xs' : 'text-sm',
                'pointer-events-none'
            )}>
            {props.label}
        </label>

        <Flatpickr
            ref={datePickerRef}
            //placeholder={props.label}
            className={clsNames(
                props.className,
                'border border-gray-300 text-sm rounded p-2 w-full focus:outline-blue-500'
            )}
            value={vValue} // ค่าที่เลือก
            onChange={(values) => {
                props.onChange(values[0])
            }} // อัปเดตค่าที่เลือก
            options={{
                locale: 'th', // ตั้งค่าภาษาไทย
                //mode: "range",
                //animate: true,
                time_24hr: true,
                enableTime: props.time,
                //inline: true,
                //defaultDate: new Date(),
                //wrap: true,
                //allowInput: true,
                dateFormat: props.time ? 'd/m/Y H:i' : 'd/m/Y',
                disableMobile: true,
                onReady: (selectedDates, dateStr, instance) => {
                    const clearButton = instance.element.nextElementSibling // ค้นหาปุ่ม clear
                    /*clearButton.addEventListener("click", () => {
                    instance.clear(); // เรียกใช้ฟังก์ชัน clear ของ Flatpickr
                  });*/
                },
            }}
        />
        {!props.noClear && vValue && <button type="button" onClick={handleClear} className="flatpickr-clear-button" title="ลบ">
            &#10005;
        </button>}
    </div>

}
