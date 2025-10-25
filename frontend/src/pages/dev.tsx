import React, { useState } from 'react'

import { Button } from '../component/button'
import { FormContainer } from '../component/form'
import { Icon } from '../component/icon'
import { Select } from '../component/select'
import { JOBs } from '../variable/customer'
import { Input } from '../component/input'
import { InputDate } from '../component/inputDate'
import { dbdate } from '../utlis'

export function DevPage () {

    const [data, setData] = useState({
        name: '',
        detail: '',
        date: new Date(),
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
            <Input label={'input multiple'} className={'w-1/2 mt-2'} multiple value={data.detail} onChange={detail => onChange({ detail })}/>
            <InputDate label={'input date'} className={'w-1/2 mt-2'} value={data.date} onChange={date => onChange({ date })}/>
            <Select className={'w-1/2 mt-2'} label={'select'} value={data.job} options={JOBs} onChange={job => onChange({ job })}/>
            <Select className={'w-1/2 mt-2'} label={'selects'} multiple value={data.jobs} options={JOBs} onChange={jobs => onChange({ jobs })}/>
        </FormContainer>


    </div>

}