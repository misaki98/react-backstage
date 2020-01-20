/**
 * 对local数据存储管理的数据模块,使用localStorage
 */
// 解决浏览器兼容问题
import store from 'store'
const USER_KEY = 'user_key'
export default {
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY,user)
    },
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },
    removeUser(){
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}