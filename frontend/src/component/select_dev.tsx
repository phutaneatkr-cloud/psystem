import React, { useEffect, useMemo, useRef, useState } from 'react'
import { clsNames, num } from '../utlis'

const optionProps = [
    { id: 1, name: 'Car' },
    { id: 2, name: 'Airplane' },
    { id: 3, name: 'Rocket' },
]

export function MultiSelect (props: any) {

    const [selecteds, setSelecteds] = useState<(string)[]>([])
    const [onOpen, setOnOpen] = useState(false)

    const dropdownRef: any = useRef(null)

    const handleSelectChange = (value: any) => {
        setSelecteds((prev: any) =>
            prev.includes(value)
                ? prev.filter((option: any) => option !== value)
                : [...prev, value]
        )
    }

    const renderCustomText = () => {
        if (selecteds.length === 0) {
            return 'Select options' // ข้อความเมื่อไม่มีการเลือก
        }
        return selecteds.join(', ') // แสดงรายการที่เลือกแบบคั่นด้วย comma
    }

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOnOpen(false) // ปิด dropdown เมื่อคลิกนอกคอมโพเนนต์
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const options = useMemo(() => {
        return optionProps.filter((d: any) => !selecteds.includes(d.id))
    }, [selecteds, optionProps])

    return <div ref={dropdownRef} className={clsNames('-input', 'relative', props.className)}>
        <div className="custom-select border w-full border-gray-300 text-sm rounded p-2 cursor-pointer focus:ring-2 focus:ring-blue-500"
             onClick={() => setOnOpen((prev: any) => !prev)}>
            {(() => {
                if (selecteds.length > 0) {
                    return <div className={'flex flex-wrap'}>
                        {selecteds.map((item, idx) => {
                            const option = optionProps.find((d: any) =>
                                typeof d.id === 'number'
                                    ? num(d.id) === num(item)
                                    : d.id.toString() === item.toString()
                            )
                            return (
                                <div
                                    key={idx}
                                    className={'z-20 text-xs bg-gray-100 hover:bg-gray-300 rounded-lg px-2 py-1 mr-1 flex items-center'}
                                >
                                    {option?.name}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation() // หยุดการแพร่กระจาย event
                                            handleSelectChange(item) // ลบตัวเลือก
                                        }}
                                        className="ml-2  text-red-400 hover:text-red-600">
                                        &times;
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                }
                return 'Select options'
            })()}
        </div>
        <select
            multiple
            value={selecteds}
            onChange={(e) => {
                const options: any = Array.from(e.target.selectedOptions, (option) => option.value)
                setSelecteds(options)
            }}
            className={clsNames('hidden', props.className)}>
            {optionProps.map((d, i: number) => (
                <option key={'item_' + i} value={d.id}>
                    {d.name}
                </option>
            ))}
        </select>
        {onOpen && <div className={clsNames('absolute z-10 bg-white mt-1 rounded w-full', options.length > 0 && 'border')}>
            {options
                .map((d, i: number) => (
                <div
                    key={'item_' + i}
                    className={clsNames(
                        'text-sm p-2 cursor-pointer hover:bg-blue-100',
                        selecteds.includes(d.id.toString()) && 'bg-blue-200'
                    )}
                    onClick={() => handleSelectChange(d.id)}>
                    {d.name}
                </div>
            ))}
        </div>}
    </div>
}