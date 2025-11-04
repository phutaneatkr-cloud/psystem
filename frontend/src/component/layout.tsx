import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'

import { clsNames } from '../utlis'
import { clearUser, setUser, useUser } from '../service/state'
import { loginCheck, tokenService } from '../service/service'
import { MENU_SLIDER } from '../variable/menu'
import { Icon } from './icon'
import React, { useState } from 'react'
import { UserForm } from '../pages/user'
import { Modal } from './modal'
import { dConfirm } from './common'

export default function MainLayout (props: any) {
    const user = useUser()

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

    const [form, setForm] = useState<any>(null)

    const onSave = async () => {
        await loginCheck().then((d) => {
            if (d.ok) dispatch(setUser(d.user))
        })
    }

    const menuClick = (e: any, item: any) => {
        if (!e.ctrlKey) {
            e.preventDefault()
            navigate(item.path)
        }
    }

    const onLogout = async () => {
        dConfirm('ออกจากระบบ ?').then(ok => {
            if (ok) {
                tokenService.clearToken()
                dispatch(clearUser())
                navigate('login')
            }
        })

    }

    return <div className="flex h-screen bg-sky-100">
        <div className="flex flex-col w-48 rounded-lg">

            <div className="bg-blue-500 px-3 py-2 text-white flex items-center">
                <h1 className="text-sm font-bold mr-auto truncate">{user.fullname}</h1>

                <Icon name="settings" size={18} color="white" className="cursor-pointer hover:opacity-80 mr-1" onClick={() => setForm(user.id)}/>
                <Icon name="logout" size={18} color="white" className="cursor-pointer hover:opacity-80" onClick={onLogout}/>
            </div>

            <div className="bg-blue-400 text-blue-100 text-xs px-3 py-1">v 0.0.1 ~ dev</div>

            <div className="flex-1 mt-2 overflow-y-auto">
                {MENU_SLIDER
                    .filter((menu) => menu.role ? user.role.includes(menu.role) : true)
                    .map((menu) => {
                        const active = location.pathname === menu.path
                        return <a
                            key={'item_' + menu.name}
                            href={menu.path}
                            onClick={(e) => menuClick(e, menu)}
                            className={clsNames(
                                'flex items-center gap-2 px-3 py-2 text-sm rounded-sm mx-2 my-0.5 transition-all duration-150',
                                active
                                    ? 'bg-blue-500 text-white'
                                    : 'text-blue-500 hover:bg-sky-100'
                            )}>
                            <Icon
                                name={menu.icon}
                                size={16}
                                className={clsNames(
                                    active ? 'text-white' : 'text-blue-500'
                                )}/>
                            <span className="truncate">{menu.name}</span>
                        </a>

                    })}
            </div>
        </div>

        <div className="flex flex-1 flex-col h-screen bg-white p-3 overflow-hidden">
            {props.children}
        </div>

        <UserForm id={form} onSave={onSave} onClose={() => setForm(null)}/>

    </div>

}
