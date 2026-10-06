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
import { Edit2, PlusIcon, Trash2 } from "lucide-react"
import { request_employee, request_user } from "@/configs/request"
import { Head, usePage } from "@inertiajs/react"
import { useEffect, useState } from "react"
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
import { Modal, ModalBackdrop, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from "@/components/modal"
import LayoutNavbar from "@/components/layout-navbar"

const MySwal=withReactContent(swal)


const options_role=[
    {label:"Pilih Role", value:""},
    {label:"Admin", value:"admin"},
    {label:"Operator", value:"operator"}
]

export default function Page() {
    const auth=usePage().props.auth

    const [filter, setFilter]=useState({
        per_page:15,
        last_page:0,
        page:1,
        role:"",
        q:""
    })
    const [modal_tambah, setModalTambah]=useState({
        open:false,
        data:{
            employee_id:"",
            name:"",
            username:"",
            password:"",
            avatar_url:"",
            role:"",
            no_wa:"",
            email:""
        }
    })
    const [modal_edit, setModalEdit]=useState({
        open:false,
        data:{}
    })
    const [data_employees, setDataEmployee]=useState([])

    useEffect(()=>{
    }, [])

    //DATA/MUTATION
    const gets_user=useQuery({
        queryKey:["gets_user", filter],
        queryFn:async()=>request_user.gets(filter),
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
    // GET CATEGORY DATA FOR OPTIONS
    const mt_employee = useMutation({
        mutationFn: (params) => request_employee.gets(params),
        onError: err => {
            toast.error("Gets Employee Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_employee.mutate({}, {
            onSuccess: data => {
                setDataEmployee(data.data)
            }
        })
    }, [])

    //ACTIONS
    const toggleTambah=()=>{
        setModalTambah({
            open:!modal_tambah.open,
            data:{
                employee_id:"",
                name:"",
                username:"",
                password:"",
                avatar_url:"",
                role:"",
                no_wa:"",
                email:""
            }
        })
    }
    const toggleEdit=(list={}, show=false)=>{
        setModalEdit({
            open:show,
            data:Object.assign({}, list, {
                password:""
            })
        })
    }

    //VALUES
    const options_employee = () => {
        const data = data_employees.map(list => {
            return { label: list.EmployeeName, value: list.EmployeeID }
        })
        return [{ label: "Pilih Employee", value: "" }].concat(data)
    }


    return (
        <>
            <LayoutNavbar>
            {/* <SidebarProvider> */}
                <Head title="Data Users"/>
                {/* <AppSidebar variant="inset" />
                <SidebarInset> */}
                    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4">
                            {/* <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            /> */}
                            <h1 className="text-base font-medium">Data Users</h1>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-5 pt-0 mt-10">

                        <Table
                            dataSource={gets_user}
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
                options_employee={options_employee()}
            />

            {/* MODAL DIALOG EDIT */}
            <ModalEdit
                data={modal_edit}
                toggle={toggleEdit}
            />
        </>
    )
}

const Table=(props)=>{

    //DATA/MUTATION
    const hapus_data=useMutation({
        mutationFn:(id)=>request_user.delete(id),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_user']})
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


    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 my-2">
                <div className="">
                    <Select
                        options={options_role}
                        value={options_role.find(f=>f.value==props.filter.role)}
                        onChange={e=>typeFilter({target:{name:"role", value:e.value}})}
                    />
                </div>
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
                        onClick={e=>props.toggleTambah()}
                    >
                        <PlusIcon />
                        <span className="hidden lg:inline">Tambah User</span>
                    </Button>
                </div>
            </div>

            <TablePagination
                dataSource={props.dataSource}
                filter={props.filter}
                setFilter={props.setFilter}
                refreshData={()=>queryClient.invalidateQueries({queryKey:['gets_user']})}
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
                        headerClassName:"w-[120px] px-4",
                        itemClassName:"px-4 py-1",
                        header:"Username",
                        renderItem:(item)=>(
                            <>{item.username}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Nama Lengkap",
                        renderItem:(item)=>(
                            <>{item.name}</>
                        )
                    },
                    {
                        headerClassName:"w-[100px] px-4",
                        itemClassName:"px-4 py-1",
                        header:"Role",
                        renderItem:(item)=>(
                            <>{item.role}</>
                        )
                    },
                    {
                        headerClassName:"w-[120px] px-4",
                        itemClassName:"px-4 py-1",
                        header:"No. WA",
                        renderItem:(item)=>(
                            <>{item.no_wa}</>
                        )
                    },
                    {
                        headerClassName:"w-[120px] px-4",
                        itemClassName:"px-4 py-1",
                        header:"E-Mail",
                        renderItem:(item)=>(
                            <>{item.email}</>
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
        mutationFn:params=>request_user.add(params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_user']})
            props.toggle()
        },
        onError:err=>{
            if(err.response.data?.error=="VALIDATION_ERROR")
                toast.error(err.response.data.data, {position:"bottom-center"})
            else
                toast.error("Insert Data Failed! ", {position:"bottom-center"})
        }
    })

    //FORM

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
                        const new_values=Object.assign({}, values, {
                        })

                        tambah_data.mutate(new_values, {
                            onSettled:data=>{
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            username:yup.string().required(),
                            password:yup.string().required(),
                            role:yup.string().required(),
                            name:yup.string().required(),
                            avatar_url:yup.string().optional(),
                            no_wa:yup.string().required(),
                            email:yup.string().email().required(),
                            employee_id: yup.string().when('role', {
                                is: "operator",
                                then: (schema) => schema.required(),
                                otherwise: (schema) => schema.optional(),
                            })
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Tambah User</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Role User<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={options_role}
                                        value={options_role.find(f=>f.value==formik.values.role)}
                                        onChange={e=>{
                                            formik.setValues(
                                                Object.assign({}, formik.values, {
                                                    role:e.value,
                                                    employee_id:""
                                                })
                                            )
                                        }}
                                        className="col-span-3"
                                    />
                                </div>
                                {formik.values.role=="operator"&&
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label>
                                            Employee<span className="text-red-800">*</span>
                                        </Label>
                                        <Select
                                            options={props.options_employee}
                                            value={props.options_employee.find(f=>f.value==formik.values.employee_id)}
                                            onChange={e=>formik.setFieldValue("employee_id", e.value)}
                                            className="col-span-3 w-full"
                                        />
                                    </div>
                                }
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Username<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Password<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        type="password"
                                        placeholder=""
                                        className="col-span-3"
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Nama Lengkap<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        No. WA<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="no_wa"
                                        value={formik.values.no_wa}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        E-Mail<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder=""
                                        className="col-span-3"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        maxLength={200}
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
        mutationFn:params=>request_user.update(params.id, params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_user']})
            props.toggle()
        },
        onError:err=>{
            if(err.response.data?.error=="VALIDATION_ERROR")
                toast.error(err.response.data.data, {position:"bottom-center"})
            else
                toast.error("Update Data Failed! ", {position:"bottom-center"})
        }
    })

    //FORM
    
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
                        const new_values=Object.assign({}, values, {
                        })

                        edit_data.mutate(new_values, {
                            onSettled:data=>{
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            username:yup.string().required(),
                            password:yup.string().optional(),
                            name:yup.string().required(),
                            avatar_url:yup.string().optional(),
                            no_wa:yup.string().required(),
                            email:yup.string().email().required(),
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Edit User</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Role User<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={options_role}
                                        value={options_role.find(f=>f.value==formik.values.role)}
                                        className="col-span-3"
                                        isDisabled
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Username<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="username"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Password<span className="text-red-800">*</span>
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            type="password"
                                            placeholder=""
                                            className="col-span-3"
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            maxLength={200}
                                        />
                                        <span className="text-sm text-muted-foreground">Kosongkan password jika tidak dirubah!</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        Nama Lengkap<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        No. WA<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="no_wa"
                                        value={formik.values.no_wa}
                                        onChange={formik.handleChange}
                                        maxLength={200}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label>
                                        E-Mail<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        placeholder=""
                                        className="col-span-3"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        maxLength={200}
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