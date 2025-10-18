import { useMemo, useRef, useState } from 'react'

import { clsNames, isEmpty } from '../utlis'
import { post } from '../service/service'
import { tError } from './common'
import { Icon } from './icon'

interface UploadProps {
    label?: string;
    value?: any | any[];
    className?: string;
    multiple?: boolean;
    readonly?: boolean;
    onChange: (value?: any) => void;
}

export default function Upload (props: UploadProps) {
    const [wait, setWait] = useState(false)

    const [isFocused, setIsFocused] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

    const onChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const fs = props.multiple ? Array.from(files) : files[0]

        setWait(true)
        await post('app/upload_file', fs).then(d => {
            if (d.ok) {
                props.onChange(props.multiple ? [...fileValues, ...d.files] : d.files[0])
            }
            else {
                tError(d.error || 'อัพโหลดไม่สำเร็จ')
                props.onChange(props.multiple ? [...fileValues] : null)
            }
        }).finally(() => setWait(false))
    }

    const onUpload = () => fileInputRef.current?.click()

    const fileValues = useMemo(() => {
        if (props.multiple && !isEmpty(props.value))
            return Array.isArray(props.value) ? props.value : [props.value]
        return []
    }, [props.value])

    const fileValue = useMemo(() => {
        if (!props.multiple && !isEmpty(props.value))
            return Array.isArray(props.value) ? props.value[0] : props.value
        return null
    }, [props.value])

    return <div className={clsNames('relative w-full', props.className)}>

        <label className={clsNames(
            isFocused || (!isEmpty(fileValues) || !isEmpty(fileValue)) ? '-translate-y-4 text-xs' : 'text-sm',
            'absolute left-2 top-2 bg-white text-gray-500 transition-all duration-300 pointer-events-none'
        )}
               style={{ width: 'fit-content' }}>
            {props.label}
        </label>

        <div className={'flex items-start justify-between border border-gray-300 rounded p-2 w-full focus-within:outline-blue-500 text-sm bg-white'}>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-40 w-full pr-2">
                {(() => {

                    if (props.multiple && !isEmpty(fileValues))
                        return fileValues.map((file: any, i: number) => <UploadFileItem key={'file_' + i} file={file}
                                                                                        onDeleteFile={() => props.onChange(fileValues.filter((_, i2) => i !== i2))}/>)

                    if (!props.multiple && !isEmpty(fileValue))
                        return <UploadFileItem file={fileValue} onDeleteFile={() => props.onChange(null)}/>

                    return <span className={'text-gray-400'}>ยังไม่ได้เลือกไฟล์</span>
                })()}
            </div>


            {!props.readonly && (
                <button
                    onClick={onUpload}
                    type="button"
                    disabled={wait}
                    className="ml-2 bg-sky-500 hover:bg-sky-600 text-white text-xs px-3 py-1  rounded w-20">
                    {wait ? <Icon name={'loader'} className="h-4 mx-auto animate-spin"/> : 'Upload'}
                </button>
            )}
        </div>

        <input
            ref={fileInputRef}
            type="file"
            multiple={props.multiple}
            className="hidden"
            onChange={onChangeFile}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}/>

    </div>
}

function UploadFileItem (props: { file: any, onDeleteFile: () => void }) {
    const { file } = props

    return <div className="flex items-center gap-1 text-gray-700">
        <a href={file.url} target={'_blank'} className="truncate">
            <p className={'hover:text-blue-500 text-ellipsis'}>{file.name}</p>
        </a>

        <button className={'bg-transparent'} onClick={() => props.onDeleteFile()}>
            <Icon name={'x'} size={14} className={'text-red-500 hover:text-red-900'}/>
        </button>
    </div>
}