import Package from '../utlis/package'
import { table } from '../service/database'
import { CustomerEntity } from '../entity/customer'
import { CustomerModel } from '../model/customer'
import { UserEntity } from '../entity/user'
import { isEmpty } from '../utlis'
import { UserModel } from '../model/user'

export default class customer extends Package {

    async list () {

        const P_page = this.pnum('page', 1)
        const P_search = this.ptext('search')

        const o = new CustomerModel()
        if (P_search) o.search(P_search)
        const raws: CustomerEntity[] = await o.paging(P_page)
        const datas = raws.map(raw => raw.array())

        this.ok()
        return o.pagingDatas(datas)

    }

    async get () {

        const o = new CustomerModel()
        const data = await o.getById(this.pnum('id'))

        if (!isEmpty(data)) {
            this.ok()
            return { data: data!.array() }
        }
    }

    async save () {

        let id = this.pnum('id')

        const db = table('customer')
            .set('customer_name', this.ptext('name'))
            .set('customer_lastname', this.ptext('lastname'))
            .setNumber('customer_gender', this.pnum('gender'))
            .setDate('customer_birthday', this.ptext('birthday'))
            .set('customer_tel', this.ptext('tel'))
            .set('customer_line', this.ptext('line'))
            .setNumber('customer_job', this.pnum('job'))
            .set('customer_address', this.ptext('address'))

        if (id === 0) {
            db.setNow('create_time')
                .setNumber('create_user', this.user!.id)
                .setNow('update_time')
                .setNumber('update_user', this.user!.id)
            id = await db.insert()
        }
        else {
            db.setNow('update_time')
                .setNumber('update_user', this.user!.id)
                .where('customer_id', id)
            await db.update()
        }

        this.ok()
        return { id }

    }

    async active () {
        const o = new CustomerModel()
        const data = await o.getById(this.pnum('id'))
        if (data != null) {
            await table('customer')
                .setNow('update_time')
                .setNumber('is_active', data.isActive ? 0 : 1)
                .where('customer_id', data.id)
                .update()

            this.ok()
            return { active: !data.isActive }
        }
    }

}