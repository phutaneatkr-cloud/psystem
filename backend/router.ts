import { Express } from 'express'

import AppUpload from './package/upload'

import { auth } from './service/auth'

import { App } from './package/app'
import { User } from './package/user'

export function routers (app: Express) {

    app.use('/', new App().router)

    app.use('/app/', auth, AppUpload)
    app.use('/user/', auth, new User().router)


}