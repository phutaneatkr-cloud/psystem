import { Model } from '../utlis/model'
import { UserEntity } from '../entity/user'
import { CustomerEntity } from '../entity/customer'

export class CustomerModel extends Model {
    constructor () {
        super('customer', 'customer_id')
        this.db.orderBy('customer_id', false)
        this.db.where('is_drop', 0)
    }

    protected setDatas (rows: any[]) {
        return rows.map(r => new CustomerEntity(r))
    }

    search (search: string) {
        this.db.whereLike('customer_name,customer_lastname', search)
        return this
    }
}