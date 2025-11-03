import React from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

import { clsNames } from '../utlis'

export interface PagingData {
    page: number;
    pageCount: number;
    rowCount: number;
    rowPerPage: number;
    row: number;
    rownum: number;
}

export interface PagingProps {
    className?: string;
    page: PagingData;
    onChange: (page: PagingData) => void;
}

export const createPaging = (page: number = 1): PagingData => ({
    page,
    pageCount: 1,
    rowCount: 0,
    rowPerPage: 0,
    row: 0,
    rownum: 0,
})

export default function Paging (props: PagingProps) {
    const { onChange } = props
    const { page, pageCount } = props.page

    const getPages = () => {
        const pages: (number | string)[] = []

        if (pageCount <= 5) {
            for (let i = 1; i <= pageCount; i++) pages.push(i)
        }
        else {
            if (page <= 3) {
                pages.push(1, 2, 3, '...', pageCount - 1, pageCount)
            }
            else if (page >= pageCount - 2) {
                pages.push(1, 2, '...', pageCount - 2, pageCount - 1, pageCount)
            }
            else {
                pages.push(1, '...', page - 1, page, page + 1, '...', pageCount)
            }
        }
        return pages
    }

    const onChangePage = (p: number | string) => {
        if (typeof p === 'number' && p !== page && p >= 1 && p <= pageCount) {
            onChange({ ...props.page, page: p })
        }
    }

    const prevDisabled = page <= 1
    const nextDisabled = page >= pageCount

    return (
        <div className={clsNames('flex items-center gap-1.5 select-none', props.className)}>

            <button
                onClick={() => onChangePage(page - 1)}
                disabled={prevDisabled}
                className={`p-1.5 rounded-sm transition ${
                    prevDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                }`}>
                <IconChevronLeft size={20} stroke={2}/>
            </button>

            {pageCount <= 1
                ? <button className="px-3 py-1 rounded-md border text-sm bg-gray-800 text-white border-gray-800">1</button>
                : getPages().map((p, i) =>
                    p === '...'
                        ? <span key={i} className="px-2 text-gray-500">...</span>
                        : <button
                            key={i}
                            onClick={() => onChangePage(p)}
                            className={clsNames(
                                'px-3 py-1 rounded-md border text-sm transition-colors',
                                p === page
                                    ? 'bg-gray-800 text-white border-gray-800'
                                    : 'bg-white hover:bg-gray-100 border-gray-300'
                            )}>
                            {p}
                        </button>
                )
            }

            <button
                onClick={() => onChangePage(page + 1)}
                disabled={nextDisabled}
                className={`p-1.5 rounded-sm transition ${
                    nextDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 hover:bg-gray-200 active:scale-95'
                }`}>
                <IconChevronRight size={20} stroke={2}/>
            </button>


        </div>
    )
}