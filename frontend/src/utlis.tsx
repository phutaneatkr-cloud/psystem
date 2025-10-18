import { useDebouncedCallback } from 'use-debounce'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/th.js'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('th')
dayjs.tz.setDefault('Asia/Bangkok')

// ----- UTLIS

export const clsNames = (...classes: any[]) => classes.join(' ')

export const isEmpty = (data: any) => {
    if (data === undefined || data === null) return true
    const type = typeof data
    if (type === 'number' && data === 0) return true
    if (type === 'string' && data.toString().trim() === '') return true
    if (type === 'object') {
        if (data instanceof Date) return isNaN(data.getTime())
        if (Array.isArray(data)) return data.length <= 0
        if (Object.keys(data).length === 0) return true
    }
    return false
}

// ---- FORMAT

export const num = (input: any) => {
    let n = 0
    if (typeof input === 'number') {
        n = input
    }
    else if (typeof input === 'boolean') {
        n = input ? 1 : 0
    }
    else if (typeof input === 'string') {
        let cleaned = input.trim()
        if (cleaned.length > 0) {
            cleaned = cleaned.replace(/,/g, '')
            if (/^0x/i.test(cleaned)) n = parseInt(cleaned, 16)
            else if (/^[+-]?(\d+(\.\d+)?|\.\d+)(e[+-]?\d+)?$/i.test(cleaned)) n = Number(cleaned)
        }
        if (isNaN(n)) n = 0
    }
    else {
        try {
            const value = input.valueOf ? input.valueOf() : input
            n = Number(value)
            if (isNaN(n) || !isFinite(n)) {
                n = 0
            }
        } catch (_unused) {
            n = 0
        }
    }
    return n
}

export const todate = (date?: any) => {
    if (!date) return dayjs.tz().toDate()
    return dayjs.tz(date).toDate()
}

export function dbdate (date: any, time = true) {
    try {
        const f = time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
        const _date = typeof date === 'number'
            ? dayjs.unix(date).tz()
            : dayjs(date).tz()
        if (_date)
            return _date.format(f)
        return null
    } catch (e) {
        return null
    }
}

export const date = (value: string | number | Date, format: string = 'St') => {
    try {
        const __date = typeof value === 'number'
            ? dayjs.unix(value).tz()
            : dayjs(value).tz()
        if (__date) {
            switch (format) {
                case 'St':
                    return __date.format('D MMMM YYYY HH:mm:ss')
                case 'S':
                    return __date.format('D MMMM YYYY')
                default:
                    return __date.format('D MMMM YYYY HH:mm:ss')
            }
        }
        else {
            return ''
        }
    } catch (e) {
        console.log(`Day js [data error = ${e}]`)
        return ''
    }
}

export const useDebounce = (fn: (...args: any[]) => void, delay: number) => {
    return useDebouncedCallback(fn, delay)
}

export async function download (url: string) {
    try {
        const response = await fetch(url)
        const blob = await response.blob()

        const blobUrl = window.URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = url.split('/').pop() || 'image.jpg'
        document.body.appendChild(a)
        a.click()

        a.remove()
        window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
        console.error('Download failed:', err)
    }

}