import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import { clsNames, isEmpty } from '../utlis'
import { Icon } from './icon'

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
    onChange: (v: any, values?: any) => void;
}

export const Select = (props: SelectProps) => {
    const [onFocus, setOnFocus] = useState(false)
    const [onOpen, setOnOpen] = useState(false)

    const [search, setSearch] = useState('')

    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })

    const dropdownRef: any = useRef(null)
    const selectRef: any = useRef(null)

    const onClear = () => {
        props.onChange(null)
        setOnFocus(false)
    }

    const onChange = (id: any) => {
        const value = props.options.find((d) => d.id.toString() === id.toString())
        props.onChange(id, value)
        setOnFocus(false)
        setOnOpen(false)
        setSearch('')
    }

    const { vId, vName } = useMemo(() => {
        let output = { vId: '', vName: '' }
        if (!isEmpty(props.value)) {
            if (typeof props.value === 'object') {
                output.vName = props.value?.name || props.value?.text || ''
                output.vId = props.value?.id || ''
            }
            else {
                const v = props.options.find(
                    (d) => d.id.toString() === (props.value || '').toString()
                )
                if (v) {
                    output.vId = v.id || ''
                    output.vName = v.name || ''
                }
            }
        }
        if (onFocus) output.vName = search
        return output
    }, [props.value, search])

    const options = useMemo(() => {
        let os = props.options
        if (search) os = os.filter((d) => (d.name || d.text).includes(search))
        return os
    }, [props.options, props.multiple, props.value, search])

    const handleToggle = () => {
        if (!onOpen && selectRef.current) {
            const rect = selectRef.current.getBoundingClientRect()
            setCoords({
                top: rect.bottom + window.scrollY - 8,
                left: rect.left + window.scrollX,
                width: rect.width,
            })
        }
        setOnOpen(!onOpen)
    }

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                dropdownRef.current &&
                selectRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !selectRef.current.contains(event.target)
            ) {
                setOnOpen(false)
                setSearch('')
                setOnFocus(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const dropdownRender = <div
        ref={dropdownRef}
        className={clsNames('z-[9999] fixed flex flex-col max-h-56 overflow-y-auto border border-gray-300 rounded bg-white shadow-lg scrollable-div', props.className)}
        style={{ top: coords.top, left: coords.left, width: coords.width }}>

        {options.length > 0 ? options.map((d, i: number) => <div
            key={'item_' + i}
            className={clsNames(
                'text-sm p-2 cursor-pointer hover:bg-blue-100',
                vId && vId === d.id && 'bg-blue-200'
            )}
            onClick={() => onChange(d.id)}>
            {d.name}
        </div>) : <div
            className={'text-sm text-gray-300 p-2'}>
            ไม่พบข้อมูล...
            </div>}
    </div>

    return <div className={clsNames('relative', props.className)}>
        <div ref={selectRef}
             className={clsNames('border border-gray-300 rounded bg-white focus-within:ring-2 focus-within:ring-blue-500 w-full', props.className)}>
            <label className={clsNames(
                onFocus || props.value ? '-translate-y-4 text-xs' : 'text-sm',
                'absolute left-2 top-2 bg-white text-gray-500 transition-all duration-300 pointer-events-none'
            )}>
                {props.label}
            </label>

            <input
                value={vName}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOnFocus(true)}
                onClick={handleToggle}
                className="text-ellipsis text-sm w-full p-2 rounded border-none outline-none focus:ring-0 pr-1"/>


            {!props.noClear && vId && <Icon name="x" className={clsNames(
                'absolute right-1.5 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )} onClick={() => onClear()}
            />}

            {!onFocus && !onOpen && !vId && <Icon name="chevron-down" className={clsNames(
                'absolute right-1.5 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )} onClick={() => setOnOpen((prev: any) => !prev)}
            />}

        </div>

        {onOpen && ReactDOM.createPortal(dropdownRender, document.body)}
    </div>

}