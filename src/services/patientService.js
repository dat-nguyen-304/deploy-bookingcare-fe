import axios from "../axios";

const createBooking = (data) => {
    return axios.post(`/api/create-booking`, data);
}

export {
    createBooking,
}