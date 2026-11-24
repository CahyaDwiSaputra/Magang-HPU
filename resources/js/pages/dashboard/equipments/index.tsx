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
import { request_equipment, request_company } from "@/configs/request"
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

// OPTIONS DELETED
const options_deleted = [
    { label: "Pilih Status", value: "" },
    { label: "Yes", value: "YES" },
    { label: "No", value: "NO" }
]

export default function Page() {
    const auth=usePage().props.auth
    const [dataCompany, setDataCompany] = useState([])

    const [filter, setFilter]=useState({
        per_page:15,
        last_page:0,
        page:1,
        q:"",
    })
    const [modal_tambah, setModalTambah]=useState({
        open:false,
        data:{
            equipment_id:"",
            manufacturer:"",
            model_number:"",
            tank_capacity:"",
            category:"",
            category_desc:"",
            auth_group:"",
            auth_text:"",
            company_code:"",
            createdBy:"",
            updatedBy:"",
            deleted:""
        }
    })
    const [modal_edit, setModalEdit]=useState({
        open:false,
        data:{}
    })

    // GET COMPANY DATA FOR OPTIONS
    const mt_company = useMutation({
        mutationFn: (params) => request_company.gets(params),
        onError: err => {
            toast.error("Gets Company Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_company.mutate({}, {
            onSuccess: data => {
                setDataCompany(data.data)
            }
        })
    }, [])

    // OPTIONS COMPANY
    const options_company = () => {
        const data = dataCompany.map(list => {
            return { label: list.company_code || list.name, value: list.company_code || list.id }
        })
        return [{ label: "Pilih Company", value: "" }].concat(data)
    }

    //DATA/MUTATION
    const gets_equipment=useQuery({
        queryKey:["gets_equipment", filter],
        queryFn:async()=>request_equipment.gets(filter),
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
                equipment_id:"",
                manufacturer:"",
                model_number:"",
                tank_capacity:"",
                category:"",
                category_desc:"",
                auth_group:"",
                auth_text:"",
                company_code:"",
                createdBy:"",
                updatedBy:"",
                deleted:""
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
            <LayoutNavbar
                containerClassName="w-full max-w-[98%] 2xl:max-w-[1920px]"
                className="!bg-slate-100/70 rounded-2xl shadow-xl border border-slate-200/80 p-3.5 md:p-5"
            >
            {/* <SidebarProvider> */}
                <Head title="Data Equipment"/>
                {/* <AppSidebar variant="inset" />
                <SidebarInset className="grow w-[calc(100%-256px)]"> */}
                    {/* ── TOP HEADER MASTER DATA EQUIPMENT (POIN 15) ── */}
                    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                                    MASTER DATA EQUIPMENT
                                </h1>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                    General & Support
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                                Klasifikasi armada tambang terstandarisasi: <strong>General Equipment</strong> (Exca, DT, HD) & <strong>Support Equipment</strong> (Alat Pendukung)
                            </p>
                        </div>

                        {/* Quick Category Switcher Pills */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Kategori:</span>
                            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                                <button
                                    type="button"
                                    onClick={() => setFilter(prev => ({ ...prev, q: '', page: 1 }))}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        !filter.q || (filter.q !== 'General' && filter.q !== 'Support')
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Semua ({gets_equipment.data?.total || 99})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilter(prev => ({ ...prev, q: 'General', page: 1 }))}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        filter.q === 'General'
                                            ? 'bg-blue-600 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    General (16)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilter(prev => ({ ...prev, q: 'Support', page: 1 }))}
                                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                                        filter.q === 'Support'
                                            ? 'bg-slate-700 text-white shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    Support (83)
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
                        <Table
                            dataSource={gets_equipment}
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
                options_company={options_company()}
                options_deleted={options_deleted}
            />

            {/* MODAL DIALOG EDIT */}
            <ModalEdit
                data={modal_edit}
                toggle={toggleEdit}
                options_company={options_company()}
                options_deleted={options_deleted}
            />
        </>
    )
}

const Table=(props)=>{

    //DATA/MUTATION
    const hapus_data=useMutation({
        mutationFn:(equipment_id)=>request_equipment.delete(equipment_id),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_equipment']})
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

    //VALUES
    const valueDeleted = (value) => {
        const found = options_deleted.find(item => item.value == value)
        return found ? found.label : value
    }

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
                        <span className="hidden lg:inline">Tambah Equipment</span>
                    </Button>
                    
                </div>
            </div>

            <TablePagination
                dataSource={props.dataSource}
                filter={props.filter}
                setFilter={props.setFilter}
                refreshData={()=>queryClient.invalidateQueries({queryKey:['gets_equipment']})}
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
                        header:"Equipment ID",
                        renderItem:(item)=>(
                            <>{item.equipment_id}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Manufacturer",
                        renderItem:(item)=>(
                            <>{item.manufacturer}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Model Number",
                        renderItem:(item)=>(
                            <>{item.model_number}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Tank Capacity",
                        renderItem:(item)=>(
                            <NumericFormat 
                                displayType="text"
                                value={item.tank_capacity}
                                decimalScale={0}
                                thousandSeparator
                            />
                        )
                    },
                    {
                        headerClassName:"px-4 w-[120px]",
                        itemClassName:"px-4 py-1",
                        header:"Kategori",
                        renderItem:(item)=>(
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${
                                item.category === 'General'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : item.category === 'Support'
                                    ? 'bg-slate-100 text-slate-700 border-slate-300'
                                    : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    item.category === 'General' ? 'bg-blue-600' : 'bg-slate-500'
                                }`}></span>
                                {item.category || '-'}
                            </span>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Category Desc",
                        renderItem:(item)=>(
                            <>{item.category_desc}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[80px]",
                        itemClassName:"px-4 py-1",
                        header:"Auth Group",
                        renderItem:(item)=>(
                            <>{item.auth_group}</>
                        )
                    },
                    {
                        headerClassName:"px-4",
                        itemClassName:"px-4 py-1",
                        header:"Auth Text",
                        renderItem:(item)=>(
                            <>{item.auth_text}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Company",
                        renderItem:(item)=>(
                            <>{item.company_rl?.company_code} - {item.company_rl?.company_name}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Created By",
                        renderItem:(item)=>(
                            <>{item.createdBy}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[100px]",
                        itemClassName:"px-4 py-1",
                        header:"Updated By",
                        renderItem:(item)=>(
                            <>{item.updatedBy}</>
                        )
                    },
                    {
                        headerClassName:"px-4 w-[80px]",
                        itemClassName:"px-4 py-1",
                        header:"Deleted",
                        renderItem:(item)=>(
                            <>{valueDeleted(item.deleted)}</>
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
                                                hapus_data.mutate(item.equipment_id)
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
        mutationFn:params=>request_equipment.add(params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_equipment']})
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
                            equipment_id:yup.string().required().max(30),
                            manufacturer:yup.string().required().max(30),
                            model_number:yup.string().required().max(30),
                            tank_capacity:yup.number().required().integer().max(999999999),
                            category:yup.string().required().max(20),
                            category_desc:yup.string().required().max(45),
                            auth_group:yup.string().required().max(3),
                            auth_text:yup.string().required().max(45),
                            company_code:yup.string().required().max(4),
                            createdBy:yup.string().required().max(50),
                            updatedBy:yup.string().required().max(50),
                            deleted:yup.string().required()
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Tambah Equipment</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Equipment ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="equipment_id"
                                        value={formik.values.equipment_id}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Manufacturer<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="manufacturer"
                                        value={formik.values.manufacturer}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Model Number<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="model_number"
                                        value={formik.values.model_number}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Tank Capacity<span className="text-red-800">*</span>
                                    </Label>
                                    <NumericFormat 
                                        value={formik.values.tank_capacity} 
                                        onValueChange={(values)=>formik.setFieldValue("tank_capacity", values.value)}
                                        customInput={Input} 
                                        className="col-span-3" 
                                        placeholder=""
                                        decimalScale={0}
                                        thousandSeparator
                                        maxLength={9}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Kategori Alat Berat (Poin 15)<span className="text-red-800">*</span>
                                    </Label>
                                    <select
                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        name="category"
                                        value={formik.values.category}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            formik.setFieldValue('category', val);
                                            formik.setFieldValue(
                                                'category_desc',
                                                val === 'General'
                                                    ? 'General Equipment (Produksi Utama)'
                                                    : val === 'Support'
                                                    ? 'Support Equipment (Alat Pendukung)'
                                                    : ''
                                            );
                                        }}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        <option value="General">General (Exca, DT, HD - Produksi Utama)</option>
                                        <option value="Support">Support (Dozer, Grader, WT, FT - Alat Pendukung)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Deskripsi Kategori<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        readOnly
                                        placeholder="Auto-filled sesuai kategori"
                                        className="col-span-3 bg-slate-50 text-slate-700 font-medium text-xs"
                                        name="category_desc"
                                        value={formik.values.category_desc}
                                        onChange={formik.handleChange}
                                        maxLength={45}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Auth Group<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="auth_group"
                                        value={formik.values.auth_group}
                                        onChange={formik.handleChange}
                                        maxLength={3}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Auth Text<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="auth_text"
                                        value={formik.values.auth_text}
                                        onChange={formik.handleChange}
                                        maxLength={45}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Company<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_company}
                                        value={props.options_company.find(f=>f.value==formik.values.company_code)}
                                        onChange={e=>formik.setFieldValue("company_code", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Created By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="createdBy"
                                        value={formik.values.createdBy}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Updated By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="updatedBy"
                                        value={formik.values.updatedBy}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Deleted<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_deleted}
                                        value={props.options_deleted.find(f=>f.value==formik.values.deleted)}
                                        onChange={e=>formik.setFieldValue("deleted", e.value)}
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
        mutationFn:params=>request_equipment.update(params.equipment_id, params),
        onSuccess:data=>{
            queryClient.invalidateQueries({queryKey:['gets_equipment']})
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
                            equipment_id:yup.string().required().max(30),
                            manufacturer:yup.string().required().max(30),
                            model_number:yup.string().required().max(30),
                            tank_capacity:yup.number().required().integer().max(999999999),
                            category:yup.string().required().max(20),
                            category_desc:yup.string().required().max(45),
                            auth_group:yup.string().required().max(3),
                            auth_text:yup.string().required().max(45),
                            company_code:yup.string().required().max(4),
                            createdBy:yup.string().required().max(50),
                            updatedBy:yup.string().required().max(50),
                            deleted:yup.string().required()
                        })
                    }
                >
                    {formik=>(
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Edit Equipment</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Equipment ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="equipment_id"
                                        value={formik.values.equipment_id}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                        disabled={true}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Manufacturer<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="manufacturer"
                                        value={formik.values.manufacturer}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Model Number<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="model_number"
                                        value={formik.values.model_number}
                                        onChange={formik.handleChange}
                                        maxLength={30}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Tank Capacity<span className="text-red-800">*</span>
                                    </Label>
                                    <NumericFormat 
                                        value={formik.values.tank_capacity} 
                                        onValueChange={(values)=>formik.setFieldValue("tank_capacity", values.value)}
                                        customInput={Input} 
                                        className="col-span-3" 
                                        placeholder=""
                                        decimalScale={0}
                                        thousandSeparator
                                        maxLength={9}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Kategori Alat Berat (Poin 15)<span className="text-red-800">*</span>
                                    </Label>
                                    <select
                                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        name="category"
                                        value={formik.values.category}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            formik.setFieldValue('category', val);
                                            formik.setFieldValue(
                                                'category_desc',
                                                val === 'General'
                                                    ? 'General Equipment (Produksi Utama)'
                                                    : val === 'Support'
                                                    ? 'Support Equipment (Alat Pendukung)'
                                                    : ''
                                            );
                                        }}
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        <option value="General">General (Exca, DT, HD - Produksi Utama)</option>
                                        <option value="Support">Support (Dozer, Grader, WT, FT - Alat Pendukung)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Deskripsi Kategori<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        readOnly
                                        placeholder="Auto-filled sesuai kategori"
                                        className="col-span-3 bg-slate-50 text-slate-700 font-medium text-xs"
                                        name="category_desc"
                                        value={formik.values.category_desc}
                                        onChange={formik.handleChange}
                                        maxLength={45}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Auth Group<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="auth_group"
                                        value={formik.values.auth_group}
                                        onChange={formik.handleChange}
                                        maxLength={3}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Auth Text<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="auth_text"
                                        value={formik.values.auth_text}
                                        onChange={formik.handleChange}
                                        maxLength={45}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Company<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_company}
                                        value={props.options_company.find(f=>f.value==formik.values.company_code)}
                                        onChange={e=>formik.setFieldValue("company_code", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Created By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="createdBy"
                                        value={formik.values.createdBy}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Updated By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="updatedBy"
                                        value={formik.values.updatedBy}
                                        onChange={formik.handleChange}
                                        maxLength={50}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Deleted<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_deleted}
                                        value={props.options_deleted.find(f=>f.value==formik.values.deleted)}
                                        onChange={e=>formik.setFieldValue("deleted", e.value)}
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