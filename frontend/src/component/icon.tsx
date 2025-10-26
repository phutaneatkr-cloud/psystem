import React from 'react'

import * as TablerIcons from '@tabler/icons-react'
import { IconQuestionMark } from '@tabler/icons-react'

import { clsNames } from '../utlis'
import { ICONs } from '../variable/icon'

export type T_IconName = (typeof ICONs)[number]['name'];

interface I_IconProps {
    name: T_IconName
    size?: number
    color?: string
    className?: string
    button?: boolean
    solid?: boolean,
    onClick?: (e?: any) => void
}

export const Icon = (props: I_IconProps) => {

    const iconName = props.name
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join('')

    let IconComponent = (TablerIcons as any)['Icon' + iconName]

    if (props.solid) {
        const FilledComponent = (TablerIcons as any)['Icon' + iconName + 'Filled']
        if (FilledComponent) {
            IconComponent = FilledComponent
        }
    }

    if (!IconComponent)
        return <IconQuestionMark size={props.size || 14} className="text-red-500"/>

    return <button
        onClick={props.onClick}
        className={clsNames('flex items-center justify-center rounded-full transition-colors duration-200',
            props.button ? 'cursor-pointer w-8 h-8 hover:bg-gray-200' : 'cursor-default',
            props.className)}>
        <IconComponent size={props.size || 15} color={props.color} className={props.className}/>
    </button>
}