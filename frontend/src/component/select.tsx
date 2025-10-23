import React, { useEffect, useMemo, useRef, useState } from 'react'
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
    onChange: (value: any, values?: any[]) => void;
}

export const Select = (props: SelectProps) => {

    const [onFocus, setOnFocus] = useState(false)
    const [onOpen, setOnOpen] = useState(false)

    const [search, setSearch] = useState('')

    const dropdownRef: any = useRef(null)
    const selectRef: any = useRef(null)

    const onClear = () => {
        props.onChange(props.multiple ? [] : null)
        setOnFocus(false)
    }

    const onClearItem = (d: any) => {
        const ids = valueIds.filter((v: any) => v !== d)
        const values: any = props.options.filter((o: any) => ids.indexOf(o.id) >= 0)
        props.onChange(ids, values)
    }

    const onChange = (id: any) => {
        if (props.multiple) {
            const ids = [...valueIds, id]
            const values: any = props.options.filter((o: any) => ids.indexOf(o.id) >= 0)
            props.onChange(ids, values)
        }
        else {
            const value = props.options.find(d => d.id.toString() === id.toString())
            props.onChange(id, value)
            setOnFocus(false)
            setOnOpen(false)
        }
        setSearch('')
    }

    const { vId, vName } = useMemo(() => {
        let output = {
            vId: '',
            vName: ''
        }
        if (!isEmpty(props.value)) {
            if (typeof props.value === 'object') {
                output.vName = props.value?.name || props.value?.text || ''
                output.vId = props.value?.id || ''
            }
            else {
                const v = props.options.find(d => d.id.toString() === (props.value || '').toString())
                output.vId = v.id || ''
                output.vName = v.name || ''
            }
        }
        if (onFocus) output.vName = search
        return output
    }, [props.value, search])

    const { valueIds, valueNames }: any = useMemo(() => {
        const valueIds = props.multiple ? (props.value || []).map((d: any) => d.id || d) : []
        return {
            valueIds,
            valueNames: [],
        }
    }, [props.value])

    const options = useMemo(() => {
        let os = props.options
        if (props.multiple) os = os.filter((o: any) => valueIds.indexOf(o.id) === -1)
        if (search) os = os.filter(d => (d.name || d.text).includes(search))
        return os
    }, [props.options, props.multiple, props.value, search])

    const selected = useMemo(() => {

        return props.multiple ? props.options.filter(o => valueIds.indexOf(o.id) >= 0) || [] : []
    }, [props.options, valueIds])

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && selectRef.current) {
                if (!dropdownRef.current.contains(event.target) && !selectRef.current.contains(event.target)) {
                    setOnOpen(false)
                    setSearch('')
                    setOnFocus(false)
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return <div className={clsNames('relative', props.className)}>

        <div ref={selectRef} className={clsNames(
            'border border-gray-300 rounded',
            'rounded bg-white  focus-within:ring-2 focus-within:ring-blue-500 w-full',
            props.className
        )}>

            <label
                className={clsNames(
                    onFocus || (!props.multiple ? (props.value) : selected.length > 0) ? '-translate-y-4 text-xs' : 'text-sm',
                    'absolute left-2 top-2 bg-white  text-gray-500 transition-all duration-300',
                    'pointer-events-none',
                )}>
                {props.label}
            </label>

            <input
                value={vName}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOnFocus(true)}
                onClick={() => setOnOpen((prev: any) => !prev)}
                className={clsNames('text-ellipsis text-sm w-full p-2 rounded border-none outline-none focus:ring-0 pr-1')}
            />

            {!props.noClear && vId && <Icon name="x" className={clsNames(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )} onClick={() => onClear()}
            />}

            {!onFocus && !onOpen && !vId && <Icon name="chevron-down" className={clsNames(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-400 hover:text-gray-600'
            )} onClick={() => setOnOpen((prev: any) => !prev)}
            />}
        </div>

        {onOpen && <div ref={dropdownRef} className={clsNames(
            'flex flex-col max-h-56 overflow-y-scroll scrollable-div',
            'border border-gray-300 rounded',
            'rounded bg-white  focus-within:ring-2 focus-within:ring-blue-500 w-full',
            props.className
        )}>
            {options.map((d, i: number) => (
                <div key={'item_' + i}
                     className={clsNames('text-sm p-2 cursor-pointer hover:bg-blue-100', vId && vId === d.id && 'bg-blue-200')}
                     onClick={() => onChange(d.id)}>
                    {d.name}
                </div>
            ))}
        </div>}

    </div>
}

/*

        {props.multiple ? <div ref={selectRef} className={clsNames(
            'flex h-fit',
            'border border-gray-300 rounded',
            'rounded bg-white  focus-within:ring-2 focus-within:ring-blue-500',
            props.className
        )} style={{ marginTop: '0' }}>

            {selected.length > 0 && <div className={'bg-white flex flex-wrap w-full pt-2'}>
                {selected.map((d: any, i: number) => {
                    return <div key={'item_' + i} className={'flex rounded items-center ml-2 px-1 mb-1 w-fit text-xs bg-gray-200 hover:bg-gray-300'}>
                        <span>{d.name || d.text}</span>
                        <button onClick={() => onClearItem(d.id || d)}>
                            <i className="ml-1 fa-solid fa-close text-xs text-red-300 hover:text-red-400"/>
                        </button>
                    </div>
                })}

                <input
                    value={vName}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setOnFocus(true)}
                    onBlur={onBlur}
                    onClick={() => setOnOpen((prev: any) => !prev)}
                    className={clsNames(
                        'text-ellipsis outline-0 text-sm w-16 ml-2 mb-1',
                    )}
                />
            </div>}

            <label
                className={clsNames(
                    onFocus || selected.length > 0 ? '-translate-y-4 text-xs' : 'text-sm',
                    'absolute left-2 top-2 bg-white  text-gray-500 transition-all duration-300',
                    'pointer-events-none',
                )}>
                {props.label}
            </label>

            {selected.length === 0 && <input
                value={vName}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setOnFocus(true)}
                onBlur={onBlur}
                onClick={() => setOnOpen((prev: any) => !prev)}
                className={clsNames(
                    'text-ellipsis text-sm w-full p-2 rounded border-none outline-none focus:ring-0 pr-1',
                )}
            />}

            {valueIds.length > 0 && <button onClick={() => onClear()}>
                <i className="px-2 fa-solid fa-close text-sm text-gray-400 hover:text-red-400"/>
            </button>}

            <button onClick={() => setOnOpen((prev: any) => !prev)}>
                <i className="border-l-2 px-2 fa-solid  fa-chevron-down text-sm text-gray-400"/>
            </button>

        </div> : }
*/