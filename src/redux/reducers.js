/**
 * 用来根据老的state和指定action生成并返回新的state
 */
import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'
const initTitle = '首页'
const initUser = storageUtils.getUser() //初始化通过向localstorage取数据
//  用来管理头部标题的reducer
function headTitle(state = initTitle, action) {
    switch (action.type) {
        default:
            return state
    }
}
// 管理当前登录用户的reducer
function user(state = initUser, action) {
    switch (action.type) {
        default:
            return state
    }
}

// 向外默认暴露的是合并产生的总的reducer
export default combineReducers({
    headTitle,
    user
})