import axios from 'axios'
import { Message } from 'element-ui';
import router from '../router';

// 请求拦截器
axios.interceptors.request.use(config =>{
    //如果存在token，请求携带这个token
    if(window.sessionStorage.getItem("tokenStr")){
        config.headers['Authorization'] = window.sessionStorage.getItem("tokenStr");
    }
    // if(window.sessionStorage.getItem("user")){
    //     config.headers['Authorization'] = window.sessionStorage.getItem("user");
    // }
    return config;
}, error =>{
    console.log(error);
})

// 响应拦截器
axios.interceptors.response.use(success => {
    // 业务逻辑错误
    if (success.status && success.status == 200) {
        if (success.data.code == 500 || success.data.code == 401 || success.data.code == 403) {
            Message.error({ message: success.data.message });
            return;
        }
        // 返回成功数据
        if (success.data.message) {
            Message.success({ message: success.data.message });
        }
    }

    return success.data;
}, error => {
    if (error.response.code == 504 || error.response.code == 404){
        Message.error({message: '服务器被吃了( ╯□╰ ),请稍后...'});
    } else if (error.response.code == 403) {
        Message.error({message: '权限不足，请联系管理员！'});
    } else if (error.response.code == 401) {
        Message.error({message: '尚未登录，请登录！'});
        router.replace('/');
    } else {
        if(error.response.data.message) {
            Message.error({message: error.response.data.message});
        } else {
            Message.error({message: '未知错误！'});
        }
    }
    return;
})

let base = '';
// 传送json格式的post请求
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

export const postKeyValueRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let ret = '';
            for (let i in data) {
                ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return ret;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

// 传送json格式的put 请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

// 传送json格式的 get 请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

// 传送json格式的 delete 请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}
