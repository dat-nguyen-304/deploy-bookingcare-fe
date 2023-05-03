import axios from "../axios";

const handleLogin = (email, password) => {
    return axios.post('/api/login', { email, password });
}

const handleLoginApi = (inputId) => {
    return axios.get('/api/get-all-users', { id: inputId });
}

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`);
}

const createUser = (data) => {
    return axios.post(`/api/create-user`, data);
}

const deleteUser = (data) => {
    return axios.delete(`/api/delete-user`, data);
}

const editUser = (data) => {
    return axios.put(`/api/edit-user`, data);
}

const getAllCode = (type) => {
    return axios.get(`/api/all-code?type=${type}`);
}

const getTopDoctorHome = (limit) => {
    return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctors = () => {
    return axios.get(`/api/get-all-doctor`);
}

const createMarkDown = (markdown) => {
    return axios.post(`/api/create-markdown`, markdown);
}

const createDoctorInfo = (doctorInfo) => {
    return axios.post(`/api/create-doctor-info`, doctorInfo);
}

const updateMarkDown = (markdown) => {
    return axios.put(`/api/update-markdown`, markdown);
}

const updateDoctorInfo = (doctorInfo) => {
    return axios.put(`/api/update-doctor-info`, doctorInfo);
}

const getDoctorInfo = (doctorId) => {
    return axios.get(`/api/get-doctor-info?doctorId=${doctorId}`);
}

const getDetailDoctorById = (id) => {
    return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
}

const createBulkSchedule = (schedules) => {
    return axios.post(`/api/create-bulk-schedules`, schedules);
}

const updateBulkSchedule = (schedules) => {
    return axios.put(`/api/update-bulk-schedules`, schedules);
}

const getSchedule = (date, doctorId) => {
    return axios.get(`/api/get-schedules?id=${doctorId}&date=${date}`);
}

const verifyBooking = (doctorId, token) => {
    return axios.post(`/api/verify-booking?doctorId=${doctorId}&token=${token}`);
}

const getBooking = (doctorId, date) => {
    return axios.get(`/api/get-booking?doctorId=${doctorId}&date=${date}`);
}

const changeBookingStatus = (doctorId, date, statusId) => {
    return axios.put(`/api/update-booking-status`, { doctorId, date, statusId });
}

const createSpecialty = (specialty) => {
    return axios.post('/api/create-specialty', specialty);
}

const updateSpecialty = (specialty) => {
    return axios.put('/api/update-specialty', specialty);
}

const getAllSpecialty = () => {
    return axios.get('/api/get-all-specialty');
}

const getSpecialtyById = (specialtyId) => {
    return axios.get(`/api/get-specialty?id=${specialtyId}`);
}

const getAllDoctorsOfSpecialty = (specialtyId) => {
    return axios.get(`/api/get-all-doctors-of-specialty?id=${specialtyId}`);
}

const sendInvoiceToEmail = (userEmail, patientFullName, invoiceImg, language) => {
    return axios.post('/api/send-invoice-via-email', { userEmail, patientFullName, invoiceImg, language });
}

export {
    handleLogin,
    handleLoginApi,
    getAllUsers,
    createUser,
    deleteUser,
    editUser,
    getAllCode,
    getTopDoctorHome,
    getAllDoctors,
    createMarkDown,
    updateMarkDown,
    getDetailDoctorById,
    createBulkSchedule,
    updateBulkSchedule,
    getSchedule,
    createDoctorInfo,
    updateDoctorInfo,
    getDoctorInfo,
    verifyBooking,
    getBooking,
    changeBookingStatus,
    createSpecialty,
    updateSpecialty,
    getAllSpecialty,
    getSpecialtyById,
    getAllDoctorsOfSpecialty,
    sendInvoiceToEmail
}