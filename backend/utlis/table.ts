import { RowDataPacket, ResultSetHeader } from 'mysql2'

import { dbdate, isEmpty, num } from '../utlis'
import { db } from '../service/database'

const DATA_NOT_FOUND = 'Data not found'

export class Table {
    private tbname: string = ''
    private tbkey: string = ''

    private where_fields: string[] = []
    private where_values: any[] = []
    private order_fields: string[] = []

    private set_fields: string[] = []
    private set_values: any[] = []

    private _limit = 0
    private _sql: string = ''
    private _pageInfo: any = {}

    constructor (name = '', key = '') {
        this.tbname = name
        this.tbkey = key
    }

    _tbname () {
        return this.tbname
    }

    _tbkey () {
        return this.tbkey
    }

    // ----- SQL

    sql () {
        return this._sql
    }

    limit (i: number) {
        this._limit = i
    }

    // ----- WHERE Clauses

    where (field: string, value: any, operator = '=') {
        this.where_fields.push(`${field} ${operator} ?`)
        this.where_values.push(value)
    }

    whereIn (field: string, values: any[]) {
        if (!Array.isArray(values) || values.length === 0) return
        const placeholders = values.map(() => '?').join(', ')
        this.where_fields.push(`${field} IN (${placeholders})`)
        this.where_values.push(...values)
    }

    whereLike (fields: string | string[], value: any) {
        const fieldArray = Array.isArray(fields) ? fields : fields.split(',')
        if (fieldArray.length > 1) {
            const likeConditions = fieldArray
                .map((field) => `${field.trim()} LIKE ?`)
                .join(' OR ')
            this.where_fields.push(`(${likeConditions})`)
        }
        else {
            this.where_fields.push(`${fieldArray[0].trim()} LIKE ?`)
        }

        fieldArray.forEach(() => {
            this.where_values.push(`%${value}%`)
        })
    }

    orderBy (field: string, desc: boolean = true) {
        this.order_fields.push(`${field} ${desc ? 'DESC' : 'ASC'}`)
    }

    private _buildWhere () {
        if (this.where_fields.length === 0) return { sql: '', values: [] }
        const sql = `WHERE ${this.where_fields.join(' AND ')}`
        return { sql, values: this.where_values }
    }

    // ----- SET Fields

    set (field: string, value: any) {
        this.set_fields.push(field)
        this.set_values.push(value)
    }

    setNumber (field: string, value: any, defaultValue = 0) {
        this.set(field, typeof value === 'number' ? value : num(value) || defaultValue)
    }

    setDate (field: string, value: any) {
        this.set(field, dbdate(value))
    }

    setNow (field: string) {
        this.set(field, new Date())
    }

    setJson (field: string, value: any) {
        this.set_fields.push(field)
        this.set_values.push(!isEmpty(value) ? JSON.stringify(value) : '')
    }

    // ----- Query Builders

    private _buildSelect (columns: string) {
        const baseSql = `SELECT ${columns}
                         FROM ${this.tbname}`
        const whereClause = this._buildWhere()
        const orderClause = this.order_fields.length
            ? `ORDER BY ${this.order_fields.join(', ')}`
            : ''

        const limitClause = this._limit ? `LIMIT ${this._limit}` : ''
        const sql = `${baseSql} ${whereClause.sql} ${orderClause} ${limitClause}`.trim()

        const values = whereClause.values
        return { sql, values }
    }

    private _buildInsertOrUpdate (mode: 'insert' | 'update') {
        const fields = this.set_fields.join(', ')
        const placeholders = this.set_fields.map(() => '?').join(', ')
        const baseSql =
            mode === 'insert'
                ? `INSERT INTO ${this.tbname} (${fields})
                   VALUES (${placeholders})`
                : `UPDATE ${this.tbname}
                   SET ${this.set_fields
                           .map((field) => `${field} = ?`)
                           .join(', ')}`
        const whereClause = this._buildWhere()
        const sql = `${baseSql} ${whereClause.sql}`
        const values = [...this.set_values, ...whereClause.values]
        return { sql, values }
    }

    private _buildDelete () {
        const baseSql = `DELETE
                         FROM ${this.tbname}`
        const whereClause = this._buildWhere()
        const sql = `${baseSql} ${whereClause.sql}`
        const values = whereClause.values
        return { sql, values }
    }

    // ----- Query Execution

    async select (columns = '*'): Promise<RowDataPacket[]> {
        const { sql, values } = this._buildSelect(columns)
        //console.log('sql -> ',sql)
        //console.log('values -> ',values)
        this._sql = sql
        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, results) => {
                if (err) return reject(err.message)
                resolve(results as RowDataPacket[]) // ใช้ RowDataPacket[]
            })
        })
    }

    async selectOnce (columns = '*'): Promise<RowDataPacket | null> {
        const results = await this.select(columns)
        return results.length ? results[0] : null
    }

    async insert (): Promise<number> {
        const { sql, values } = this._buildInsertOrUpdate('insert')
        this._sql = sql
        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, results) => {
                if (err) return reject(err.message)
                const header = results as ResultSetHeader
                resolve(header.insertId)
            })
        })
    }

    async update (): Promise<number> {
        const { sql, values } = this._buildInsertOrUpdate('update')
        this._sql = sql
        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, results) => {
                if (err) return reject(err.message)
                const header = results as ResultSetHeader
                if (header.affectedRows === 0) return reject(DATA_NOT_FOUND)
                resolve(header.affectedRows)
            })
        })
    }

    async delete (): Promise<number> {
        const { sql, values } = this._buildDelete()
        this._sql = sql
        return new Promise((resolve, reject) => {
            db.query(sql, values, (err, results) => {
                if (err) return reject(err.message)
                const header = results as ResultSetHeader
                if (header.affectedRows === 0) return reject(DATA_NOT_FOUND)
                resolve(header.affectedRows)
            })
        })
    }

    // ----- paging

    async paging (page: number = 1,columns = '',  perPage: number = 50) {
        if (columns === '') columns = '*'

        const countQuery = this._buildSelect('COUNT(*) as total')
        const totalRows: any = await new Promise((resolve, reject) => {
            db.query(countQuery.sql, countQuery.values, (err, results) => {
                if (err) return reject(err.message)
                const outputs = results as RowDataPacket[]
                resolve(outputs[0])
            })
        })

        const total = totalRows.total ?? 0
        const pageCount = Math.ceil(total / perPage)
        const offset = (page - 1) * perPage

        const baseSql = this._buildSelect(columns)
        const sql = `${baseSql.sql} LIMIT ${perPage} OFFSET ${offset}`
        this._sql = sql

        const rows = await new Promise<RowDataPacket[]>((resolve, reject) => {
            db.query(sql, baseSql.values, (err, results) => {
                if (err) return reject(err.message)
                resolve(results as RowDataPacket[])
            })
        })

        this._pageInfo = {
            page,
            pageCount,
            rowCount: total,
            rowPerPage: perPage,
            row: rows.length,
            rownum: offset,
        }

        return rows
    }

    pagingDatas (datas: any[]) {

        const start = this._pageInfo.rownum || 0
        const datasRownum = datas.map((item, index) => ({
            _rownum: start + index + 1,
            ...item,
        }))

        return {
            paging: this._pageInfo,
            datas: datasRownum
        }
    }

}
