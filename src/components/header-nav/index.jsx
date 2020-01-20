import React from 'react'
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'

import LinkButton from '../link-button'

import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuConfig from '../../config/menuConfig'
import './index.less'

const { confirm } = Modal

class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: formateDate(Date.now()),
            dayPictureUrl: '',
            weather: '',
        }
    }
    getTitle = (menu) => {
        const pathname = this.props.location.pathname
        let title
        menu.forEach((item) => {
            if (pathname.indexOf(item.key) === 0) {
                title = item.title
            } else if (item.children) {
                title = this.getTitle(item.children) || title
            }
        })
        return title

    }
    getTime = () => {
        // 每隔一秒获取一次时间，并更新状态数据
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('南京')
        this.setState({ dayPictureUrl, weather })
    }
    logout = () => {
        // 显示确认框
        confirm({
            content: '确定退出吗',
            onOk: () => {
                storageUtils.removeUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            }
        })
    }
    componentDidMount() {
        this.getTime() //获取当前时间
        this.getWeather()
    }
    componentWillUnmount() {
        /**
         * 组件卸载之前使用
         */
        clearInterval(this.intervalId)
    }
    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const username = memoryUtils.user.username
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <LinkButton href="#" onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        {this.getTitle(menuConfig)}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)

