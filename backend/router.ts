import { Express } from 'express'


import { auth } from './service/auth'

import App from './package/app'
import User from './package/user'
import Customer from './package/customer'
import Upload from './package/upload'

export function routers (app: Express) {
    app.use('/', new App().router)
    app.use('/app/', auth, Upload)
    app.use('/user/', auth, new User().router)
    app.use('/customer/', auth, new Customer().router)
}