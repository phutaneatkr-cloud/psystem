import React, { useState } from 'react'

import { Button } from '../component/button'
import { FormContainer } from '../component/form'
import { Icon } from '../component/icon'
import { Select } from '../component/select'
import { JOBs } from '../variable/customer'
import { Input } from '../component/input'
import { InputDate } from '../component/inputDate'
import { Radio } from '../component/radio'
import { Checkbox } from '../component/checkbox'

const weather_options = [{ id: 1, name: 'หน้าร้อน' }, { id: 2, name: 'หน้าฝน' }, { id: 3, name: 'หน้าหนาว' }]
const color_options = ['สีแดง', 'สีเหลือง', 'สีเขียว']

export function DevPage () {

    const [data, setData] = useState({
        name: '',
        detail: '',
        date: null,
        datetime: null,
        check: false,
        checks: [],
        weather: 0,
        job: null,
        jobs: []
    })

    const onChange = (update: any) => setData((prev: any) => ({ ...prev, ...update }))

    return <div>

        <FormContainer>
            <div className={'flex space-x-2'}>
                <Button primary className={'w-1/12'}>primary</Button>
                <Button success className={'w-1/12'}>success</Button>
                <Button warning className={'w-1/12'}>warning</Button>
                <Button error className={'w-1/12'}>error</Button>
                <Button info className={'w-1/12'}>info</Button>
                <Button secondary className={'w-1/12'}>secondary</Button>
                <Button dark className={'w-1/12'}>dark</Button>
            </div>
        </FormContainer>

        <FormContainer className={'mt-3'}>
            <Icon size={20} button name={'123'}/>
        </FormContainer>

        <FormContainer className={'mt-3'}>

            <Input label={'input'} className={'w-1/2'} value={data.name} onChange={name => onChange({ name })}/>
            <Input label={'input multiple'} className={'w-1/2 mt-1'} multiple value={data.detail} onChange={detail => onChange({ detail })}/>

            <InputDate label={'input date'} className={'w-1/2 mt-1'} value={data.date} onChange={date => onChange({ date })}/>
            <InputDate time label={'input datetime'} className={'w-1/2 mt-2'} value={data.datetime} onChange={datetime => onChange({ datetime })}/>

            <Checkbox label={'สถานะ'} className={'mt-2'} text={'สถานะการใช้งาน'} checked={data.check} onChange={v => onChange({ check: v })}/>
            <Checkbox label={'สีที่ชอบ'} className={'mt-2'} items={color_options} checked={data.checks} onChange={v => onChange({ checks: v })}/>

            <Radio label={'อากาศ'} className={'mt-1'} options={weather_options} value={data.weather} onChange={weather => onChange({ weather })}/>

            <Select className={'w-1/2 mt-2'} label={'select'} value={data.job} options={JOBs} onChange={job => onChange({ job })}/>

        </FormContainer>

    </div>

}