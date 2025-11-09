import { Entity } from '../utlis/entity'
import { dbdate, isEmpty, jsond, num, toEnum } from '../utlis'
import { GENDERs } from '../variable/var'

export class EmployeeEntity extends Entity {
    constructor (a: any) {
        super()
        if (!isEmpty(a)) {
            this.id = num(a.emp_id)
            this.name = a.emp_name
            this.lastname = a.emp_lastname
            this.position = a.emp_position

            this.gender = toEnum(GENDERs, a.emp_gender)
            this.birthday = dbdate(a.emp_birthday, false)

            this.tel = a.emp_tel
            this.line = a.emp_line

            this.photo = jsond(a.emp_photo)
            this.address = a.emp_address

            this.updateTime = dbdate(a.update_time)
            this.createTime = dbdate(a.create_time)

            this.isActive = num(a.is_active) === 1
        }
    }

    id = 0
    name = ''
    lastname = ''
    position = ''

    gender = null
    birthday

    tel = ''
    line = ''
    photo = null
    address = ''

    fullname () {
        return this.name + ' ' + this.lastname
    }

    mini () {
        return {
            id: this.id,
            name: this.fullname(),
        }
    }

    array () {
        return {
            id: this.id,

            name: this.name,
            lastname: this.lastname,

            fullname: this.fullname(),
            position: this.position,
            gender: this.gender,
            birthday: this.birthday,
            tel: this.tel,
            line: this.line,

            photo: this.photo,
            address: this.address,

            createTime: this.createTime,
            createUser: this.createUser?.mini(),

            updateTime: this.updateTime,
            updateUser: this.updateUser?.mini(),

            isActive: this.isActive,
        }
    }

}