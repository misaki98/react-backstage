import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'
/**
 * 根组件
 */
export default class App extends Component {
    render() {
        return (
            // 最外层都是一个路由器
            <BrowserRouter>
                <Switch>
                    {/* 在路由器内部配置路由，每个路由都是一个标签,Switch只匹配其中一个 */}
                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>
        )
    }
}