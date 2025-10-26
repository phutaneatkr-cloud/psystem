import React, { ReactNode } from 'react'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Icon } from './icon'

const MySwal = withReactContent(Swal)

interface I_PageTitleProps {
    title?: string;
    icon?: string;

    className?: string;

    children?: ReactNode;
}

export const PageTitle = (props: I_PageTitleProps) => {
    return <div className="flex items-center">
        <span className={'w-fit'}>{props.title}</span>
        <div className="ml-3 flex flex-1">
            {props.children}
        </div>
    </div>
}

export const Wait = () => {
    return <div className="ml-64 fixed inset-0 flex items-center justify-center z-[9999] bg-transparent">
        <Icon name="inner-shadow-bottom-right" size={120} color="gray" className="animate-spin-slow opacity-50"/>
    </div>
}

export const tSuccess = (title: string, subtitle?: string) => {
    MySwal.fire({
        width: 400,
        title: title,
        text: subtitle,
        icon: 'success',
        confirmButtonText: 'OK',
    })
}

export const tError = (title: string, subtitle?: string) => {
    MySwal.fire({
        width: 400,
        title: title,
        text: subtitle,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
            title: 'swal-title',
        },
    })
}

export const dConfirm = (title: string, subtitle?: string) => {
    return MySwal.fire({
        icon: 'question',
        width: 400,
        title: title,
        showCancelButton: true,
        showConfirmButton: true,
    }).then((result) => result.isConfirmed)
}