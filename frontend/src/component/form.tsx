import React from 'react'
import { clsNames } from '../utlis'

export function FormContainer (props: {
    collapse?: string,
    className?: string;
    icon?: string,
    title?: string,
    children: React.ReactNode
}) {
    const [hide, setHide] = React.useState(false)

    // -form-container
    return <div key={'container_' + props.collapse}
                className={clsNames('w-full p-2 border-2 border-dashed rounded-sm', props.className || '')}>
        <div>{props.children}</div>
    </div>
}