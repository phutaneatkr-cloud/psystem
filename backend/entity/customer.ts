import { Entity } from '../utlis/entity'
import { dbdate, isEmpty, num, toEnum } from '../utlis'
import { GENDERs, JOBs } from '../variable/customer'

export class CustomerEntity extends Entity {
    constructor (a: any) {
        super()
        if (!isEmpty(a)) {
            this.id = num(a.customer_id)
            this.name = a.customer_name
            this.lastname = a.customer_lastname
            this.gender = toEnum(GENDERs, a.customer_gender)
            this.birthday = dbdate(a.customer_birthday, false)

            this.tel = a.customer_tel
            this.line = a.customer_line
            this.job = toEnum(JOBs, a.customer_job)
            this.address = a.customer_address

            this.updateTime = dbdate(a.update_time)
            this.createTime = dbdate(a.create_time)

            this.isActive = num(a.is_active) === 1
        }
    }

    id = 0
    name = ''
    lastname = ''
    gender = null
    birthday

    tel = ''
    line = ''
    job = null
    address = ''

    array () {
        return {
            id: this.id,
            name: this.name,
            lastname: this.lastname,
            fullname: this.name + ' ' + this.lastname,
            gender: this.gender,
            birthday: this.birthday,
            tel: this.tel,
            line: this.line,
            job: this.job,
            address: this.address,

            createTime: this.createTime,
            createUser: this.createUser?.mini(),

            updateTime: this.updateTime,
            updateUser: this.updateUser?.mini(),

            isActive: this.isActive,
        }
    }

}