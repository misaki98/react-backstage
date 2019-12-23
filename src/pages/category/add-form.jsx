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
 * category独有的非路由组件
 */
class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    static propTypes = {
        categorys: PropTypes.array.isRequired, //接收一级分类的数组
        parentId: PropTypes.string.isRequired,  //接收父分类的ID
        setForm: PropTypes.func.isRequired
    }
    componentWillMount() {
        // 将Form对象通过setForm方法传给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { categorys, parentId } = this.props
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: parentId
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(item => <Option value={item._id}>{item.name}</Option>)
                                }
                            </Select>
                        )
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '分类名称必须输入' }
                            ]
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