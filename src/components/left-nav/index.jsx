import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'

const { SubMenu } = Menu
/**
 * 左侧导航组件
 */
class LeftNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    hasAuth = (item) => {
        const { key, isPublic } = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /**
         * 如果当前用户是admin，直接通过
         * 判断当前用户有此item或其子item的权限，看key有无在menus中
         * */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        } else {
            return false
        }

    }
    // 判断当前登录用户是否对item是否有权限
    getMenuNodes = (menuList) => {
        // 根据传入的menu数据数组生产对应的标签数组
        // 添加一个根据item权限来判断是否加入的逻辑
        return menuList.map(item => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                } else {
                    const path = this.props.location.pathname
                    if (item.children.find(cItem => path.indexOf(cItem.key) === 0)) { this.targetNode = item.key }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
            return item.id
        })
    }
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    // 一个根据地址动态进行列表展开的函数
    // pathOpen = (path) =>{
    //     const target = path.split('/')[1]
    //     if(target==='category' || target === 'product'){
    //         return '/products'
    //     }else if(target === 'charts'){
    //         return '/charts'
    //     }else{
    //         return ''
    //     }
    // }
    render() {
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        const target = this.targetNode
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        return (
            <div className="left-nav">
                <Link className="left-nav-header" to='/'>
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[target]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>


        )
    }
}

/**
 * 高阶组件 包装非路由组件，向非路由组件传递3个属性，history，location，match
 */
export default withRouter(LeftNav)