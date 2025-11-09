import Package from '../utlis/package'
import { table } from '../service/database'
import { UserEntity } from '../entity/user'
import { generateUserSecret, hashPassword, signToken } from '../utlis'
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
        const o = new UserModel()
        const data: UserEntity = await o.getById(this.pnum('id'))

        this.ok()
        return { data: data.array() }
    }

    async save () {
        const id = this.pnum('id')

        const P_password = this.ptext('password')

        const db = table('user')
            .set('user_username', this.ptext('username'))
            .setDate('user_birthday', this.ptext('birthday'))
            .setNow('update_time')
            .setNumber('emp_id', this.pnum('employee'))
            .setJson('user_role', this.p('role'))

        const c = await this._checkDuplicate()
        if (!c) return this.error('มีชื่อผู้ใช้งานนี้แล้วในระบบ !?')

        if (this.noError) {
            if (id === 0) {
                if (c) {

                    const secret = generateUserSecret()
                    const password = await hashPassword(P_password)

                    db.set('user_password', password)
                    db.set('user_secret', process.env.APP_TOKEN_SECRET + secret)
                    db.setNow('create_time')

                    const id = await db.insert()

                    this.ok()
                    return { id }
                }
            }
            else {
                db.where('user_id', id)
                db.setNow('update_time')

                const output: Record<string, number | string> = { id }

                if (P_password) {
                    const o = new UserModel()
                    const data: UserEntity = await o.getById(id)
                    if (data) {
                        const secret = generateUserSecret()
                        const password = await hashPassword(P_password)

                        if (this.user!.id === data!.id) {
                            output.token = signToken(data.username, process.env.APP_TOKEN_SECRET + secret)
                        }

                        db.set('user_password', password)
                        db.set('user_secret', secret)
                    }
                }

                await db.update()

                this.ok()
                return output
            }
        }
    }

    private async _checkDuplicate () {
        const id = this.pnum('id')
        const username = this.ptext('username')
        if (username) {
            const db = table('user')
            db.where('user_id', id, '!=')
            db.where('user_username', username)
            return await db.select().then((raws) => raws.length === 0)
        }
        return false
    }

    async delete () {
        const P_id = this.pnum('id')

        const db = table('user')
        db.setNumber('is_drop', 1)
        db.setNow('update_time')
        db.where('user_id', P_id)
        await db.update()

        this.ok()
        return { id: P_id }
    }

    async active () {
        const o = new UserModel()
        const data: UserEntity = await o.getById(this.pnum('id'))
        if (data) {
            await table('user')
                .setNow('update_time')
                .setNumber('is_active', data.isActive ? 0 : 1)
                .where('user_id', data.id)
                .update()

            this.ok()
            return { active: !data.isActive }
        }
    }

}
