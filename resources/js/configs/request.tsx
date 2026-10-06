import axios from "axios"

//AUTH
export const auth_request={
    login:async (params={})=>{
        return await axios.post("/login_userpass", params).then(res=>res.data)
    },
    logout:async ()=>{
        return await axios.post("/logout").then(res=>res.data)
    }
}


//FILE
export const request_file={
    uploadAvatar:async file=>{
        let formData=new FormData()
        formData.append("image", file)

        return await axios.post("/api/file/upload_avatar", formData, {
            headers:{
                'content-type':"multipart/form-data"
            }
        })
        .then(res=>res.data)
    },
    uploadDokumen:async (file, filename="")=>{
        let formData=new FormData()
        let name=filename!=""?filename:file.name
        formData.append("dokumen", file, name)

        return await axios.post("/api/file/upload", formData, {
            headers:{
                'content-type':"multipart/form-data"
            }
        })
        .then(res=>res.data)
    }
}

//PENGATURAN
export const request_pengaturan={
    update:async(params)=>{
        return await axios.put(`/api/pengaturans`, params).then(res=>res.data)
    },
    get:async(params={})=>{
        return await axios.get("/api/pengaturans")
        .then(res=>res.data)
    },
}


//USER
export const request_user={
    add:async(params={})=>{
        return await axios.post("/api/users", params).then(res=>res.data)
    },
    update:async(id, params)=>{
        return await axios.put(`/api/users/${id}`, params).then(res=>res.data)
    },
    delete:async(id)=>{
        return await axios.delete(`/api/users/${id}`).then(res=>res.data)
    },
    get:async(id)=>{
        return await axios.get(`/api/users/${id}`).then(res=>res.data)
    },
    gets:async(params={})=>{
        return await axios.get("/api/users", {
            params:params
        })
        .then(res=>res.data)
    },
}

//COMPANY
export const request_company = {
    add: async (params = {}) => {
        return await axios.post("/api/companies", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/companies/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/companies/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/companies/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/companies", {
            params: params
        }).then(res => res.data)
    },
}

// SITE
export const request_site = {
    add: async (params = {}) => {
        return await axios.post("/api/sites", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/sites/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/sites/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/sites/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/sites", {
            params: params
        }).then(res => res.data)
    },
}

// DEPARTMENT
export const request_department = {
    add: async (params = {}) => {
        return await axios.post("/api/departments", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/departments/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/departments/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/departments/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/departments", {
            params: params
        }).then(res => res.data)
    },
}

// EMPLOYEE
export const request_employee = {
    add: async (params = {}) => {
        return await axios.post("/api/employees", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/employees/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/employees/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/employees/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/employees", {
            params: params
        }).then(res => res.data)
    },
}

// EQUIPMENT
export const request_equipment = {
    add: async (params = {}) => {
        return await axios.post("/api/equipments", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/equipments/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/equipments/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/equipments/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/equipments", {
            params: params
        }).then(res => res.data)
    },
}

// SHIFT
export const request_shift = {
    add: async (params = {}) => {
        return await axios.post("/api/shifts", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/shifts/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/shifts/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/shifts/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/shifts", {
            params: params
        }).then(res => res.data)
    },
}

// CATEGORY
export const request_category = {
    add: async (params = {}) => {
        return await axios.post("/api/categories", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/categories/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/categories/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/categories/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/categories", {
            params: params
        }).then(res => res.data)
    },
}

// DEDICATED
export const request_dedicated = {
    add: async (params = {}) => {
        return await axios.post("/api/dedicateds", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/dedicateds/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/dedicateds/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/dedicateds/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/dedicateds", {
            params: params
        }).then(res => res.data)
    },
}

// FUEL RATIO COAL
export const request_fuel_ratio_coal = {
    add: async (params = {}) => {
        return await axios.post("/api/fuel_ratio_coals", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/fuel_ratio_coals/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/fuel_ratio_coals/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/fuel_ratio_coals/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/fuel_ratio_coals", {
            params: params
        }).then(res => res.data)
    },
}

// ITEM CATEGORY
export const request_item_category = {
    add: async (params = {}) => {
        return await axios.post("/api/item_categories", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/item_categories/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/item_categories/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/item_categories/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/item_categories", {
            params: params
        }).then(res => res.data)
    },
}

// KOEFISIEN BASE OB
export const request_koefisien_base_ob = {
    add: async (params = {}) => {
        return await axios.post("/api/koefisien_base_obs", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/koefisien_base_obs/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/koefisien_base_obs/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/koefisien_base_obs/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/koefisien_base_obs", {
            params: params
        }).then(res => res.data)
    },
}

// MATERIAL
export const request_material = {
    add: async (params = {}) => {
        return await axios.post("/api/materials", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/materials/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/materials/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/materials/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/materials", {
            params: params
        }).then(res => res.data)
    },
}

// SUB MATERIAL
export const request_sub_material = {
    add: async (params = {}) => {
        return await axios.post("/api/sub_materials", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/sub_materials/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/sub_materials/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/sub_materials/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/sub_materials", {
            params: params
        }).then(res => res.data)
    },
}

// PIT LOCATION
export const request_pit_location = {
    add: async (params = {}) => {
        return await axios.post("/api/pit_locations", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/pit_locations/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/pit_locations/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/pit_locations/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/pit_locations", {
            params: params
        }).then(res => res.data)
    },
}

// PRODUCTIVITY PROBLEM
export const request_productivity_problem = {
    add: async (params = {}) => {
        return await axios.post("/api/productivity_problems", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/productivity_problems/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/productivity_problems/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/productivity_problems/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/productivity_problems", {
            params: params
        }).then(res => res.data)
    },
}

// TIME RANGE
export const request_time_range = {
    add: async (params = {}) => {
        return await axios.post("/api/time_ranges", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/time_ranges/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/time_ranges/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/time_ranges/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/time_ranges", {
            params: params
        }).then(res => res.data)
    },
}

// TRUCK FACTOR
export const request_truck_factor = {
    add: async (params = {}) => {
        return await axios.post("/api/truck_factors", params).then(res => res.data)
    },
    update: async (id, params) => {
        return await axios.put(`/api/truck_factors/${id}`, params).then(res => res.data)
    },
    delete: async (id) => {
        return await axios.delete(`/api/truck_factors/${id}`).then(res => res.data)
    },
    get: async (id) => {
        return await axios.get(`/api/truck_factors/${id}`).then(res => res.data)
    },
    gets: async (params = {}) => {
        return await axios.get("/api/truck_factors", {
            params: params
        }).then(res => res.data)
    },
}