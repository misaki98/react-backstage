
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

// 获取分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')
// 更新分类名称
export const reqUpdateCategory = ({ categoryName, categoryId }) => ajax(BASE + '/manage/category/update', { categoryName, categoryId }, 'POST')
// 获取分类名称
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })
// 下架或上架商品
export const reqCategoryStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')
// 获取商品列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })
// 搜索商品分页列表,根据搜索类型来进行判断
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})
// 删除图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')
// 添加或更新商品(将两个函数合并)
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
//更新商品
//export const reqUpdateProduct = (product) => ajax(BASE+'/manage/product/update',product, 'POST')
// 获取所有角色
export const reqRoles = () => ajax(BASE + '/manage/role/list')
// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, 'POST')
// 设置角色权限
export const reqUpdateRole = ({ _id, menus, auth_name }) => ajax(BASE + '/manage/role/update', { _id, menus, auth_name }, 'POST')
// 获取所有用户
export const reqUsers = () => ajax(BASE + '/manage/user/list')
// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE+'/manage/user/delete',{userId},'POST')
// 更新或添加用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')


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