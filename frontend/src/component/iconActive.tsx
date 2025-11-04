import { Icon, T_IconName } from './icon'
import React, { useEffect, useState } from 'react'
import { clsNames } from '../utlis'
import { get } from '../service/service'

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

    const [active, setActive] = useState(false)
    const [activeError, setActiveError] = useState(false)

    const onChange = () => {
        if (!activeError) {
            get(props.url).then(d => {
                if (d.ok) {
                    setActive(prev => !prev)
                }
            }).catch((err) => {
                setActiveError(true)
            })
        }
    }

    useEffect(() => {
        setActive(props.active || false)
    }, [props.active])

    if (activeError)
        return <Icon solid size={18}
                     onClick={() => {}}
                     name={'exclamation-circle'}
                     color={'gray'}/>

    return <Icon solid={active} size={18}
                 onClick={onChange}
                 className={clsNames('cursor-pointer', props.className)}
                 name={active ? (props.nameOn || 'bulb') : (props.nameOff || 'bulb')}
                 color={props.color || (active ? 'orange' : 'gray')}/>
}