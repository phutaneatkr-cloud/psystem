import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import { useSelector } from 'react-redux'

import Login from '../pages/login'
import Home from '../pages/home'
import User from '../pages/user'
import Customer from '../pages/customer'
import { DevPage } from '../pages/dev'

export default function PRouter () {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/home"/>}/>
            <Route path="/dev" element={<DevPage/>}/>

            <Route path="/login" element={<RouteNonUser children={<Login/>}/>}/>

            <Route path="/home" element={<RoutePrivate children={<Home/>}/>}/>
            <Route path="/user" element={<RoutePrivate children={<User/>}/>}/>
            <Route path="/customer" element={<RoutePrivate children={<Customer/>}/>}/>
        </Routes>
    )
}

const RouteNonUser = ({ children }: { children: React.ReactNode }) => {
    const state = useSelector((state: any) => state.user)
    let location = useLocation()

    if (state.user !== null && location.pathname === '/login')
        return <Navigate to="/home" state={{ from: location }} replace/>

    return <>{children}</>
}

const RoutePrivate = ({ children }: { children: React.ReactNode }) => {
    const state = useSelector((state: any) => state.user)

    let location = useLocation()

    if (state.user === null) {
        return <Navigate to="/login" state={{ from: location }} replace/>
    }

    return <>{children}</>
}

const useUser = () => useSelector((state: any) => state.user)?.user || null