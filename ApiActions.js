import axios from 'axios';

export const BASE_URL = 'https://ajay-verma.in';
const ENDPOINTS = {
    deviceAdd: BASE_URL + '/api/device-add/',
    subjects: BASE_URL + '/api/subjects/',
    teachers: BASE_URL + '/api/teachers/',
    courses: BASE_URL + '/api/courses/',
    order: BASE_URL + '/api/order/',
};

export const saveDeviceAdd = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.deviceAdd, data);
        return response.status;
    } catch (error) {
        // console.log('Error:', error.response);
        return error.response.status;
    };
};

export const subjects = async () => {
    try {
        const response = await axios.get(ENDPOINTS.subjects);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const teachers = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.teachers + id + '/');
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const courses = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.courses + id + '/');
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const createOrder = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.order, data);
        console.log('response:', response.data);
        return [response.status, response.data];
    } catch (error) {
        console.log('Error:', error.response.data);
        return error.response.status;
    };
};