import { useState } from 'react'

import { post } from '../service/service'
import { download } from '../utlis'
import { tError } from './common'
import { Icon } from './icon'

interface PhotoProps {
    label?: string;
    value?: any;
    className?: string;
    multiple?: boolean;
    readonly?: boolean;
    onChange: (value?: any, e?: KeyboardEvent) => void;
}

export default function Photo (props: PhotoProps) {
    const [wait, setWait] = useState(false)

    const onChangePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            tError('อัพโหลดได้แค่ไฟล์รูปภาพเท่านั้น')
            props.onChange(null)
        }
        else {
            setWait(true)
            await post('app/upload', file).then((d) => {
                if (d.ok) {
                    props.onChange(d.files[0] || null)
                }
                else {
                    props.onChange(null)
                    tError('อัพโหลดไม่สำเร็จ')
                }
            }).finally(() => setWait(false))
        }
    }

    const removePhoto = () => props.onChange(null)

    return (
        <div className="mr-auto p-2 bg-white shadow-lg rounded-lg w-40">
            {!props.value ? <label className="block border-2 border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-blue-400 transition">
                    <input type="file" accept="image/*" className="hidden" onChange={onChangePhoto}/>
                    {wait ? (
                        <Icon name={'loader'} className="mx-auto text-blue-500 animate-spin"/>
                    ) : (
                        <div className="flex flex-col items-center text-gray-500">
                            <Icon size={28} name={'photo'} className="mb-1"/>
                            <span>{props.label || 'Select image'}</span>
                        </div>
                    )}
                </label>
                : <div className="relative">

                    <PhotoView url={props.value?.url || null}/>

                    {!props.readonly && <div>
                        <Icon name={'download'} size={16} className={'absolute left-1 bottom-1 bg-white p-0.5 rounded text-green-500 hover:green-red-900'}
                              onClick={() => download(props.value?.url)}/>
                        <Icon name={'trash'} size={16} className={'absolute right-1 bottom-1 bg-white p-0.5 rounded text-red-500 hover:text-red-900'} onClick={removePhoto}/>
                    </div>}

                </div>
            }

            {props.value && (
                <div className="flex justify-between items-center mt-2 text-xs text-gray-600 truncate">
                    <span className="truncate max-w-[70%]">{props.value.name}</span>
                    <span>{(props.value.size / 1024).toFixed(1)} KB</span>
                </div>
            )}
        </div>
    )
}

interface PhotoViewProps {
    url?: string
}

function PhotoView (props: PhotoViewProps) {
    const [error, setError] = useState(false)

    if (!props.url || error) {
        return (
            <div className="w-full h-32 flex items-center justify-center rounded-lg border border-gray-300 text-gray-400 bg-gray-50">
                <Icon name={'photo-off'} size={32}/>
            </div>
        )
    }

    return <a href={props.url} target="_blank" rel="noreferrer">
        <img
            src={props.url}
            alt="Preview"
            onError={() => setError(true)}
            className="w-full h-32 object-cover rounded-lg mb-2 cursor-pointer"/>
    </a>
}