
/**
 * 将所有接口请求函数封装起来
 * 请求接口就只需要调用函数即可
 * 每个接口请求函数的返回值都必须是promise
 */
import ajax from './ajax'
const BASE = ''

// 登录接口
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')
// 添加用户接口
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add', user, 'POST')