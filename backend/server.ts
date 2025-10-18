import express from 'express'
import cors from 'cors'

import { db } from './service/database'
import { routers } from './router'

const app = express()

app.use(cors())
app.use(express.json())

export default function start () {

    routers(app)

    try {
        const port = process.env.APP_BACKEND_PORT || 30000

        db.connect((err) => {
            if (err) {
                console.error('Error connecting to the database:', err)
                return
            }
            console.log('Connected to the MySQL database.')
        })

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        })

    } catch (err) {
        console.error('❌ Server start error = ', err)
        process.exit(1)
    }
}