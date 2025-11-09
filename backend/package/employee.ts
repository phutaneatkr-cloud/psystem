import Package from '../utlis/package'
import { isEmpty } from '../utlis'
import { table } from '../service/database'
import { EmployeeModal } from '../model/employee'
import { EmployeeEntity } from '../entity/employee'

export default class Employee extends Package {

    async list () {

        const P_page = this.pnum('page', 1)
        const P_search = this.ptext('search')

        const o = new EmployeeModal()
        if (P_search) o.search(P_search)
        const raws: EmployeeEntity[] = await o.paging(P_page)
        const datas = raws.map(raw => raw.array())

        this.ok()
        return o.pagingDatas(datas)

    }

    async get () {

        const o = new EmployeeModal()
        const data = await o.getById(this.pnum('id'))

        if (!isEmpty(data)) {
            this.ok()
            return { data: data!.array() }
        }
    }

    async save () {

        let id = this.pnum('id')

        const db = table('employee')
            .set('emp_name', this.ptext('name'))
            .set('emp_lastname', this.ptext('lastname'))
            .set('emp_position', this.ptext('position'))
            .setNumber('emp_gender', this.pnum('gender'))
            .setDate('emp_birthday', this.ptext('birthday'))
            .set('emp_tel', this.ptext('tel'))
            .set('emp_line', this.ptext('line'))
            .set('emp_address', this.ptext('address'))
            .setJson('emp_photo', this.p('photo'))

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
                .where('emp_id', id)
            await db.update()
        }

        this.ok()
        return { id }

    }

    async active () {
        const o = new EmployeeModal()
        const data = await o.getById(this.pnum('id'))
        if (data != null) {
            await table('employee')
                .setNow('update_time')
                .setNumber('is_active', data.isActive ? 0 : 1)
                .where('emp_id', data.id)
                .update()

            this.ok()
            return { active: !data.isActive }
        }
    }

}