import { useLocation, useNavigate } from 'react-router-dom'

import { clsNames } from '../utlis'
import { useDispatch } from 'react-redux'
import { clearUser, useUser } from '../service/state'
import { tokenService } from '../service/service'
import { MENU_SLIDER } from '../variable/menu'



export default function MainLayout (props: any) {
    const user = useUser()

    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

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
            <div className="p-4 flex justify-between items-center">
                <div className={'flex flex-col'}>
                    <h1 className="text-2xl font-bold">PSYSTEM</h1>
                    {user && <h6 className="">{user.fullname}</h6>}
                </div>
            </div>
            <nav className="flex-1">
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
            </nav>

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
    </div>

}
