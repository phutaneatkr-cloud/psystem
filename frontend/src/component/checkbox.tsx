import React from 'react'

import { clsNames } from '../utlis'
import { T_Options, T_ValueCheckbox, T_Value } from '../type/type'

interface I_CheckboxProps {
    label?: string;
    checked?: boolean | number | string[] | number[] | T_Value[]
    text?: string
    className?: string
    vertical?: boolean
    form?: boolean
    items?: T_Options,
    onChange: (value: T_ValueCheckbox | T_ValueCheckbox[], values: T_ValueCheckbox[]) => void
}

export const Checkbox = (props: I_CheckboxProps) => {

    const onChange = (items: T_Value[], datas: (string | number)[], vId: string, v: boolean) => {
        const idValue = isNaN(Number(vId)) ? vId : Number(vId)

        const vItem = items.find(item => String(item.id) === String(idValue))
        if (!vItem) return

        const updatedIds = v ? [...new Set([...datas.map(d => String(d)), String(vItem.id)])] : datas.map(d => String(d)).filter(d => d !== String(vItem.id))
        const vDatas = updatedIds.map(d => isNaN(Number(d)) ? d : Number(d))

        const vDatasRaws: T_Value[] = vDatas
            .map(id => {
                const found = items.find(i => String(i.id) === String(id))
                if (!found) return null
                return {
                    id: isNaN(Number(found.id)) ? found.id : Number(found.id),
                    name: found.name
                }
            })
            .filter((x): x is T_Value => x !== null)

        props.onChange(vDatas, vDatasRaws)
    }

    return <div className={clsNames('relative ', props.className)}>
        {props.label && <div className={'text-xs text-gray-500 mb-1'}>
            {props.label}
        </div>}

        {(() => {

            if (props.items && props.items.length > 0 && !props.text) {

                const items: T_Value[] = Array.isArray(props.items)
                    ? props.items.map(item =>
                        typeof item === 'object' && item !== null && 'id' in item
                            ? { id: item.id, name: item.name }
                            : { id: item, name: String(item) }
                    )
                    : []

                const datas: string[] = []
                if (props.checked) {
                    if (typeof props.checked !== 'boolean' && typeof props.checked !== 'number') {
                        props.checked.forEach(item => {
                            if (typeof item === 'string' || typeof item === 'number') {
                                datas.push(String(item))
                            }
                            else {
                                datas.push(String(item.id))
                            }
                        })
                    }
                }

                return <div className={clsNames('flex', props.vertical ? 'flex-col' : 'space-x-2')}>
                    {items.map((item, i) => {
                        const v = datas.indexOf(String(item.id)) >= 0
                        return <div key={'item_' + i} className={'flex'}>
                            <input style={{ width: 15, height: 15 }} className={'my-auto'} type={'checkbox'}
                                   checked={v} onChange={() => onChange(items, datas, String(item?.id), !v)}/>
                            <div className={'text-sm ml-2 cursor-pointer hover:text-blue-300'} onClick={() => onChange(items, datas, String(item?.id), !v)}>{item?.name}</div>
                        </div>
                    })}
                </div>
            }
            else {
                const v = typeof props.checked === 'boolean' ? props.checked : props.checked === 1
                return <div className={'flex w-full'}>
                    <input style={{ width: 15, height: 15 }} className={'my-auto'} type={'checkbox'}
                           checked={v} onChange={() => props.onChange(!v, [])}/>
                    <div className={'text-sm ml-2 cursor-pointer hover:text-blue-300'} onClick={() => props.onChange(!v, [])}>{props.text}</div>
                </div>
            }
        })()}

    </div>
}