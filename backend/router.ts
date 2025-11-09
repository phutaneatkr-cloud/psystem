import { Express } from 'express'

import { auth } from './service/auth'

import App from './package/app'
import Ac from './package/ac'

import User from './package/user'
import Employee from './package/employee'

import Upload from './package/upload'

export function routers (app: Express) {
    app.use('/', new App().router)
    app.use('/app/', auth, Upload)
    app.use('/ac/', auth, new Ac().router)
    app.use('/user/', auth, new User().router)
    app.use('/employee/', auth, new Employee().router)
}