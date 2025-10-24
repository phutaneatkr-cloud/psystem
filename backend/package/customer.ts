import Package from '../utlis/package'
import { table } from '../service/database'
import { UserModel } from '../model/user'
import { UserEntity } from '../entity/user'
import { CustomerEntity } from '../entity/customer'
import { CustomerModel } from '../model/customer'

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

}