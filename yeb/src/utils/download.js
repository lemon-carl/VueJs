import axios from 'axios'

const service = axios.create({
    responseType: 'arraybuffer'
})

service.interceptors.request.use(config => {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config;
}, error =>{
     console.log(error);
})

service.interceptors.response.use(resp=>{
    const headers = resp.headers;
    let reg = RegExp(/application\/json/);
    if(headers['content-type'].match(reg)){
        resp.data = unitToString(resp.data);
    } else {
        // 引入插件
        let fileDownload = require('js-file-download');
        // 文件名
        let fileName = headers['content-disposition'].split(';')[1].split('filename=')[1];
        // 响应类型
        let contentType =  headers['content-type'];
        // 格式转换防止中文乱码
        fileName = decodeURIComponent(fileName);
        // 通过插件下载文件
        fileDownload(resp.data, fileName, contentType);
    }

}, error =>{
    console.log(error);
})

function unitToString(unitArray){
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray));
    let decodedString = decodeURIComponent(escapeen(encodedString));
    return JSON.parse(decodedString);
}

let base = '';
export const downloadRequest = (url, params) =>{
    return service({
        method: 'GET',
        url: `${base}${url}`,
        data: params
    })
}
// 暴露请求
export default service;
