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
import { request_employee, request_site, request_department } from "@/configs/request"
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


export default function Page() {
    const auth=usePage().props.auth
    const [dataSite, setDataSite] = useState([])
    const [dataDepartment, setDataDepartment] = useState([])

    const [filter, setFilter]=useState({
        per_page:15,
        last_page:0,
        page:1,
        q:"",
    })
    const [modal_tambah, setModalTambah]=useState({
        open:false,
        data:{
            EmployeeID:"",
            EmployeeName:"",
            SiteId:"",
            DeptID:"",
            Class:"",
            Status:"",
            PositionName:""
        }
    })
    const [modal_edit, setModalEdit]=useState({
        open:false,
        data:{}
    })

    // GET SITE DATA FOR OPTIONS
    const mt_site = useMutation({
        mutationFn: (params) => request_site.gets(params),
        onError: err => {
            toast.error("Gets Site Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_site.mutate({}, {
            onSuccess: data => {
                setDataSite(data.data)
            }
        })
    }, [])

    // GET DEPARTMENT DATA FOR OPTIONS
    const mt_department = useMutation({
        mutationFn: (params) => request_department.gets(params),
        onError: err => {
            toast.error("Gets Department Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_department.mutate({}, {
            onSuccess: data => {
                setDataDepartment(data.data)
            }
        })
    }, [])

    // OPTIONS SITE
    const options_site = () => {
        const data = dataSite.map(list => {
            return { label: list.siteName || list.name, value: list.siteID || list.id }
        })
        return [{ label: "Pilih Site", value: "" }].concat(data)
    }

    // OPTIONS DEPARTMENT
    const options_department = () => {
        const data = dataDepartment.map(list => {
            return { label: list.deptName || list.name, value: list.deptID || list.id }
        })
        return [{ label: "Pilih Department", value: "" }].concat(data)
    }

    //DATA/MUTATION
    const gets_employee=useQuery({
        queryKey:["gets_employee", filter],
        queryFn:async()=>request_employee.gets(filter),
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
                EmployeeID:"",
                EmployeeName:"",
                SiteId:"",
                DeptID:"",
                Class:"",
                Status:"",
                PositionName:""
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
                <Head title="Data Employee"/>
                {/* <AppSidebar variant="inset" /> */}
                {/* <SidebarInset className="grow w-[calc(100%-256px)]"> */}
                    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4">
                            {/* <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            /> */}
                            <h1 className="text-base font-medium">Data Employee</h1>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-5 pt-0 mt-10">
                        

                        <Table
                            dataSource={gets_employee}
                            filter={filter}
                            setFilter={setFilter}
                            toggleEdit={toggleEdit}
                            toggleTambah={toggleTambah}
                        />
                        
                    </div>
                {/* </SidebarInset> */}
            {/* </SidebarProvider> */}
            </LayoutNavbar>

            {/* MODAL DIALOG TAMBAH */}
            <ModalTambah
                data={modal_tambah}
                toggle={toggleTambah}
                options_site={options_site()}
                options_department={options_department()}
            />

            {/* MODAL DIALOG EDIT */}
            <ModalEdit
                data={modal_edit}
                toggle={toggleEdit}
                options_site={options_site()}
                options_department={options_department()}
            />
        </>
    )
}

const Table=(props)=>{

    //DATA/MUTATION
    const hapus_data=useMutation({
        mutationFn:(employeeID)=>request_employee.delete(employeeID),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_employee']})
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
                        <span className="hidden lg:inline">Tambah Employee</span>
                    </Button>
                    
                </div>
            </div>

            <TablePagination
                dataSource={props.dataSource}
                filter={props.filter}
                setFilter={props.setFilter}
                refreshData={()=>queryClient.invalidateQueries({queryKey:['gets_employee']})}
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
                        header:"Employee ID",
                        renderItem:(item)=>(
                            <>{item.EmployeeID}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Employee Name",
                        renderItem:(item)=>(
                            <>{item.EmployeeName}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Site",
                        renderItem:(item)=>(
                            <>{item.site_rl?.siteID} - {item.site_rl?.siteName}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Department",
                        renderItem:(item)=>(
                            <>{item.department_rl?.deptCode} - {item.department_rl?.deptName}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[80px]",
                        itemClassName:"px-4 py-1",
                        header:"Class",
                        renderItem:(item)=>(
                            <>{item.Class}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Status",
                        renderItem:(item)=>(
                            <>{item.Status}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Position Name",
                        renderItem:(item)=>(
                            <>{item.PositionName}</>
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
                                                hapus_data.mutate(item.EmployeeID)
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
        mutationFn:params=>request_employee.add(params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_employee']})
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
                            EmployeeID:yup.string().required().max(10),
                            EmployeeName:yup.string().required().max(50),
                            SiteId:yup.string().required(),
                            DeptID:yup.string().required(),
                            Class:yup.string().required().max(5),
                            Status:yup.string().required().max(8),
                            PositionName:yup.string().required().max(60)
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Tambah Employee</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Employee ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="EmployeeID"
                                        value={formik.values.EmployeeID}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Employee Name<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="EmployeeName"
                                        value={formik.values.EmployeeName}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Site<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_site}
                                        value={props.options_site.find(f=>f.value==formik.values.SiteId)}
                                        onChange={e=>formik.setFieldValue("SiteId", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Department<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_department}
                                        value={props.options_department.find(f=>f.value==formik.values.DeptID)}
                                        onChange={e=>formik.setFieldValue("DeptID", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Class<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="Class"
                                        value={formik.values.Class}
                                        onChange={formik.handleChange}
                                        maxLength={5}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Status<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="Status"
                                        value={formik.values.Status}
                                        onChange={formik.handleChange}
                                        maxLength={8}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Position Name<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="PositionName"
                                        value={formik.values.PositionName}
                                        onChange={formik.handleChange}
                                        maxLength={60}
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
        mutationFn:params=>request_employee.update(params.EmployeeID, params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_employee']})
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
                            EmployeeID:yup.string().required().max(10),
                            EmployeeName:yup.string().required().max(50),
                            SiteId:yup.string().required(),
                            DeptID:yup.string().required(),
                            Class:yup.string().required().max(5),
                            Status:yup.string().required().max(8),
                            PositionName:yup.string().required().max(60)
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Edit Employee</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Employee ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="EmployeeID"
                                        value={formik.values.EmployeeID}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Employee Name<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="EmployeeName"
                                        value={formik.values.EmployeeName}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Site<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_site}
                                        value={props.options_site.find(f=>f.value==formik.values.SiteId)}
                                        onChange={e=>formik.setFieldValue("SiteId", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Department<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_department}
                                        value={props.options_department.find(f=>f.value==formik.values.DeptID)}
                                        onChange={e=>formik.setFieldValue("DeptID", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Class<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="Class"
                                        value={formik.values.Class}
                                        onChange={formik.handleChange}
                                        maxLength={5}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Status<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="Status"
                                        value={formik.values.Status}
                                        onChange={formik.handleChange}
                                        maxLength={8}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Position Name<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="PositionName"
                                        value={formik.values.PositionName}
                                        onChange={formik.handleChange}
                                        maxLength={60}
                                    />
                                </div>{JSON.stringify(formik.errors)}
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