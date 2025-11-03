import { Router, Request, Response, RequestHandler, NextFunction } from 'express'
import { dbdate, isEmpty } from '../utlis'
import jwt from 'jsonwebtoken'
import { table } from '../service/database'
import { UserEntity } from '../entity/user'

export default abstract class Package {
    public router: Router

    noError = true
    user?: UserEntity

    private isOk = false
    private errorText = ''

    protected token: string | null = null
    protected _username: string | null = null
    protected _password: string | null = null

    private _req!: Request
    private _res!: Response

    constructor () {
        this.router = Router()
        this.router.use(this.userLoaded.bind(this))
        this.autoMapMethods()
    }

    private async userLoaded (req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers['authorization']
        if (!authHeader) return next()

        const token = authHeader.replace('Bearer ', '')

        if (this.token !== token) {
            this.user = undefined
            this.token = token
        }

        if (!this.user) {
            try {
                const decoded: any = jwt.decode(token)
                const username = decoded?.username
                if (!username) return next()

                const db = table('users')
                db.where('is_drop', 0)
                db.where('user_username', username)
                const raw = await db.selectOnce()
                if (raw) {
                    this.user = new UserEntity(raw)
                }
            } catch (err) {
                console.error('Load user error:', err)
            }
        }

        next()
    }

    protected ok () {
        this.isOk = true
        this.errorText = ''
    }

    protected error (error: string) {
        this.isOk = false
        this.noError = false
        this.errorText = error
    }

    protected p (name: string, def: any = null) {
        if (!this._req) return def
        const method = this._req.method.toUpperCase()

        if (['POST', 'PUT'].includes(method)) {
            return this._req.body?.[name] ?? def
        }
        else {
            return this._req.params?.[name] ?? this._req.query?.[name] ?? def
        }
    }

    protected pnum (name: string, def: number = 0) {
        const v = this.p(name, def)
        const n = Number(v)
        return isNaN(n) ? def : n
    }

    protected ptext (name: string, def: string = '') {
        const v = this.p(name, def)
        return v != null ? String(v) : def
    }

    protected handle (fn: (...args: any[]) => Promise<any>): RequestHandler {
        // @ts-ignore
        return async (req: Request, res: Response) => {
            this._req = req
            this._res = res

            const authHeader = req.headers['authorization']
            if (authHeader) {
                if (authHeader.startsWith('Bearer ')) {
                    this.token = authHeader.split(' ')[1] ?? null
                }
                else if (authHeader.startsWith('Basic ')) {
                    const base64 = authHeader.split(' ')[1] ?? ''
                    const decoded = Buffer.from(base64, 'base64').toString('utf8')
                    const [user, pass] = decoded.split(':')
                    this._username = user ?? null
                    this._password = pass ?? null
                }
            }

            const path = req.originalUrl.split('?')[0]
            const now = dbdate(new Date())

            console.log(`${now} [${req.method}] ${path}`)

            try {
                const result = await fn.apply(this, [])

                if (this.isOk) {
                    return res.status(200).json({ ok: true, ...result })
                }
                else {
                    const output = { ok: false, ...result }
                    if (!this.noError && this.errorText) output.error = this.errorText || 'Unknown error'
                    return res.status(200).json(output)
                }
            } catch (e) {
                const message = e instanceof Error ? e.message : typeof e == 'string' ? e : 'Unknown error'
                return res.status(500).json({ ok: false, error: message })
            } finally {
                this.isOk = false
                this.errorText = ''
            }
        }
    }

    private autoMapMethods () {
        const proto = Object.getPrototypeOf(this)
        const methods = Object.getOwnPropertyNames(proto).filter(
            (m) => m !== 'constructor' && typeof (this as any)[m] === 'function'
        )

        methods.forEach((method: string) => {
            const handler: RequestHandler = this.handle((this as any)[method])
            if (!isEmpty(handler)) {
                let path = `/${method.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)}`;

                ['get', 'post', 'put', 'delete'].forEach((verb) => {
                    (this.router as any)[verb](path, handler)
                })
            }
        })
    }

}
