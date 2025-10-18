import { useEffect, useState } from 'react'

import { useDispatch } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'

import AppRouter from './service/router'
import { clearUser, setUser, useUser } from './service/state'
import { loginCheck } from './service/service'

import MainLayout from './component/layout'

export default function App () {
    const dispatch = useDispatch()
    const user = useUser()

    const [isCheck, setIsCheck] = useState(false)
    const [isDev, setIsDev] = useState(false)

    const onLoginCheck = async () => {
        await loginCheck().then((d) => {
            if (d.ok) {
                dispatch(setUser(d.user))
            }
            else {
                onLogout()
            }
        }).catch((e) => {
            console.log('login-check error -> ', e)
            onLogout()
        }).finally(() => setIsCheck(true))
    }

    const onLogout = async () => {
        //TokenService.removeToken()
        dispatch(clearUser())
    }

    useEffect(() => {
        if (!isDev) onLoginCheck()
    }, [])

    if (!isCheck) return <></>

    return <Router>
        {user ? <MainLayout children={<AppRouter/>}/> : <AppRouter/>}
    </Router>
}
