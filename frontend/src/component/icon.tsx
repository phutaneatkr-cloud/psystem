import React from 'react'

import * as TablerIcons from '@tabler/icons-react'
import { IconQuestionMark } from '@tabler/icons-react';

import { clsNames } from '../utlis'
import { ICONs } from '../variable/icon'

export type T_IconName = (typeof ICONs)[number]['name'];

interface I_IconProps {
    name: T_IconName
    size?: number
    color?: string
    className?: string
    button?: boolean
    onClick?: (e?: any) => void
}

export function Icon (props: I_IconProps) {
    const IconComponent = (TablerIcons as any)['Icon' + props.name.charAt(0).toUpperCase() + props.name.slice(1)]

    if (!IconComponent)
        return <IconQuestionMark size={14} className={'text-red-500'}/>

    return  <button
        onClick={props.onClick}
        className={clsNames('' +
            'flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200',
            props.button && 'w-8 h-8 hover:bg-gray-200',
            props.className)}>
        <IconComponent size={props.size || 15} color={props.color} className={props.className}/>
    </button>
}