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
        tokenService.clearToken()
        dispatch(clearUser())
        navigate('login')
    }

    return <div className="flex h-screen">
        <div className={clsNames('bg-gray-800 text-white flex flex-col', 'w-64')}>

            <div className="p-4">
                <h1 className="text-2xl font-bold">PSYSTEM</h1>
                {user && <div className="flex items-center gap-2 mt-2">
                    <h6 className="flex-1 truncate">{user.fullname}</h6>
                    <Icon name={'settings'} onClick={() => setForm(user.id)}/>
                </div>}
            </div>

            <div className="flex-1">
                {MENU_SLIDER
                    .filter((menu) => menu.role ? (user.role.indexOf(menu.role) >= 0) : true)
                    .map((menu, index) => {
                        return <div key={'item_' + menu.name}>
                            <a
                                href={menu.path}
                                onClick={(e) => menuClick(e, menu)}
                                className={clsNames(
                                    'block py-2 px-4',
                                    location.pathname === menu.path ? 'bg-gray-700' : ''
                                )}>
                                {menu.name}
                            </a>
                        </div>
                    })}
            </div>

            <div className="p-4">
                <a href="#"
                   onClick={() => onLogout()}
                   className="block py-2 px-4 hover:bg-red-300 bg-red-500 rounded text-center">
                    ออกจากระบบ
                </a>
            </div>

        </div>

        <div className="flex flex-1 flex-col h-screen bg-white p-3">
            {props.children}
        </div>

        <UserForm id={form} onSave={onSave} onClose={() => setForm(null)}/>

    </div>

}
