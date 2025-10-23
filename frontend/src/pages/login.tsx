import { useState } from 'react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { setUser } from '../service/state'
import { login, tokenService } from '../service/service'
import { tError, tSuccess } from '../component/common'
import { Input } from '../component/input'
import { Button } from '../component/button'

export default function Login (props: any) {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const onLogin = async () => {
        if (username && password) {
            await login(username, password).then((d) => {
                if (d.ok) {
                    const { user, token } = d
                    tokenService.setToken(token)
                    dispatch(setUser(user))
                    tSuccess('เข้าสู่ระบบสำเร็จ')
                    navigate('/home')
                }
                else tError(d.error || 'เข้าสู่ระบบไม่สำเร็จ')
            }).catch((e) => {
                tError(e.error || 'เข้าสู่ระบบไม่สำเร็จ')
                console.log('login error -> ', e)
            })
        }
    }

    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">

            <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Username</label>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
            </div>

            <Button className={'w-full py-2'} primary onClick={() => onLogin()}>Login</Button>

        </div>
    </div>

}
