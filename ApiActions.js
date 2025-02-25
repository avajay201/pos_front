import axios from 'axios';

export const BASE_URL = 'http://192.168.40.200:8000';
const ENDPOINTS = {
    macAdd: BASE_URL + '/api/macadd/',
    teachers: BASE_URL + '/api/teachers/',
    courses: BASE_URL + '/api/courses/',
    order: BASE_URL + '/api/order/',
};

export const saveMacAdd = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.macAdd, data);
        return response.status;
    } catch (error) {
        return error.response.status;
    };
};

export const teachers = async (data) => {
    try {
        const response = await axios.get(ENDPOINTS.teachers);
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