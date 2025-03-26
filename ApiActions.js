import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BASE_URL1 = 'https://ajay-verma.in';
export const BASE_URL = 'https://api.iraqacademy.net';

const fetchToken = async ()=>{
    const token = await AsyncStorage.getItem('token');
    return token;
};

const ENDPOINTS = {
    teachers: BASE_URL + '/courses/',
    order: BASE_URL1 + '/api/order/',
    orders: BASE_URL1 + '/api/orders/',
    login: BASE_URL + '/api/iq/pos/v1/login',
    grades: BASE_URL + '/app',
    myLogin: BASE_URL1 + '/api/login/',
};

export const merchantLogin = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.login, data);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const myLogin = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.myLogin, data);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const teachers = async (gradeId) => {
    try {
        const response = await axios.get(`${ENDPOINTS.teachers}?grade=${gradeId}`);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const grades = async () => {
    try {
        const response = await axios.get(ENDPOINTS.grades);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const orders = async (data) => {
    try {
        const token = await fetchToken();
        const device_id = await AsyncStorage.getItem('device_id');
        const response = await axios.get(`${ENDPOINTS.orders}?device_id=${device_id}&from_date=${data.from_date}&to_date=${data.to_date}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return [response.status, response.data];
    } catch (error) {
        return [error.response.status];
    };
};

export const courses = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.teachers + id);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const courseSpecific = async (id) => {
    try {
        const response = await axios.get(ENDPOINTS.courses + id);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const createOrder = async (data) => {
    try {
        const token = await fetchToken();
        const response = await axios.post(ENDPOINTS.order, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return [response.status, response.data];
    } catch (error) {
        return [error.response.status];
    };
};