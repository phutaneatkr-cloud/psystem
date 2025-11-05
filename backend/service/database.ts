import mysql, { RowDataPacket } from 'mysql2'
import fs from 'fs'
import path from 'path'
import { Table } from '../utlis/table'

import '../config'

const prod = process.env.NODE_ENV === 'production'

const baseConfig: any = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 4000),
}

if (prod) {
    if (false && process.env.DB_CA_BASE64) {
        //baseConfig.ssl = { ca: Buffer.from(process.env.DB_CA_BASE64, 'base64').toString('utf8') }
    }
    else {
        baseConfig.ssl = { ca: fs.readFileSync(path.resolve(__dirname, '../ca.pem')) }
    }
}

export const db = mysql.createConnection(baseConfig)

export const table = (table: any, primary?: any) => new Table(table, primary)

export const query = async (sql: string, params?: any[]) => {
    return new Promise((resolve, reject) => {
        db.query(sql, null, (err, results) => {
            if (err) return reject(err.message)
            resolve(results as RowDataPacket[])
        })
    })
}