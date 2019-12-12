import React from 'react'
import {Redirect} from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'


/**
 * 管理页面的路由组件
 */
export default class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const user = memoryUtils.user
        if(!user || !user._id){
            return <Redirect to='/login'/> 
        }
        return (
        <div>Hello {user.username}</div>
        )
    }
}
