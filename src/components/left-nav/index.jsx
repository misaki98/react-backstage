import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Icon } from 'antd'

import logo from '../../assets/images/logo.png'
import './index.less'

const { SubMenu } = Menu
/**
 * 左侧导航组件
 */
export default class LeftNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <div className="left-nav">
                <Link className="left-nav-header" to='/'>
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={this.state.collapsed}
                >
                    <Menu.Item key="home">
                        <Link to='/home'>
                            <Icon type="home" />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="appstore" />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="category">
                            <Link to='/category'>
                                <Icon type="menu" />
                                <span>品类管理</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="product">
                            <Link to='/product'>
                                <Icon type="tool" />
                                <span>商品管理</span>
                            </Link>

                        </Menu.Item>
                    </SubMenu>
                    <Menu.Item key="user">
                        <Link to='/user'>
                            <Icon type="user" />
                            <span>用户管理</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="role">
                        <Link to='/role'>
                            <Icon type="usergroup-add" />
                            <span>角色管理</span>
                        </Link>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="area-chart" />
                                <span>图表</span>
                            </span>
                        }
                    >
                        <Menu.Item key="bar">
                            <Link to='/charts/bar'>
                                <Icon type="bar-chart" />
                                <span>柱状图</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="line">
                            <Link to='/charts/line'>
                                <Icon type="line-chart" />
                                <span>折线图</span>
                            </Link>

                        </Menu.Item>
                        <Menu.Item key="pie">
                            <Link to='/charts/pie'>
                                <Icon type="pie-chart" />
                                <span>饼图</span>
                            </Link>

                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </div>


        )
    }
}
