import React, { ReactNode } from 'react'

import { clsNames } from '../utlis'
import { Wait } from './common'

export function ListContainer (props: { wait?: boolean, children: React.ReactNode }) {
    const childrenArray = React.Children.toArray(props.children)
    if (childrenArray.length > 0) {
        const head = childrenArray.find((d: any) => React.isValidElement(d) && d.type && (d.type as any).name === 'ListHead')
        const others = childrenArray.filter((d: any) => React.isValidElement(d) && d.type && (d.type as any).name !== 'ListHead')

        if (head) {
            return <div className={'flex-1'}>
                {props.wait && <Wait/>}
                <div className="mt-3 border border-b-0">{head}</div>
                <div className="flex flex-col flex-1 overflow-y-auto border scrollable-div">
                    {others}
                </div>
            </div>
        }
    }
    return <>
        {props.wait && <Wait/>}
        <div className="mt-3 flex flex-col flex-1 overflow-y-auto border scrollable-div">
            {props.children}
        </div>
    </>
}

export function ListHead (props: any) {
    return <React.Fragment key={'ListHead'}>
        <div className="py-2 flex bg-gray-100 text-xs border-b z-0">
            {props.children.map((d: any) => {
                return { ...d, props: { ...d.props, className: clsNames(d.props.className, 'px-2 border-r') } }
            })}
        </div>
    </React.Fragment>
}

export function ListBody (props: any) {
    return <React.Fragment key={'listBody'}>
        {props.children}
    </React.Fragment>
}

export function List (props: any) {

    if (props.children.length > 0) {
        return <div className="flex text-xs border-b hover:bg-blue-50">
            {props.children.map((d: any) => {
                return { ...d, props: { ...d.props, className: clsNames(d.props.className, 'px-2 py-1 border-r') } }
            })}
        </div>
    }

    return <div className={'py-1 flex text-xs border-b hover:bg-blue-50'}>
        {props.children}
    </div>
}

export interface ListButtonProps {
    children: ReactNode[]
    onClick?: (e?: any) => void
}

export function ListButton (props: ListButtonProps) {
    return <React.Fragment key={'listButton'}>
        {props.children.map((d: any, i) => {
            return {
                ...d,
                props: {
                    ...d.props, className: clsNames(d.props.className, 'px-2 border-r', props.onClick && 'cursor-pointer'),
                    onClick: props.onClick
                }
            }
        })}
    </React.Fragment>
}