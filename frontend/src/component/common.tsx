import React, { ReactNode } from 'react'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { LoaderCircle } from 'lucide-react'

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
    return <LoaderCircle size={16} className="loader text-gray-500 transition-colors duration-200"/>
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