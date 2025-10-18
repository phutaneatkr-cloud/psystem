import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { isEmpty } from '../utlis'

const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_API })

const __headers = () => {
    const token = tokenService.getToken()
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    }
}

export const login = async (username: string, password: string) => {
    const headers = { Authorization: `Basic ${btoa(`${username}:${password}`)}` }
    return await api.get('/login', { headers }).then((d: any) => {
        if (d.ok) {
            tokenService.setToken(d.token)
        }
        return d.data
    }).catch((reason: AxiosError) => {
        throw reason.message
    })
}

export const loginCheck = async () => {
    const headers = __headers()
    return await api.get('/login_check', { headers }).then((d) => d.data)
}

export const uploadPhoto = async (photo: any) => {
    const headers = __headers()
    const formData = new FormData()
    formData.append('photo', photo)
    return await axios.post('/upload', formData, { headers }).then((d) => d.data)
}

// ----

export const get = async (endpoint: string, params?: any) => {
    const headers = __headers()
    return await api.get('/' + endpoint, { headers, params }).then(d => d.data)
}

export const post = async (endpoint: string, data?: any, params?: any) => {
    const headers = __headers()

    let body = !isEmpty(data) ? axios.toFormData(data) : undefined

    if (endpoint.startsWith('app/upload')) {

        const formData = new FormData()
        if (endpoint === 'app/upload') {
            formData.append('photo', data)
        }
        else {
            if (Array.isArray(data)) {
                data.forEach(d => formData.append('files', d))
            }
            else {
                formData.append('files', data)
            }
        }

        body = formData
        headers['Content-Type'] = 'multipart/form-data'
    }

    return  await api.post('/' + endpoint, body, { headers, params }).then(d => d.data)
}

export const tokenService = {
    setToken (token: string, expiryDays = 7) {
        Cookies.set(import.meta.env.VITE_COOKIE_NAME, token, {
            expires: expiryDays,
            secure: true,
            sameSite: 'strict',
            path: '/',
        })
    },

    getToken () {
        return Cookies.get(import.meta.env.VITE_COOKIE_NAME) ?? null
    },

    clearToken () {
        Cookies.remove(import.meta.env.VITE_COOKIE_NAME, { path: '/' })
    },
}