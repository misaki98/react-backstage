import React from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
/**
 * category独有的非路由组件
 */
class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }


    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: 0
                        })(
                            <Select>
                                <Option value={0}>12</Option>
                                <Option value={1}>123</Option>
                            </Select>
                        )
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''
                        })(
                            <Input placeholder="请输入分类名称" />
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(AddForm)