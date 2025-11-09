import Package from '../utlis/package'
import { EmployeeModal } from '../model/employee'
import { EmployeeEntity } from '../entity/employee'

export default class App extends Package {

    async employee () {
        const search = this.ptext('search')
        const o = new EmployeeModal()
        if (search) o.search(search)

        const raws : EmployeeEntity[] = await o.gets(20)
        const datas = raws.map((item) => ({
            id: item.id,
            name:item.name + item.fullname()
        }))

        this.ok()
        return {datas}
    }

}