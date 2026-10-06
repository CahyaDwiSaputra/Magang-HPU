// pages/TruckFactor.jsx
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
import { request_truck_factor, request_site, request_pit_location } from "@/configs/request"
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

const MySwal = withReactContent(swal)

export default function Page() {
    const auth = usePage().props.auth

    // State untuk options
    const [dataSite, setDataSite] = useState([])
    const [dataLocation, setDataLocation] = useState([])

    // Ambil data site
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

    // Ambil data pit location
    const mt_location = useMutation({
        mutationFn: (params) => request_pit_location.gets(params),
        onError: err => {
            toast.error("Gets Location Data Failed!", { position: "bottom-center" })
        }
    })
    useEffect(() => {
        mt_location.mutate({}, {
            onSuccess: data => {
                setDataLocation(data.data)
            }
        })
    }, [])

    // Options functions
    const options_site = () => {
        const data = dataSite.map(list => {
            return { label: list.name || list.siteName || list.site, value: list.siteID }
        })
        return [{ label: "Pilih Site", value: "" }].concat(data)
    }

    const options_location = () => {
        const data = dataLocation.map(list => {
            return { label: list.name || list.location_name || list.pit_location, value: list.id }
        })
        return [{ label: "Pilih Location", value: "" }].concat(data)
    }

    const [filter, setFilter] = useState({
        per_page: 15,
        last_page: 0,
        page: 1,
        q: "",
    })

    const [modal_tambah, setModalTambah] = useState({
        open: false,
        data: {
            site: "",
            location_id: "",
            model_number: "",
            truck_factor: "",
            created_by: "",
            updated_by: ""
        }
    })

    const [modal_edit, setModalEdit] = useState({
        open: false,
        data: {}
    })

    // DATA/MUTATION
    const gets_truck_factor = useQuery({
        queryKey: ["gets_truck_factor", filter],
        queryFn: async () => request_truck_factor.gets(filter),
        initialData: {
            data: [],
            last_page: 0,
            first_page: 1,
            current_page: 1,
            total: 0
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })

    // ACTIONS
    const toggleTambah = () => {
        setModalTambah({
            open: !modal_tambah.open,
            data: {
                site: "",
                location_id: "",
                model_number: "",
                truck_factor: "",
                created_by: "",
                updated_by: ""
            }
        })
    }

    const toggleEdit = (list = {}, show = false) => {
        setModalEdit({
            open: show,
            data: Object.assign({}, list, {})
        })
    }

    return (
        <>
            <LayoutNavbar>
            {/* <SidebarProvider> */}
                <Head title="Data Truck Factor" />
                {/* <AppSidebar variant="inset" />
                <SidebarInset className="grow w-[calc(100%-256px)]"> */}
                    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                        <div className="flex items-center gap-2 px-4">
                            {/* <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            /> */}
                            <h1 className="text-base font-medium">Data Truck Factor</h1>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-5 pt-0 mt-10">
                        <Table
                            dataSource={gets_truck_factor}
                            filter={filter}
                            setFilter={setFilter}
                            toggleEdit={toggleEdit}
                            toggleTambah={toggleTambah}
                            options_site={options_site()}
                            options_location={options_location()}
                        />
                    </div>
                {/* </SidebarInset>
            </SidebarProvider> */}
            </LayoutNavbar>

            {/* MODAL DIALOG TAMBAH */}
            <ModalTambah
                data={modal_tambah}
                toggle={toggleTambah}
                options_site={options_site()}
                options_location={options_location()}
            />

            {/* MODAL DIALOG EDIT */}
            <ModalEdit
                data={modal_edit}
                toggle={toggleEdit}
                options_site={options_site()}
                options_location={options_location()}
            />
        </>
    )
}

const Table = (props) => {
    // DATA/MUTATION
    const hapus_data = useMutation({
        mutationFn: (id) => request_truck_factor.delete(id),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['gets_truck_factor'] })
        },
        onError: err => {
            toast.error("Remove Data Failed!", { position: "bottom-center" })
        }
    })

    // FILTER
    const typeFilter = e => {
        const target = e.target

        if (target.name == "q") {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => {
                props.setFilter(
                    Object.assign({}, props.filter, {
                        [target.name]: target.value,
                        page: 1
                    })
                )
            }, 500)
        } else {
            props.setFilter(
                Object.assign({}, props.filter, {
                    [target.name]: target.value,
                    page: 1
                })
            )
        }
    }
    let timeout = 0

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
                        onClick={e => props.toggleTambah()}
                    >
                        <PlusIcon />
                        <span className="hidden lg:inline">Tambah Truck Factor</span>
                    </Button>
                </div>
            </div>

            <TablePagination
                dataSource={props.dataSource}
                filter={props.filter}
                setFilter={props.setFilter}
                refreshData={() => queryClient.invalidateQueries({ queryKey: ['gets_truck_factor'] })}
                columns={[
                    {
                        headerClassName: "w-[50px] px-4",
                        itemClassName: "font-medium px-4",
                        header: "#",
                        renderItem: (item, idx, page, filter) => (
                            <>{ (idx + 1) + ((page - 1) * filter.per_page) }</>
                        )
                    },
                    {
                        headerClassName: "px-4",
                        itemClassName: "px-4 py-1",
                        header: "Site",
                        renderItem: (item) => (
                            <>{item.site_rl?.siteID} - {item.site_rl?.siteName}</>
                        )
                    },
                    {
                        headerClassName: "px-4",
                        itemClassName: "px-4 py-1",
                        header: "Location",
                        renderItem: (item) => (
                            <>{item.location_rl?.location_name}</>
                        )
                    },
                    {
                        headerClassName: "px-4",
                        itemClassName: "px-4 py-1",
                        header: "Model Number",
                        renderItem: (item) => (
                            <>{item.model_number}</>
                        )
                    },
                    {
                        headerClassName: "px-4 w-[120px]",
                        itemClassName: "px-4 py-1",
                        header: "Truck Factor",
                        renderItem: (item) => (
                            <NumericFormat
                                displayType="text"
                                value={item.truck_factor}
                                decimalScale={0}
                                thousandSeparator
                            />
                        )
                    },
                    {
                        headerClassName: "px-4",
                        itemClassName: "px-4 py-1",
                        header: "Created By",
                        renderItem: (item) => (
                            <>{item.created_by}</>
                        )
                    },
                    {
                        headerClassName: "px-4",
                        itemClassName: "px-4 py-1",
                        header: "Updated By",
                        renderItem: (item) => (
                            <>{item.updated_by}</>
                        )
                    },
                    {
                        headerClassName: "w-[50px] px-4",
                        itemClassName: "px-4 py-1",
                        header: "",
                        renderItem: (item) => (
                            <div className="flex">
                                <Button type="button" variant="outline" size="icon" className="size-7" onClick={e => props.toggleEdit(item, true)}>
                                    <Edit2 />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="size-7 ml-1"
                                    onClick={e => {
                                        MySwal.fire({
                                            title: "Yakin ingin menghapus data?",
                                            text: "Data yang sudah dihapus mungkin tidak bisa dikembalikan lagi!",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonText: 'Ya, Hapus Data!',
                                            cancelButtonText: 'Batal!',
                                            reverseButtons: true,
                                            customClass: {
                                                popup: "!w-auto !bg-white !rounded-2xl",
                                                title: "!text-lg",
                                                htmlContainer: "!text-sm bg-white",
                                                confirmButton: "focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-1.5 me-2 mb-2",
                                                cancelButton: "py-1.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10"
                                            },
                                            buttonsStyling: false
                                        })
                                            .then(result => {
                                                if (result.isConfirmed) {
                                                    hapus_data.mutate(item.id)
                                                }
                                            })
                                    }}
                                >
                                    <Trash2 />
                                </Button>
                            </div>
                        )
                    }
                ]}
            />
        </>
    )
}

