import { UserEntity } from '../entity/user'

export class Entity {
    updateTime : string | null | undefined
    updateUser?: UserEntity

    createTime : string | null | undefined
    createUser?: UserEntity

    isActive: boolean = false
}