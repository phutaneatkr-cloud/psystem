import { Model } from '../utlis/model'
import { UserEntity } from '../entity/user'
import { EmployeeEntity } from '../entity/employee'
import { isEmpty } from '../utlis'
import { EmployeeModal } from './employee'

export class UserModel extends Model {

    constructor () {
        super('user', 'user_id')
        this.db.orderBy('user_id', false)
        this.db.where('is_drop', 0)
    }

    protected async setDatas (rows: any[]) {

        const empIds: number[] = []

        rows.forEach(row => {
            empIds.push(row.emp_id)
        })

        const emps: EmployeeEntity[] = isEmpty(empIds) ? [] : await new EmployeeModal().getByIds(empIds)

        return rows.map(a => {
            const data = new UserEntity(a)
            data.employee = emps.find(u => u.id === a.emp_id)
            return data
        })
    }

    search (search: string) {
        this.db.whereLike('user_username', search)
        return this
    }

}