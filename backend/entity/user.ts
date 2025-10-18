import { dbdate, isEmpty, jsond, num } from '../utlis'
import { Entity } from '../utlis/entity'

export class UserEntity extends Entity {
    constructor (a: any) {
        super()
        try {
            if (!isEmpty(a)) {
                this.id = num(a.user_id)

                this.fullname = a.user_fullname
                this.username = a.user_username
                this.birthday = dbdate(a.user_birthday, false)

                this.updateTime = dbdate(a.update_time)
                this.createTime = dbdate(a.create_time)

                this.photo = jsond(a.user_photo)
                this.files = jsond(a.attach_files) || []

                this.isActive = a.is_active === 1
                if (a.is_admin === 1) {
                    this.role.push('admin')
                }
            }
        } catch (e) {
            console.log('user entity error -> ', e)
        }
    }

    id = 0
    fullname = ''
    username = ''
    birthday

    isActive = false

    role: string[] = []

    photo = null
    files = []

    mini () {
        return {
            id: this.id,
            username: this.username,
            fullname: this.fullname,
            updateTime: this.updateTime,
        }
    }

    array = () => {

        return ({
            id: this.id,

            username: this.username,
            fullname: this.fullname,
            birthday: this.birthday,
            photo: this.photo,
            files: this.files,

            role: this.role,
            isActive: this.isActive,

            createTime: this.createTime,
            updateTime: this.updateTime,
        })
    }
}
