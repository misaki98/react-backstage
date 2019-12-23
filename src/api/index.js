
/**
 * 将所有接口请求函数封装起来
 * 请求接口就只需要调用函数即可
 * 每个接口请求函数的返回值都必须是promise
 */
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from 'antd'
const BASE = ''

// 登录接口
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
// 添加用户接口
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')

// 获取分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类名称
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax(BASE + '/manage/category/update', { categoryName, categoryId }, 'POST')




/**
 * jsonp请求的接口请求函数
 */
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === 'success') {
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                message.error('获取天气信息失败')
            }
        })
    })

}