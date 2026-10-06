import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import axios from "axios"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Edit2, Ellipsis, EllipsisIcon, EllipsisVertical, PlusIcon, Trash2 } from "lucide-react"
import { request_item_category, request_category, request_dedicated } from "@/configs/request"
import { Head, router, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import TablePagination from "@/components/widget.table-pagination"
import { toast } from "sonner"
import swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Select } from "@/components/select-form"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import * as yup from "yup"
import { Formik } from 'formik'
import { Label } from "@/components/ui/label"
import { queryClient } from "@/configs/query_client"
import { NumericFormat } from 'react-number-format'
import { Modal, ModalBackdrop, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from "@/components/modal"
import {useDropzone} from 'react-dropzone'
import * as ExcelJS from "exceljs"
import { readFile } from "@/configs/helpers"
import * as _ from "underscore"
import { WidgetDropExcel } from "@/components/widget.dropzone"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DatePicker } from "@/components/datepicker"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import LayoutNavbar from "@/components/layout-navbar"

const MySwal=withReactContent(swal)

// OPTIONS REQUIRED OPERATOR
const options_required_operator = [
    { label: "Pilih Operator", value: "" },
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" }
]

export default function Page() {
    const auth=usePage().props.auth
    const [dataCategory, setDataCategory] = useState([])
    const [dataDedicated, setDataDedicated] = useState([])

    const [filter, setFilter]=useState({
        per_page:15,
        last_page:0,
        page:1,
        q:"",
    })
    const [modal_tambah, setModalTambah]=useState({
        open:false,
        data:{
            category_id:"",
            item_category:"",
            required_operator:"",
            dedicated:""
        }
    })
    const [modal_edit, setModalEdit]=useState({
        open:false,
        data:{}
    })

    // GET CATEGORY DATA FOR OPTIONS
    const mt_category = useMutation({
        mutationFn: (params) => request_category.gets(params),
        onError: err => {
            toast.error("Gets Category Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_category.mutate({}, {
            onSuccess: data => {
                setDataCategory(data.data)
            }
        })
    }, [])

    // GET DEDICATED DATA FOR OPTIONS
    const mt_dedicated = useMutation({
        mutationFn: (params) => request_dedicated.gets(params),
        onError: err => {
            toast.error("Gets Dedicated Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_dedicated.mutate({}, {
            onSuccess: data => {
                setDataDedicated(data.data)
            }
        })
    }, [])

    // OPTIONS CATEGORY
    const options_category = () => {
        const data = dataCategory.map(list => {
            return { label: list.status_category || list.name, value: list.id }
        })
        return [{ label: "Pilih Category", value: "" }].concat(data)
    }

    // OPTIONS DEDICATED
    const options_dedicated = () => {
        const data = dataDedicated.map(list => {
            return { label: list.dedicated_value || list.name, value: list.id }
        })
        return [{ label: "Pilih Dedicated", value: "" }].concat(data)
    }

    //DATA/MUTATION
    const gets_item_category=useQuery({
        queryKey:["gets_item_category", filter],
        queryFn:async()=>request_item_category.gets(filter),
        initialData:{
            data:[],
            last_page:0,
            first_page:1,
            current_page:1,
            total:0
        },
        refetchOnWindowFocus:false,
        refetchOnReconnect:false
    })

    //ACTIONS
    const toggleTambah=()=>{
        setModalTambah({
            open:!modal_tambah.open,
            data:{
                category_id:"",
                item_category:"",
                required_operator:"",
                dedicated:""
            }
        })
    }
    const toggleEdit=(list={}, show=false)=>{
        setModalEdit({
            open:show,
            data:Object.assign({}, list, {
            })
        })
    }


    return (
        <>
            <LayoutNavbar>
            {/* <SidebarProvider> */}
                <Head title="Data Item Category"/>
                {/* <AppSidebar variant="inset" />
                <SidebarInset className="grow w-[calc(100%-256px)]"> */}
                    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4">
                            {/* <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            /> */}
                            <h1 className="text-base font-medium">Data Item Category</h1>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-5 pt-0 mt-10">
                        

                        <Table
                            dataSource={gets_item_category}
                            filter={filter}
                            setFilter={setFilter}
                            toggleEdit={toggleEdit}
                            toggleTambah={toggleTambah}
                        />
                        
                    </div>
                {/* </SidebarInset>
            </SidebarProvider> */}
            </LayoutNavbar>

            {/* MODAL DIALOG TAMBAH */}
            <ModalTambah
                data={modal_tambah}
                toggle={toggleTambah}
                options_category={options_category()}
                options_dedicated={options_dedicated()}
                options_required_operator={options_required_operator}
            />

            {/* MODAL DIALOG EDIT */}
            <ModalEdit
                data={modal_edit}
                toggle={toggleEdit}
                options_category={options_category()}
                options_dedicated={options_dedicated()}
                options_required_operator={options_required_operator}
            />
        </>
    )
}

