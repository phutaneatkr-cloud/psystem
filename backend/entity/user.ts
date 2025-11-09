import { dbdate, isEmpty, jsond, num } from '../utlis'
import { Entity } from '../utlis/entity'
import { EmployeeEntity } from './employee'

export class UserEntity extends Entity {
    constructor (a: any) {
        super()
        if (!isEmpty(a)) {
            this.id = num(a.user_id)

            this.username = a.user_username
            this.birthday = dbdate(a.user_birthday, false)

            this.updateTime = dbdate(a.update_time)
            this.createTime = dbdate(a.create_time)
            this.role = jsond(a.user_role) || []

            this.isActive = a.is_active === 1
        }
    }

    id = 0
    username = ''
    birthday

    isActive = false

    role: string[] = []

    employee?: EmployeeEntity

    mini () {
        return {
            id: this.id,
            name: this.username,
        }
    }

    array = () => {

        return ({
            id: this.id,

            employee: this.employee?.mini() || null,

            username: this.username,
            birthday: this.birthday,

            role: this.role,
            isActive: this.isActive,

            createTime: this.createTime,
            updateTime: this.updateTime,
        })
    }
}
