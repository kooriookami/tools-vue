import axios from 'axios';
import app from '@/main';
import qs from 'qs';
import {ElNotification} from 'element-plus';

// 请求拦截器
axios.interceptors.request.use(config => {
    config.baseURL = app.config.globalProperties.baseURL;
    if (config.method === 'get') {
        config.paramsSerializer = params => qs.stringify(params, {arrayFormat: 'repeat'});
    }
    return config;
}, error => {
    return Promise.reject(error);
});
// 响应拦截器
axios.interceptors.response.use(response => {
    return response;
}, error => {
    // 对响应错误做点什么
    let message = error?.response?.data?.message ?? error;
    ElNotification.error({
        title: '错误',
        message: message
    });
    return Promise.reject(error);
});

export default axios;