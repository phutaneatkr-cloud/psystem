import { useDispatch } from 'react-redux'

import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

import { clearUser } from '../service/state'
import { tokenService } from '../service/service'

export default function Home (props: any) {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onLogout = async () => {
        tokenService.clearToken()
        dispatch(clearUser())
        navigate('/login')
    }

    useEffect(() => {}, [])

    return <>

    </>
}
