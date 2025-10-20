import React, { useEffect, useState } from 'react'

import { date, dbdate, isEmpty, useDebounce } from '../utlis'
import { get, post } from '../service/service'

import { dConfirm, PageTitle, tError, tSuccess } from '../component/common'
import { Input, InputSearch } from '../component/input'
import { Button } from '../component/button'
import { List, ListBody, ListButton, ListContainer, ListHead } from '../component/list'
import { Modal } from '../component/modal'
import { InputDate } from '../component/inputDate'
import { FormContainer } from '../component/form'
import { GENDERs, JOBs } from '../variable/customer'
import { Radio } from '../component/radio'
import { Select } from '../component/select'

export default function Customer (props: any) {

    const [wait, setWait] = useState(true)

    const [datas, setDatas] = useState([])

    const [search, setSearch] = useState('')

    const [form, setForm] = useState<any>(null)

    const loadList = useDebounce(() => {
        setWait(true)
        const params = { search }
        get('customer/list', params).then(d => {
            if (d.ok) {
                setDatas(d.datas)
            }
        }).finally(() => setWait(false))
    }, 300)

    useEffect(() => {
        loadList()
    }, [search])

    return <>
        <PageTitle title="ลูกค้า">
            <InputSearch value={search} onChange={setSearch}/>
            <Button success className="w-36 ml-3" onClick={() => setForm(0)}>
                เพิ่มข้อมูลใหม่
            </Button>
        </PageTitle>

        <ListContainer wait={wait}>
            <ListHead>
                <div className={'w-12 text-center'}>#</div>
                <div className={'w-24 text-center'}>ห้อง</div>
                <div className={'w-full'}>ชื่อสกุล</div>
                <div className={'w-20 text-center'}>เพศ</div>
                <div className={'w-44 text-center'}>เบอร์โทร</div>
                <div className={'w-44 text-center'}>ไลน์</div>
                <div className={'w-44 text-right'}>อัพเดทล่าสุด</div>
            </ListHead>
            <ListBody>
                {datas.map((d: any, i: number) => {
                    return <List key={'item_' + d.id}>
                        <ListButton onClick={() => setForm(d.id)}>
                            <div className={'w-12 text-center'}>{i + 1}</div>
                            <div className={'w-24 text-center'}>-</div>
                            <div className={'w-full'}>{d.fullname}</div>
                            <div className={'w-20 text-center'}></div>
                            <div className={'w-44 text-center'}></div>
                            <div className={'w-44 text-center'}></div>
                            <div className={'w-44 text-right'}>{date(d.updateTime)}</div>
                        </ListButton>
                    </List>
                })}
            </ListBody>
        </ListContainer>

        <CustomerForm id={form} onSave={loadList} onClose={() => setForm(null)}/>
    </>
}

function CustomerForm (props: any) {
    const [data, setData] = useState<any>(null)
    const [isPassword, setIsPassword] = useState(false)

    const loadData = () => {
        if (props.id > 0) {
            get('customer/get/' + props.id,).then(d => {
                if (d.ok) {
                    setData(d.data)
                }
            })
        }
        else setData({ id: 0, name: '', username: '', password: '', birthday: null })
    }

    const saveData = (c: any) => {
        const saveData = {
            ...data,
            isPassword: isPassword ? 1 : 0,
            birthday: dbdate(data.birthday)
        }

        if (props.id > 0 && isPassword) {
            if (isEmpty(data.password) || isEmpty(data.cpassword)) return c(tError('กรอกรหัสผ่านใหครบถ้วน'))
            if (data.password != data.cpassword) return c(tError('รหัสผ่านไม่ตรงกัน !?'))
        }
        post('customer/save/' + props.id, saveData).then((d => {
            if (d.ok) {
                tSuccess('บันทึกข้อมูลสำเร็จ')
                props.onSave()
                props.onClose()
            }
            else tError(d.error || 'บันทึกข้อมูลไม่สำเร็จ  !?')
        })).finally(c)
    }

    const deleteData = () => {
        dConfirm('ยืนยันการลบข้อมูลนี้ !?').then((ok) => {
            if (ok) {
                post('customer/delete/' + props.id, null).then((d => {
                    if (d.ok) {
                        tSuccess('ลบข้อมูลสำเร็จ')
                        props.onSave()
                        props.onClose()
                    }
                    else tError(d.error || 'ลบข้อมูลไม่สำเร็จ  !?')
                }))
            }
        })
    }

    const onChange = (update: any) => setData((prev: any) => ({ ...prev, ...update }))

    const onClose = () => {
        setData(null)
        setIsPassword(false)
    }

    return <Modal sm title={props.id > 0 ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'}
                  open={props.id !== null} onClose={props.onClose}
                  onOpenEnd={() => loadData()} onCloseEnd={() => onClose()}
                  footer={props.id > 0 && <Button className={'ml-3'} outline={!isPassword} secondary onClick={() => setIsPassword((prev) => !prev)}>ตั้งรหัสผ่าน</Button>}
                  footerDrop={props.id > 0 && deleteData}
                  footerSave={saveData}>

        {data && <>

            <Input label="ชื่อ" value={data.name} onChange={name => onChange({ name })}/>

            <Input label="สกุล" className={'mt-2'} value={data.lastname} onChange={lastname => onChange({ lastname })}/>

            <Radio label={'เพศ'} value={data.gender} options={GENDERs} onChange={gender => onChange({ gender })}/>

            <InputDate label="วัน/เดือน/ปีเกิด" className={'mt-3'} value={data.birthday} onChange={birthday => onChange({ birthday })}/>

            <div className={'flex space-x-2 mt-3'}>
                <Input label="เบอร์โทร" className={'w-1/2'} value={data.tel} onChange={tel => onChange({ tel })}/>
                <Input label="ไลน์" className={'w-1/2'} value={data.line} onChange={line => onChange({ line })}/>
            </div>

            <Select label={'อาชีพ'} className={'mt-3'} value={data.job} options={JOBs} onChange={job => onChange({ job })}/>
            <Input label="ที่อยู่" className={'mt-2'} multiple value={data.address} onChange={address => onChange({ address })}/>
        </>
        }
    </Modal>

}