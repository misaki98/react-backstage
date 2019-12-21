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
class UpdateForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        // 将Form对象通过setForm方法传给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const categoryName = this.props.categoryName
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName
                        })(
                            <Input placeholder="请输入分类名称" />
                        )
                    }

                </Item>
            </Form>
        )
    }
}
export default Form.create()(UpdateForm)