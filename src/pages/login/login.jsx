import React from 'react'
import {
    Form,
    Icon,
    Input,
    Button
} from 'antd'

import './login.less'
import logo from './images/logo.png'
// 登录的路由组件
class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    handleSubmit = (e) => {
        e.preventDefault()
        // 对所有表单字段进行校验
        this.props.form.validateFields((err,values)=>{
            // 校验成功
            if(!err){
                console.log('Received values of form:',values)
            }else{
                console.log('校验失败')
            }
        })

        const form = this.props.form
        const value = form.getFieldsValue()
    }

    /**
     * 对密码进行自定义验证
     */
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码必须输入')
        } else if (value.length <= 4) {
            callback('密码长度不能小于4位')
        } else if (value.length >= 12) {
            callback('密码长度不能大于12位')
        } else if (/^[a-zA-Z0-9_]$/.test(value)) {
            callback('密码必须是以英文、数字或下划线组成')
        } else {
            callback()
        }

        // callback()如果不传参数，则表示验证失败，如果穿参数，则表示验证失败的消息
    }

    render() {
        const form = this.props.form
        const { getFieldDecorator } = form

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="" />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                // 声明式验证，直接使用别人定义好的验证规则进行验证
                                rules: [
                                    { required: true, whitespace: true, message: '请输入用户名!' },
                                    { min: 4, message: '用户名最小长度为4' },
                                    { max: 12, message: '用户名最大长度为12' },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是以英文、数字或下划线组成' }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        validator: this.validatePwd
                                    }
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/**
 * 高阶函数：create()
 * 
 * 高阶组件
 */
/**
 * 包装Form组件，生成一个新的组件
 * 新组件会向Form组件传递一个对象属性
 */
const WrapLogin = Form.create()(Login)
export default WrapLogin