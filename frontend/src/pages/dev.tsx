import React from 'react'

import { Button } from '../component/button'
import { FormContainer } from '../component/form'
import { Icon } from '../component/icon'

export function DevPage () {

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

    </div>

}