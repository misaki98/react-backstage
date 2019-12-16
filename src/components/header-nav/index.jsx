import React from 'react'

import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'


export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentTime: formateDate(Date.now()),
            dayPictureUrl: '',
            weather: ''
        }
    }
    getTime = () => {
        // 每隔一秒获取一次时间，并更新状态数据
        setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }
    getWeather = async () => {
        const { dayPictureUrl, weather } = await reqWeather('南京')
        this.setState({ dayPictureUrl, weather })
    }
    componentDidMount() {
        this.getTime() //获取当前时间
        this.getWeather()
    }
    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        const username = memoryUtils.user.username
        return (
            <div className="header">
                <div className="header-top">
                    <span>欢迎,{username}</span>
                    <a href="#">退出</a>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        首页
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

