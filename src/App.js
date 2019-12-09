import React,{Component} from 'react'
import { Button, message } from 'antd'

/**
 * 根组件
 */
export default class App extends Component {


    handleClick = () => {
        message.success('success!')
    }

    render(){
        return (
            <div>
                <Button type="primary" onClick={this.handleClick}>Primary</Button>
            </div>
        )
    }
}