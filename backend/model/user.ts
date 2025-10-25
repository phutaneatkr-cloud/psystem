import { Model } from '../utlis/model'
import { UserEntity } from '../entity/user'

export class UserModel extends Model {

    constructor () {
        super('users', 'user_id')
        this.db.orderBy('user_id', false)
        this.db.where('is_drop', 0)
    }

    protected async setDatas (rows: any[]) {
        return rows.map((r) => new UserEntity(r))
    }

    search(search:string){
        this.db.whereLike('user_fullname,user_username', search)
        return this
    }

}