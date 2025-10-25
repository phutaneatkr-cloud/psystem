import type { RowDataPacket } from 'mysql2'
import { Table } from './table'

export abstract class Model<T = any> {
    protected db: Table

    constructor(tbname: string, tbkey: string) {
        this.db = new Table(tbname, tbkey)
    }

    protected abstract setDatas(rows: RowDataPacket[]): Promise<T[]>

    async gets(limit?: number): Promise<T[]> {
        const db = this.db
        if (limit) db.limit(limit)
        const rows = await db.select('*')
        return await this.setDatas(rows)
    }

    async get(): Promise<T | null> {
        const row = await this.db.selectOnce('*')
        if (!row) return null
        const data = await this.setDatas([row])
        return data[0] ?? null
    }

    async getByIds(ids: number[], limit?: number): Promise<T[]> {
        const db = this.db
        db.whereIn(this.db._tbkey(), ids)
        if (limit) db.limit(limit)
        const rows = await db.select('*')
        return await this.setDatas(rows)
    }

    async getById(id: number): Promise<T | null> {
        const db = this.db
        db.where(this.db._tbkey(), id)
        const row = await db.selectOnce('*')
        if (!row) return null
        const data = await this.setDatas([row])
        return data[0] ?? null
    }

    async paging(page: number = 1, columns: string = '', perPage: number = 50) {
        const db = this.db
        if (columns === '') columns = '*'
        const rows = await db.paging(page, columns, perPage)
        return await this.setDatas(rows)
    }

    async pagingDatas(datas: any[]) {
        const db = this.db
        return db.pagingDatas(datas)
    }

    sql() {
        return this.db.sql()
    }
}