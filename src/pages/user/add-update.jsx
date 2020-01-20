import React from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * 添加用户和修改用户的form组件
 */
class UserForm extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.array.isRequired, 
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        // 将Form对象通过setForm方法传给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { roles,user } = this.props
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 15 }
        }
        return (
            <Form  {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username

                        })(
                            <Input placeholder='请输入用户名' />
                        )
                    }
                </Item>
                <Item label='密码'>
                    {
                        getFieldDecorator('password', {
                            initialValue: user.password
                        })(
                            <Input type='password' placeholder='请输入密码' />
                        )
                    }
                </Item>
                <Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone
                        })(
                            <Input placeholder='请输入手机号' />
                        )
                    }
                </Item>
                <Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email
                        })(
                            <Input type='email' placeholder='请输入手机号' />
                        )
                    }
                </Item>
                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules: [
                                { required: true, message: '分类名称必须输入' }
                            ]
                        })(
                            <Select>
                                {
                                    roles.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                                }
                            </Select>
                        )
                    }
                </Item>
            </Form>
        )
    }
}
export default Form.create()(UserForm)