const ModalTambah = (props) => {
    const auth = usePage().props.auth

    const tambah_data = useMutation({
        mutationFn: params => request_truck_factor.add(params),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['gets_truck_factor'] })
            props.toggle()
        },
        onError: err => {
            toast.error("Insert Data Failed! ", { position: "bottom-center" })
        }
    })

    return (
        <Modal
            open={props.data.open}
            onClose={() => props.toggle()}
            static_backdrop
            transition
            className="transition duration-200 ease-out"
        >
            <ModalBackdrop />
            <ModalDialog>
                <Formik
                    initialValues={props.data.data}
                    onSubmit={(values, actions) => {
                        tambah_data.mutate(values, {
                            onSettled: data => {
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            site: yup.string().required(),
                            location_id: yup.string().required(),
                            model_number: yup.string().required().max(30),
                            truck_factor: yup.number().required().integer(),
                            created_by: yup.string().required().max(10),
                            updated_by: yup.string().required().max(10)
                        })
                    }
                >
                    {formik => (
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Tambah Truck Factor</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Site<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_site}
                                        value={props.options_site.find(f => f.value == formik.values.site)}
                                        onChange={e => formik.setFieldValue("site", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Location ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_location}
                                        value={props.options_location.find(f => f.value == formik.values.location_id)}
                                        onChange={e => formik.setFieldValue("location_id", e.value)}
                                        className="col-span-3 w-full"
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
                                        Truck Factor (0-100)<span className="text-red-800">*</span>
                                    </Label>
                                    <NumericFormat
                                        value={formik.values.truck_factor}
                                        onValueChange={(values) => formik.setFieldValue("truck_factor", values.value)}
                                        isAllowed={values=>{
                                            return values.floatValue===undefined || (values.floatValue>=0 && values.floatValue<100)
                                        }}
                                        customInput={Input}
                                        className="col-span-3"
                                        placeholder=""
                                        decimalScale={0}
                                        thousandSeparator
                                        maxLength={20}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Created By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="created_by"
                                        value={formik.values.created_by}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Updated By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="updated_by"
                                        value={formik.values.updated_by}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
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

const ModalEdit = (props) => {
    const auth = usePage().props.auth

    const edit_data = useMutation({
        mutationFn: params => request_truck_factor.update(params.id, params),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['gets_truck_factor'] })
            props.toggle()
        },
        onError: err => {
            toast.error("Update Data Failed! ", { position: "bottom-center" })
        }
    })

    return (
        <Modal
            open={props.data.open}
            onClose={() => props.toggle()}
            static_backdrop
            transition
            className="transition duration-200 ease-out"
        >
            <ModalBackdrop />
            <ModalDialog>
                <Formik
                    initialValues={props.data.data}
                    onSubmit={(values, actions) => {
                        values.id = props.data.data.id
                        edit_data.mutate(values, {
                            onSettled: data => {
                                actions.setSubmitting(false)
                            }
                        })
                    }}
                    validationSchema={
                        yup.object().shape({
                            site: yup.string().required(),
                            location_id: yup.string().required(),
                            model_number: yup.string().required().max(30),
                            truck_factor: yup.number().required().integer(),
                            created_by: yup.string().required().max(10),
                            updated_by: yup.string().required().max(10)
                        })
                    }
                >
                    {formik => (
                        <form
                            onSubmit={formik.handleSubmit}
                        >
                            <ModalHeader closeButton>
                                <ModalTitle>Edit Truck Factor</ModalTitle>
                            </ModalHeader>
                            <div className="grid gap-4 py-4 px-6 overflow-y-scroll max-h-[calc(100vh-200px)]">
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Site<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_site}
                                        value={props.options_site.find(f => f.value == formik.values.site)}
                                        onChange={e => formik.setFieldValue("site", e.value)}
                                        className="col-span-3 w-full"
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Location ID<span className="text-red-800">*</span>
                                    </Label>
                                    <Select
                                        options={props.options_location}
                                        value={props.options_location.find(f => f.value == formik.values.location_id)}
                                        onChange={e => formik.setFieldValue("location_id", e.value)}
                                        className="col-span-3 w-full"
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
                                        Truck Factor (0-100)<span className="text-red-800">*</span>
                                    </Label>
                                    <NumericFormat
                                        value={formik.values.truck_factor}
                                        onValueChange={(values) => formik.setFieldValue("truck_factor", values.value)}
                                        isAllowed={values=>{
                                            return values.floatValue===undefined || (values.floatValue>=0 && values.floatValue<100)
                                        }}
                                        customInput={Input}
                                        className="col-span-3"
                                        placeholder=""
                                        decimalScale={0}
                                        thousandSeparator
                                        maxLength={20}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Created By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="created_by"
                                        value={formik.values.created_by}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                    />
                                </div>
                                <div className="flex flex-col items-start gap-2 mb-0.5">
                                    <Label>
                                        Updated By<span className="text-red-800">*</span>
                                    </Label>
                                    <Input
                                        placeholder=""
                                        className="col-span-3"
                                        name="updated_by"
                                        value={formik.values.updated_by}
                                        onChange={formik.handleChange}
                                        maxLength={10}
                                    />
                                </div>
                            </div>
                            <ModalFooter>
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || !(formik.dirty && formik.isValid)}
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