import { ReactNode, useEffect, useState } from 'react'
import { IconName } from './var'

import { default as ModalComponent } from 'react-modal'
import { clsNames } from '../utlis'
import { Button } from './button'
import { Icon } from './icon'

export interface ModalProps {
    title: string | React.ReactElement
    icon?: IconName | string
    open: boolean
    openEffect?: 'fade' | 'top' | 'right'
    noCloseBackdrop?: boolean
    children?: ReactNode
    sm?: boolean
    md?: boolean
    lg?: boolean
    xl?: boolean
    footer?: ReactNode
    onClose: (e?: any) => void
    onOpenEnd?: (e?: any) => void
    onCloseEnd?: (e?: any) => void
    footerSave?: (e?: any) => void
    footerDrop?: false | (() => void)
}

export const Modal = (props: ModalProps) => {
    const [animationClass, setAnimationClass] = useState('')
    const [waitSave, setWaitSave] = useState(false)

    function saveSuccess () {
        setWaitSave(false)
    }

    function saveClick () {
        if (props.footerSave) {
            setWaitSave(true)
            props.footerSave(saveSuccess)
        }
    }

    useEffect(() => {
        let timer: any
        if (props.open) {
            // เริ่มต้นด้วยการซ่อน modal นอกหน้าจอ
            setAnimationClass('-translate-y-full opacity-0')
            // หน่วงเวลา 300ms ก่อนเริ่มแอนิเมชัน
            timer = setTimeout(() => {
                setAnimationClass('translate-y-0 opacity-100')
            }, 100)
        }
        else {
            setAnimationClass('-translate-y-full opacity-0')
        }
        return () => clearTimeout(timer)
    }, [props.open])

    return <ModalComponent
        isOpen={props.open}
        onRequestClose={props.onClose}
        onAfterOpen={props.onOpenEnd}
        onAfterClose={props.onCloseEnd}
        className={clsNames(
            `bg-white rounded-md mx-auto mt-5 shadow-lg transform transition-all duration-100 ease-in-out overflow-hidden ${animationClass}`,
            !props.sm && !props.md && !props.lg && !props.xl && 'w-4/12',
            props.sm && 'w-3/12',
            props.md && 'w-5/12',
            props.lg && 'w-7/12',
            props.xl && 'w-10/12'
        )}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 justify-center"
    >

        <div className="flex justify-between items-center bg-sky-600 border-b border-gray-300 px-5 py-3">
            <h2 className="text-white text-lg font-semibold">{props.title}</h2>
            <Icon
                name={'x'}
                className={'text-white hover:text-gray-700 transition-colors'}
                button
                onClick={props.onClose}
            />
        </div>

        <div className={'overflow-y-auto scrollable-div p-5'} style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {props.children}
        </div>

        <div className="flex mt-3 px-5 pb-4">
            {props.footerDrop && (
                <Icon
                    button
                    name={'trash'}
                    className={'hover:text-red-800 text-red-500'}
                    size={18}
                    onClick={props.footerDrop}
                />
            )}
            {props.footer && <div className={'mt-1.5'}>{props.footer}</div>}
            {props.footerSave && (
                <div className="ml-auto flex justify-end">
                    <Button className={'w-20'} wait={waitSave} info onClick={saveClick}>
                        {waitSave ? <i className="fa fa-spinner fa-spin"></i> : 'บันทึก'}
                    </Button>
                </div>
            )}
        </div>
    </ModalComponent>

}
