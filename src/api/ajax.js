

/**
 * 这是一个能发送异步ajax请求的函数类型模块
 * 封装axios库
 * 在此处统一处理请求的异常
 */
import axios from 'axios'
import { message } from 'antd'


export default function ajax(url, data = {}, type = 'GET') {
    let promise
    return new Promise((resolve, reject) => {
        // 1.执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, {
                params: data //指定当前请求参数的配置对象
            })
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => {
            // 2.如果成功，调用resolve
            resolve(response.data)
        }).catch(error => {
            // 3.如果失败，不调用reject，而是提示异常信息
            message.error('请求出错了', error.message)
        })



    })

}