import React, { useEffect, useState } from 'react'

import { get, loginCheck, post, tokenService } from '../service/service'

import { Button } from '../component/button'
import { dConfirm, PageTitle, tError, tSuccess } from '../component/common'
import { Input, InputSearch } from '../component/input'
import { Modal } from '../component/modal'
import { InputDate } from '../component/inputDate'

import { date, dbdate, isEmpty, useDebounce } from '../utlis'
import {
    List,
    ListBody,
    ListButton,
    ListContainer,
    ListHead,
} from '../component/list'

import Photo from '../component/photo'
import Paging, { createPaging } from '../component/paging'
import { setUser, useUser } from '../service/state'
import { useDispatch } from 'react-redux'

export default function User (props: any) {
    const [wait, setWait] = useState(true)

    const [datas, setDatas] = useState([])
    const [form, setForm] = useState<any>(null)

    const [search, setSearch] = useState('')
    const [paging, setPaging] = useState(createPaging(1))

    const loadList = useDebounce((p?: any) => {

        if (!p) p = paging

        setWait(true)
        const params = { search, page: p?.page || 1 }
        get('user/list', params).then((d) => {
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
        <PageTitle title="ผู้ใช้งาน">
            <InputSearch value={search} onChange={setSearch} onRefresh={() => loadList()}/>
            <Button success className="w-36 ml-3" onClick={() => setForm(0)}>
                เพิ่มข้อมูลใหม่
            </Button>
        </PageTitle>

        <ListContainer wait={wait}>
            <ListHead>
                <div className={'w-12 text-center'}>#</div>
                <div className={'w-64'}>ชื่อผู้ใช้งาน</div>
                <div className={'w-full'}>ชื่อสกุล</div>
                <div className={'w-52 '}>อัพเดทล่าสุด</div>
                <div className={'w-20'}/>
            </ListHead>
            <ListBody>
                {datas.map((d: any, i: number) => {
                    return (
                        <List key={'item_' + d.id}>
                            <ListButton>
                                <div className={'w-12 text-center'}>{i + 1}</div>
                                <div className={'w-64'}>{d.username}</div>
                                <div className={'w-full'}>{d.fullname}</div>
                                <div className={'w-52'}>
                                    {date(d.updateTime, 'St')}
                                </div>
                                <div className={'w-20'}><Button sm success onClick={() => setForm(d.id)}>ตั้งค่า</Button></div>
                            </ListButton>
                        </List>
                    )
                })}
            </ListBody>
        </ListContainer>
        <Paging className={'mt-3'} page={paging} onChange={loadList}/>
        <UserForm id={form} onSave={loadList} onClose={() => setForm(null)}/>
    </>

}

export function UserForm (props: any) {
    const dispatch = useDispatch()

    const user = useUser()
    const [data, setData] = useState<any>(null)
    const [isPassword, setIsPassword] = useState(false)

    const loadData = () => {
        if (props.id > 0) {
            get('user/get/', { id: props.id }).then((d) => {
                if (d.ok) {
                    setData(d.data)
                }
            })
        }
        else {
            setData({ id: 0, name: '', username: '', password: '', birthday: null })
        }
    }

    const validateUsername = (username: string): boolean => {
        const regex = /^[a-zA-Z0-9_]+$/
        return regex.test(username)
    }

    const saveData = (c: any) => {
        const saveData = {
            id: props.id || 0,
            fullname: data.fullname,
            username: data.username,
            birthday: dbdate(data.birthday),
            password: '',
            isPassword: 0,
            photo: data.photo || null
        }

        if (data.username === '') return c(tError('กรุณากรอกชื่อผู้ใช้งาน'))
        if (!validateUsername(data.username)) return c(tError('ชื่อผู้ใช้งานห้าม ห้ามเว้นวรรคและอักขระพิเศษ'))

        const editPass = (props.id > 0 && isPassword) || props.id === 0

        if (editPass) {
            if (isEmpty(data.password) || isEmpty(data.cpassword)) return c(tError('กรอกรหัสผ่านให้ครบถ้วน'))
            if (data.password != data.cpassword) return c(tError('รหัสผ่านไม่ตรงกัน !?'))
            saveData.password = data.password
            saveData.isPassword = 1
        }

        post('user/save', saveData).then(async (d) => {
            if (d.ok) {
                tSuccess('บันทึกข้อมูลสำเร็จ')
                props.onSave()
                props.onClose()
            }
            else tError(d.error || 'บันทึกข้อมูลไม่สำเร็จ  !?')
        }).finally(c)
    }

    const deleteData = () => {
        dConfirm('ยืนยันการลบข้อมูลนี้ !?').then((ok) => {
            if (ok) {
                post('user/delete', { id: props.id }).then((d) => {
                    if (d.ok) {
                        tSuccess('ลบข้อมูลสำเร็จ')
                        props.onSave()
                        props.onClose()
                    }
                    else tError(d.error || 'ลบข้อมูลไม่สำเร็จ  !?')
                })
            }
        })
    }

    const onChange = (update: any) => setData((prev: any) => ({ ...prev, ...update }))

    const onClose = () => {
        setData(null)
        setIsPassword(false)
    }

    return <Modal title={props.id > 0 ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูลใหม่'} open={props.id !== null} onClose={props.onClose}
                  onOpenEnd={() => loadData()} onCloseEnd={() => onClose()}
                  footerDrop={props.id > 0 && deleteData} footerSave={saveData}
                  footer={props.id > 0 && <Button className={'ml-3'} outline={!isPassword} secondary onClick={() => setIsPassword((prev) => !prev)}>ตั้งรหัสผ่าน</Button>}>

        {data && <>
             <Photo label={'ภาพโปรไฟล์'} value={data.photo} onChange={photo => onChange({ photo })}/>

            <Input form label="ชื่อสกุล" className={'mt-2'} value={data.fullname} onChange={(fullname: any) => onChange({ fullname })}/>
            <Input label="ชื่อผู้ใช้งาน" className={'mt-2'} value={data.username} onChange={(username: any) => onChange({ username })}/>

            {(props.id === 0 || isPassword) && (
                <div className={'flex mt-2 gap-2'}>
                    <Input label="รหัสผ่าน" className={'w-1/2'} type={'password'} value={data.password} onChange={(password: any) => onChange({ password })}/>
                    <Input label="ยืนยันรหัสผ่าน" className={'w-1/2'} type={'password'} value={data.cpassword} onChange={(cpassword: any) => onChange({ cpassword })}/>
                </div>
            )}

            <InputDate label="วัน/เดือน/ปีเกิด" className={'mt-3'} value={data.birthday} onChange={(birthday: any) => onChange({ birthday })}/>
        </>
        }
    </Modal>

}
