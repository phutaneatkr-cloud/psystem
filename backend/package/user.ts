import Package from '../utlis/package'
import { table } from '../service/database'
import { UserEntity } from '../entity/user'
import { generateUserSecret, hashPassword } from '../utlis'
import { UserModel } from '../model/user'

export default class User extends Package {

    async list () {
        const P_page = this.pnum('page', 1)
        const P_search = this.ptext('search')

        const o = new UserModel()
        if (P_search) o.search(P_search)

        const raws: UserEntity[] = await o.paging(P_page, '*')
        const datas = raws.map(raw => raw.array())

        this.ok()
        return o.pagingDatas(datas)
    }

    async get () {
        const db = table('users')
        db.where('user_id', this.pnum('id'))

        const data = await db.selectOnce().then((d) => new UserEntity(d).array())

        this.ok()
        return { data }
    }

    async save () {
        const id = this.pnum('id')

        const P_isPassword = this.pnum('isPassword') === 1
        const P_password = this.ptext('password')

        const db = table('users')
        db.set('user_fullname', this.ptext('fullname'))
        db.set('user_username', this.ptext('username'))
        db.setJson('user_photo', this.p('photo'))
        db.setJson('attach_files', this.p('files'))
        db.setDate('user_birthday', this.ptext('birthday'))
        db.setNow('update_time')

        const c = await this._checkDuplicate()
        if (!c) return this.error('มีชื่อผู้ใช้งานนี้แล้วในระบบ !?')

        if (this.noError) {
            if (id === 0) {
                if (c) {

                    const secret = generateUserSecret()
                    const password = await hashPassword(P_password)

                    db.set('user_password', password)
                    db.set('user_secret', secret)
                    db.setNow('create_time')

                    const id = await db.insert()

                    this.ok()
                    return { id }
                }
            }
            else {
                db.where('user_id', id)
                db.setNow('update_time')

                if (P_isPassword) {
                    const secret = generateUserSecret()
                    const password = await hashPassword(P_password)
                    db.set('user_password', password)
                    db.set('user_secret', secret)
                }

                await db.update()

                this.ok()
                return { id }
            }
        }
    }

    private async _checkDuplicate () {
        const id = this.pnum('id')
        const username = this.ptext('username')
        if (username) {
            const db = table('users')
            db.where('user_id', id, '!=')
            db.where('user_username', username)
            return await db.select().then((raws) => raws.length === 0)
        }
        return false
    }

    async delete () {
        const P_id = this.pnum('id')

        const db = table('users')
        db.setNumber('is_drop', 1)
        db.setNow('update_time')
        db.where('user_id', P_id)
        await db.update()

        this.ok()
        return { id: P_id }
    }
}
