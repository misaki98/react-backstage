import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import ProductHome from './home'
import ProductAddUpdate from './add-update'
import ProductDetail from './detail'


/**
 * 商品路由
 */
export default class Product extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <Switch>
                {/* 只有在路径完全匹配的时候才会对上 */}
                <Route exact path='/product' component={ProductHome} />
                <Route path='/product/addupdate' component={ProductAddUpdate} />
                <Route path='/product/detail' component={ProductDetail} />
                <Redirect to='/product' />
            </Switch>
        )
    }
}
