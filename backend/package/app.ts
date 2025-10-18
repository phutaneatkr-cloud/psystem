import jwt from 'jsonwebtoken'

import Package from '../utlis/package'
import { table } from '../service/database'
import { UserEntity } from '../entity/user'
import { signToken, verifyPassword, verifyToken } from '../utlis'

export class App extends Package {

    async login () {
        const username = this._username
        const password = this._password

        const db = table('users')
        db.where('user_username', username)

        const raw = await db.selectOnce()

        if (raw) {
            const next = await verifyPassword(password!, raw.user_password)
            if (next) {
                const secret: any = process.env.APP_TOKEN_SECRET + raw.user_secret
                const token = signToken(raw.user_username, secret)

                if (token != null) {
                    const user = new UserEntity(raw)

                    this.ok()
                    return {
                        user: user.array(),
                        token,
                        message: 'login success',
                    }
                }
            }
        }
        else {
            this.error('ไม่พบชื่อผู้ใช้งานนี้ในระบบ')
        }
    }

    async loginCheck () {
        const token = this.token
        if (!token) return { error: 'Token not provided' }

        const decoded: any = jwt.decode(token)
        const username = decoded?.username
        if (!username) return { error: 'Invalid token payload' }

        const db = table('users')
        db.where('user_username', username)
        const raw = await db.selectOnce()
        if (!raw) return { error: 'User not found' }

        const c = verifyToken(token, process.env.APP_TOKEN_SECRET + raw.user_secret)
        if (!c.ok) return { error: 'Token invalid or expired' }

        const user = new UserEntity(raw)
        this.ok()
        return { user: user.array(), token }
    }

}