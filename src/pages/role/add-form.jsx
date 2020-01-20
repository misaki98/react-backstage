import React from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input
} from 'antd'

const Item = Form.Item
/**
 * category独有的非路由组件
 */
class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static propTypes = {
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        // 将Form对象通过setForm方法传给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item label='角色名称' wrapperCol={{span:15}} labelCol={{span:5}}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '角色名称必须输入' }
                            ]
                        })(
                            <Input placeholder="请输入角色名称" />
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)