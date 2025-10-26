import { Icon, T_IconName } from './icon'
import React, { useState } from 'react'
import { clsNames } from '../utlis'

interface I_IconActiveProps {
    nameOn?: T_IconName
    nameOff?: T_IconName
    url: string,
    color?: string,
    className?: string,
    active?: boolean,
    onActiveted?: (v: any) => void
}

export const IconActive = (props: I_IconActiveProps) => {

    const [active, setActive] = useState(props.active || false)

    const onChange = () => {
        setActive(prev => !prev)
    }

    return <Icon solid={active} size={18}
                 onClick={onChange}
                 className={clsNames('cursor-pointer', props.className)}
                 name={active ? (props.nameOn || 'bulb') : (props.nameOff || 'bulb')}
                 color={props.color || (active ? 'orange' : 'gray')}/>
}