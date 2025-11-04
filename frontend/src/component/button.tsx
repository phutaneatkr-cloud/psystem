import React, {  ReactNode, useMemo } from 'react'

import { clsNames } from '../utlis'
import { ColorName } from './var'

export interface I_ButtonProps {
    href?: string
    targetBlank?: boolean
    className?: string
    outline?: boolean
    color?: ColorName | string
    primary?: boolean
    secondary?: boolean
    success?: boolean
    info?: boolean
    warning?: boolean
    error?: boolean
    dark?: boolean
    sm?: boolean
    wait?: boolean
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    children?: ReactNode;
}

const _convColor = (props: any) => {
    if (!props.outline) {
        if (props.primary)
            return "bg-blue-500 hover:bg-blue-600 text-white border border-blue-600";
        if (props.secondary)
            return "bg-slate-500 hover:bg-slate-600 text-white border border-slate-600";
        if (props.success)
            return "bg-green-500 hover:bg-green-600 text-white border border-green-600";
        if (props.info)
            return "bg-sky-400 hover:bg-sky-600 text-white border border-sky-500";
        if (props.warning)
            return "bg-amber-500 hover:bg-amber-600 text-white border border-amber-600";
        if (props.error)
            return "bg-rose-500 hover:bg-rose-600 text-white border border-rose-600";
        if (props.dark)
            return "bg-neutral-700 hover:bg-neutral-800 text-white border border-neutral-800";
    }
    return "";
}

const _convOutLineColor = (props: any) => {
    if (props.outline) {
        if (props.primary)
            return "border bg-white hover:bg-blue-200 text-blue-500 border-blue-500";
        if (props.secondary)
            return "border bg-white hover:bg-slate-200 text-slate-600 border-slate-500";
        if (props.success)
            return "border bg-white hover:bg-green-200 text-green-600 border-green-500";
        if (props.info)
            return "border bg-white hover:bg-cyan-100 text-cyan-500 border-cyan-500";
        if (props.warning)
            return "border bg-white hover:bg-amber-100 text-amber-600 border-amber-500";
        if (props.error)
            return "border bg-white hover:bg-rose-200 text-rose-600 border-rose-500";
        if (props.dark)
            return "border bg-white hover:bg-neutral-200 text-neutral-600 border-neutral-500";
    }
    return "";
}

export const Button = (props: I_ButtonProps) => {

    const cls = useMemo(() => {
        return clsNames(
            props.sm
                ? 'text-xs py-0.5 rounded focus:outline-none p-2'
                : 'py-2 px-2 text-sm rounded focus:outline-none',
            _convColor(props),
            _convOutLineColor(props),
            props.className,
            props.wait ? 'opacity-50' : '',
        )
    }, [props])

    return <button disabled={props.wait}
                   className={clsNames(cls)}
                   onClick={props.onClick}>
        {props.children}
    </button>

}
