import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/th.js'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('th')
dayjs.tz.setDefault('Asia/Bangkok')

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

export const round = (number: string | number, per: number) => {
    number = num(number)
    if (per > 0) return Math.round((number + Number.EPSILON) * 10 ** per) / 10 ** per
    return Math.round(number)
}

export const toEnum = (enums: any[], value: any, key = 'id', def = null) => {
    if (isEmpty(value)) return def
    return enums.find((e) => e[key] === value) || def
}

export const todate = (date?: any) => {
    if (!date) return dayjs.tz().toDate()
    return dayjs.tz(date).toDate()
}

export function dbdate (date: any, time = true) {
    if (isEmpty(date)) return null
    try {
        const f = time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
        return typeof date === 'number'
            ? dayjs.unix(date).tz().format(f)
            : dayjs(date).tz().format(f)
    } catch (e) {
        return null
    }
}

export function jsond (value: any) {
    if (value === null || value === undefined) return null
    if (typeof value === 'object') return value
    if (typeof value === 'string') {
        try {
            return JSON.parse(value)
        } catch (e) {
            return null
        }
    }
    return null
}

// ----- HASH

export function generateUserSecret (): string {
    return crypto.randomBytes(32).toString('hex')
}

export async function hashPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

export async function verifyPassword (inputPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword)
}

export function signToken (username: string, userSecret: string): string {
    return jwt.sign({ username }, userSecret, { expiresIn: '7d' })
}

export function verifyToken (token: string, userSecret: string) {
    try {
        const decoded = jwt.verify(token, userSecret)
        return { ok: true, decoded }
    } catch (err) {
        return { ok: false, error: err }
    }
}

// ----- UTLIS

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