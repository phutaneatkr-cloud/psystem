import { Model } from '../utlis/model'
import { UserEntity } from '../entity/user'
import { CustomerEntity } from '../entity/customer'
import { UserModel } from './user'
import { isEmpty } from '../utlis'
import { EmployeeEntity } from '../entity/employee'

export class EmployeeModal extends Model {
    constructor () {
        super('employee', 'emp_id')
        this.db.orderBy('emp_id', false)
        this.db.where('is_drop', 0)
    }

    protected async setDatas (rows: any[]): Promise<EmployeeEntity[]> {

        const userIds: number[] = []

        rows.forEach(row => {
            userIds.push(row.create_user)
            userIds.push(row.update_user)
        })

        const users: UserEntity[] = isEmpty(userIds) ? [] : await new UserModel().getByIds(userIds)

        return rows.map(a => {
            const data = new EmployeeEntity(a)
            data.createUser = users.find(u => u.id === a.create_user)
            data.updateUser = users.find(u => u.id === a.update_user)
            return data
        })
    }

    search (search: string) {
        this.db.whereLike('emp_name,emp_lastname', search)
        return this
    }
}