import { dConfirm, PageTitle, tError, tSuccess } from '../component/common'
import React, { useEffect, useState } from 'react'
import Paging, { createPaging } from '../component/paging'
import { date, dbdate, useDebounce } from '../utlis'
import { get, post } from '../service/service'
import { Input, InputSearch } from '../component/input'
import { Button } from '../component/button'
import { List, ListBody, ListContainer, ListHead } from '../component/list'
import { IconActive } from '../component/iconActive'
import { GENDERs } from '../variable/var'
import { Modal } from '../component/modal'
import { Radio } from '../component/radio'
import { InputDate } from '../component/inputDate'
import Photo from '../component/photo'

export default function Employee () {

    const [wait, setWait] = useState(true)

    const [datas, setDatas] = useState([])
    const [form, setForm] = useState<any>(null)

    const [search, setSearch] = useState('')

    const [paging, setPaging] = useState(createPaging(1))

    const loadList = useDebounce((p?: any) => {
        if (!p) p = paging
        setWait(true)
        const params = { search, page: p?.page || 1 }
        get('employee/list', params).then(d => {
            if (d.ok) {
                setDatas(d.datas)
                setPaging(d.paging)
            }
        }).finally(() => setWait(false))
    }, 300)

    useEffect(() => {
        loadList()
    }, [search])

    return <>
        <PageTitle icon={'users-group'} title={'พนักงาน'}>
            <InputSearch value={search} onChange={setSearch} onRefresh={() => loadList()}/>
            <Button className={'ml-3 w-36'} success onClick={() => setForm(0)}>เพิ่มข้อมูลพนักงาน</Button>
        </PageTitle>
        <ListContainer wait={wait}>
            <ListHead>
                <div className={'w-12 c'}/>
                <div className={'w-12 c'}>#</div>
                <div className={'w-64'}>พนักงาน</div>
                <div className={'w-full'}>ตำแหน่ง</div>
                <div className={'w-date-s r'}>อัพเดทล่าสุด</div>
                <div className={'w-32'}/>
            </ListHead>
            <ListBody>
                {datas.map((d: any, i: number) => {
                    return <List key={'item_' + d.id}>
                        <div className={'w-12 c'}>
                            <IconActive active={d.isActive} url={'employee/active?id=' + d.id}/>
                        </div>
                        <div className={'w-12 c'}>{i + 1}</div>
                        <div className={'w-64'}>{d.fullname}</div>
                        <div className={'w-full'}>{d.position}</div>
                        <div className={'w-date-s r'}>{date(d.updateTime, 'Mt')}</div>
                        <div className={'w-32 c'}><Button sm success onClick={() => setForm(d.id)}>ตั้งค่า</Button></div>
                    </List>
                })}
            </ListBody>
        </ListContainer>

        <Paging className={'mt-3'} page={paging} onChange={loadList}/>
        <EmployeeForm id={form} onSave={loadList} onClose={() => setForm(null)}/>
    </>
}

function EmployeeForm (props: any) {
    const [data, setData] = useState<any>(null)

    const loadData = () => {
        if (props.id > 0) {
            get('employee/get', { id: props.id }).then(d => {
                if (d.ok) {
                    setData(d.data)
                }
            })
        }
        else setData({ id: 0, gender: GENDERs[0] })
    }

    const saveData = (c: any) => {
        const saveData = {
            id: props.id,
            name: data.name,
            lastname: data.lastname,
            position: data.position,
            gender: data.gender?.id,
            birthday: dbdate(data.birthday),
            tel: data.tel,
            line: data.line,
            photo: data.photo || null,
            address: data.address,
        }
        post('employee/save', saveData).then((d => {
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
                post('employee/delete/' + props.id, null).then((d => {
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

    const onClose = () => setData(null)

    return <Modal title={props.id > 0 ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'} open={props.id !== null} onClose={props.onClose}
                  onOpenEnd={() => loadData()} onCloseEnd={() => onClose()}
                  footerDrop={props.id > 0 && deleteData} footerSave={saveData}>

        {data && <>
            <Photo label={'ภาพโปรไฟล์'} value={data.photo} onChange={photo => onChange({ photo })}/>

            <div className={'flex gap-2 mt-3'}>
                <Input label="ชื่อ" className={'w-1/2'} value={data.name} onChange={name => onChange({ name })}/>
                <Input label="สกุล" className={'w-1/2'} value={data.lastname} onChange={lastname => onChange({ lastname })}/>
            </div>

            <Input label="ตำแหน่งงาน" className={'mt-2'} value={data.position} onChange={position => onChange({ position })}/>

            <div className={'flex gap-2 mt-3'}>
                <Radio label={'เพศ'} className={'w-1/2'} value={data.gender?.id} options={GENDERs} onChange={(_, gender) => onChange({ gender })}/>
                <InputDate label="วัน/เดือน/ปีเกิด" className={'w-1/2'} value={data.birthday} onChange={birthday => onChange({ birthday })}/>
            </div>

            <div className={'flex gap-2 mt-3'}>
                <Input label="เบอร์โทร" className={'w-1/2'} value={data.tel} onChange={tel => onChange({ tel })}/>
                <Input label="ไลน์" className={'w-1/2'} value={data.line} onChange={line => onChange({ line })}/>
            </div>

            <Input label="ที่อยู่" className={'mt-2'} multiple value={data.address} onChange={address => onChange({ address })}/>
        </>
        }
    </Modal>

}