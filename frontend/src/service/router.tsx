import { Navigate, Route, Routes, useLocation, Outlet } from 'react-router-dom'

import { useSelector } from 'react-redux'

import Login from '../pages/login'
import Home from '../pages/home'
import User from '../pages/user'
import DevPage from '../pages/dev'
import Employee from '../pages/employee'

import FireType from '../pages/fireType'
import Fire from '../pages/fire'

import Empty404 from '../pages/empty404'

export default function PRouter () {
    return <Routes>
        <Route path="/" element={<Navigate to="/home"/>}/>

        <Route element={<RouteNonUser/>}>
            <Route path="/dev" element={<DevPage/>}/>
            <Route path="/login" element={<Login/>}/>
        </Route>

        <Route element={<RoutePrivate/>}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/user" element={<User/>}/>
            <Route path="/employee" element={<Employee/>}/>
            <Route path="/fire_type" element={<FireType/>}/>
            <Route path="/fire" element={<Fire/>}/>
        </Route>

        <Route path="*" element={<Empty404/>}/>

    </Routes>
}

const RouteNonUser = () => {
    const state = useSelector((state: any) => state.user)
    const location = useLocation()

    if (state.user !== null && location.pathname === '/login') {
        return <Navigate to="/home" state={{ from: location }} replace/>
    }

    return <Outlet/>
}

const RoutePrivate = () => {
    const state = useSelector((state: any) => state.user)
    const location = useLocation()

    if (state.user === null) {
        return <Navigate to="/login" state={{ from: location }} replace/>
    }

    return <Outlet/>
}

const useUser = () => useSelector((state: any) => state.user)?.user || null