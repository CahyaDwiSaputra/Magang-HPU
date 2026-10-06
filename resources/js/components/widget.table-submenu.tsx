import React from 'react'
import PropTypes from 'prop-types'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {Select as ReactSelect} from "@/components/select-form"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, LoaderCircle, RefreshCw} from "lucide-react"
import _ from "underscore"
import { boolean } from 'yup'


export default function TableSubmenu({...props}) {

    const typeFilter=e=>{
        const target=e.target

        if(target.name=="q"){
            if(timeout) clearTimeout(timeout)
            timeout=setTimeout(()=>{
                props.setFilter(
                    Object.assign({}, props.filter, {
                        [target.name]:target.value,
                        page:1
                    })
                )
            }, 500)
        }
        else{
            props.setFilter(
                Object.assign({}, props.filter, {
                    [target.name]:target.value,
                    page:1
                })
            )
        }
    }
    let timeout=0

    return (
        <div className='block w-full'>
            <div className="overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader className="bg-muted">
                        {props.renderHeader()}
                    </TableHeader>
                    <TableBody>
                        {(props.dataSource.isFetching)?
                            <TableRow className='hover:bg-muted/0'>
                                <TableCell className='text-center' colSpan={1000}>
                                    <div className='flex justify-center items-center'>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span className='text-muted-foreground ml-2'>Loading...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        :
                            <>
                                {!_.isNull(props.dataSource.error)?
                                    <TableRow className='hover:bg-muted/0'>
                                        <TableCell colSpan={1000} onClick={e=>props.refreshData()}>
                                            <span className='flex items-center justify-center text-muted-foreground'>Failed Load Data! &nbsp; <RefreshCw size={15}/></span>
                                        </TableCell>
                                    </TableRow>
                                :
                                    <>
                                        {props.dataSource.data.data.length==0&&
                                            <TableRow className='hover:bg-muted/0'>
                                                <TableCell colSpan={1000}>
                                                    <span className='flex items-center justify-center text-muted-foreground'>Data tidak ditemukan!</span>
                                                </TableCell>
                                            </TableRow>
                                        }

                                        {props.renderContent(props.dataSource.data.data)}
                                    </>
                                }
                            </>
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}