import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const BASE_URL1 = 'https://pos.aalialfuratco.com';
export const BASE_URL = 'https://api.iraqacademy.net';

const fetchToken = async ()=>{
    const token = await AsyncStorage.getItem('token');
    return token;
};

const ENDPOINTS = {
    teachers: BASE_URL + '/teachers/',
    teacherCourses: BASE_URL + '/api/iq/pos/v1/teacher/profile/',
    order: BASE_URL1 + '/api/order/',
    orders: BASE_URL1 + '/api/orders/',
    login: BASE_URL + '/api/iq/pos/v1/login',
    grades: BASE_URL + '/app',
    myLogin: BASE_URL1 + '/api/login/',
    courses: BASE_URL + '/courses/',
    couponCode: BASE_URL + '/api/iq/pos/v1/order-new-coupon-code',
};

export const merchantLogin = async (data) => {
    try {
        const response = await axios.post(ENDPOINTS.login, data);
        return [response.data?.status_code, response.data];
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

export const teachers = async () => {
    try {
        const response = await axios.get(ENDPOINTS.teachers);
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};

export const teacherCourses = async (teacherId) => {
    try {
        const response = await axios.get(ENDPOINTS.teacherCourses + teacherId);
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

export const gradeCourses = async (gradeId) => {
    try {
        const response = await axios.get(`${ENDPOINTS.courses}?grade=${gradeId}`);
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

export const couponCode = async (id, navigation) => {
    try {
        const authCode = await AsyncStorage.getItem('auth_code');
        if(!authCode) {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('device_id');
            ToastAndroid.show('Please login again!', ToastAndroid.SHORT);
            navigation.navigate('LoginScreen');
            return;
        };
        const response = await axios.post(ENDPOINTS.couponCode, {"sectionID": id}, {
            headers: {
                Authorization: `Bearer ${authCode}`
            }
        });
        return [response.status, response.data];
    } catch (error) {
        return error.response.status;
    };
};