const Table=(props)=>{

    //DATA/MUTATION
    const hapus_data=useMutation({
        mutationFn:(id)=>request_item_category.delete(id),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_item_category']})
        },
        onError:err=>{
            toast.error("Remove Data Failed!", {position:"bottom-center"})
        }
    })

    //FILTER
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

    //DATA
    
    //VALUES

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 my-2">
                <div className="">
                    <Input
                        placeholder="Cari Data..."
                        className="col-span-3"
                        name="q"
                        onChange={typeFilter}
                        maxLength={200}
                    />
                </div>
                <div className="col-start-5 flex items-center justify-end overflow-hidden">
                    <Button 
                        size="sm"
                        type="button"
                        className="mr-1"
                        onClick={e=>props.toggleTambah()}
                    >
                        <PlusIcon />
                        <span className="hidden lg:inline">Tambah Item Category</span>
                    </Button>
                </div>
            </div>

            <TablePagination
                dataSource={props.dataSource}
                filter={props.filter}
                setFilter={props.setFilter}
                refreshData={()=>queryClient.invalidateQueries({queryKey:['gets_item_category']})}
                columns={[
                    {
                        headerClassName:"w-[50px] px-4",
                        itemClassName:"font-medium px-4",
                        header:"#",
                        renderItem:(item, idx, page, filter)=>(
                            <>{(idx+1)+((page-1)*filter.per_page)}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Category",
                        renderItem:(item)=>(
                            <>{item.category_rl?.status_category}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Item Category",
                        renderItem:(item)=>(
                            <>{item.item_category}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[150px]",
                        itemClassName:"px-4 py-1",
                        header:"Required Operator",
                        renderItem:(item)=>(
                            <>{item.required_operator}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Dedicated",
                        renderItem:(item)=>(
                            <>{item.dedicated_rl?.dedicated_value}</>
                        )
                    },
                    {
                        headerClassName:"w-[50px] px-4",
                        itemClassName:"px-4 py-1",
                        header:"",
                        renderItem:(item)=>(
                            <div className="flex">
                                <Button type="button" variant="outline" size="icon" className="size-7" onClick={e=>props.toggleEdit(item, true)}>
                                    <Edit2/> 
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="icon" 
                                    className="size-7 ml-1"
                                    onClick={e=>{
                                        MySwal.fire({
                                            title: "Yakin ingin menghapus data?",
                                            text: "Data yang sudah dihapus mungkin tidak bisa dikembalikan lagi!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Ya, Hapus Data!',
                                            cancelButtonText: 'Batal!',
                                            reverseButtons: true,
                                            customClass:{
                                                popup:"!w-auto !bg-white !rounded-2xl",
                                                title:"!text-lg",
                                                htmlContainer:"!text-sm bg-white",
                                                confirmButton:"focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2",
                                                cancelButton:"py-1.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
                                            },
                                            buttonsStyling:false
                                        })
                                        .then(result=>{
                                            if(result.isConfirmed){
                                                hapus_data.mutate(item.id)
                                            }
                                        })
                                    }}
                                >
                                    <Trash2/>
                                </Button>
                            </div>
                        )
                    }
                ]}
            />
        </>
    )
}

const ModalTambah=(props)=>{
    const auth=usePage().props.auth

    const tambah_data=useMutation({
        mutationFn:params=>request_item_category.add(params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_item_category']})
            props.toggle()
        },
        onError:err=>{
            if(err.response.data?.error=="VALIDATION_ERROR")
                toast.error(err.response.data.data, {position:"bottom-center"})
            else
                toast.error("Insert Data Failed! ", {position:"bottom-center"})
        }
    })

    return (
        <Modal
            open={props.data.open}
            onClose={()=>props.toggle()}
            static_backdrop
            transition
            className="transition duration-200 ease-out"
        >
            <ModalBackdrop/>
            <ModalDialog>
                <Formik
                    initialValues={props.data.data}
                    onSubmit={(values, actions)=>{
                        const new_values=Object.assign({}, values, {})

                        tambah_data.mutate(new_values, {
                            onSettled:data=>{
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            category_id:yup.string().required(),
                            item_category:yup.string().required().max(30),
                            required_operator:yup.string().required().oneOf(['YES', 'NO']),
                            dedicated:yup.string().required()
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Tambah Item Category</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Category<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_category}
                                        value={props.options_category.find(f=>f.value==formik.values.category_id)}
                                        onChange={e=>formik.setFieldValue("category_id", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Item Category<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="item_category"
                                        value={formik.values.item_category}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Required Operator<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_required_operator}
                                        value={props.options_required_operator.find(f=>f.value==formik.values.required_operator)}
                                        onChange={e=>formik.setFieldValue("required_operator", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Dedicated<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_dedicated}
                                        value={props.options_dedicated.find(f=>f.value==formik.values.dedicated)}
                                        onChange={e=>formik.setFieldValue("dedicated", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                            </div>
                            <ModalFooter>
                                <Button 
                                    type="submit" 
                                    disabled={formik.isSubmitting||!(formik.dirty&&formik.isValid)}
                                >
                                    Save changes
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </Formik>
            </ModalDialog>
        </Modal>
    )
}

const ModalEdit=(props)=>{
    const auth=usePage().props.auth

    const edit_data=useMutation({
        mutationFn:params=>request_item_category.update(params.id, params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_item_category']})
            props.toggle()
        },
        onError:err=>{
            if(err.response.data?.error=="VALIDATION_ERROR")
                toast.error(err.response.data.data, {position:"bottom-center"})
            else
                toast.error("Update Data Failed! ", {position:"bottom-center"})
        }
    })
    
    return (
        <Modal
            open={props.data.open}
            onClose={()=>props.toggle()}
            static_backdrop
            transition
            className="transition duration-200 ease-out"
        >
            <ModalBackdrop/>
            <ModalDialog>
                <Formik
                    initialValues={props.data.data}
                    onSubmit={(values, actions)=>{
                        const new_values=Object.assign({}, values, {})

                        edit_data.mutate(new_values, {
                            onSettled:data=>{
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            category_id:yup.string().required(),
                            item_category:yup.string().required().max(30),
                            required_operator:yup.string().required().oneOf(['YES', 'NO']),
                            dedicated:yup.string().required()
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Edit Item Category</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Category<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_category}
                                        value={props.options_category.find(f=>f.value==formik.values.category_id)}
                                        onChange={e=>formik.setFieldValue("category_id", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Item Category<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="item_category"
                                        value={formik.values.item_category}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Required Operator<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_required_operator}
                                        value={props.options_required_operator.find(f=>f.value==formik.values.required_operator)}
                                        onChange={e=>formik.setFieldValue("required_operator", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Dedicated<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_dedicated}
                                        value={props.options_dedicated.find(f=>f.value==formik.values.dedicated)}
                                        onChange={e=>formik.setFieldValue("dedicated", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                            </div>
                            <ModalFooter>
                                <Button 
                                    type="submit" 
                                    disabled={formik.isSubmitting||!(formik.dirty&&formik.isValid)}
                                >
                                    Save changes
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </Formik>
            </ModalDialog>
        </Modal>
    )
}