import React from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import UpdateForm from './update-form'

/**
 * 商品分类路由
 */
export default class Category extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            categorys: [], //一级分类列表
            loadingStatus: false,
            subCategorys: [], //二级分类列表的数据
            parentId: '0',//当前需要显示的列表的parentId
            parentName: '',
            showStatus: 0 //确认框的标识
        }
    }
    componentWillMount() {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',  // 指定需要显示对应数据的属性名
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (categorys) => ( //指定返回需要指定显示的界面标签
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(categorys) }}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ? <LinkButton onClick={() => { this.showSubCategorys(categorys) }}>查看子分类</LinkButton> : null
                        }
                    </span>
                )
            }
        ]
    }
    /**
     * 获取列表数据
     */
    getCategorys = async (parentId) => {
        this.setState({ loadingStatus: true })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        this.setState({ loadingStatus: false })
        if (result.status === 0) {
            // 取出的是分类数组数据，一级二级都有可能
            const categorys = result.data
            if (parentId === '0') {
                this.setState({ categorys })
            } else {
                this.setState({ subCategorys: categorys })
            }

        } else {
            message.error('获取分类列表失败')
        }
    }
    // 展示二级列表
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()
        })

    }
    // 展示一级列表
    showCategorys = () => {
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    }
    handleCancel = () => {
        // 清除输入数据
        this.form.resetFields()
        this.setState({
            showStatus: 0
        })
    }
    showUpdate = (categorys) => {
        this.category = categorys
        this.setState({ showStatus: 2 })
    }
    addCate = () => {
        // 进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1.隐藏确认框
                this.setState({
                    showStatus: 0
                })
                const parentId = this.form.getFieldValue('parentId')
                const categoryName = this.form.getFieldValue('categoryName')
                const result = await reqAddCategory(categoryName, parentId)
                this.form.resetFields()
                if (result.status === 0) {
                    // 3.重新显示列表
                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        // 在二级分类列表下添加一级分类项，重新获取一级分类列表，但不需要显示出来
                        this.getCategorys('0')
                    }
                }
            }
        })


    }
    updateCate = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1.隐藏确认框
                this.setState({
                    showStatus: 0
                })
                const categoryId = this.category._id
                const categoryName = this.form.getFieldValue('categoryName')
                const result = await reqUpdateCategory({ categoryName, categoryId })
                // 清除输入数据
                this.form.resetFields()
                if (result.status === 0) {
                    // 3.重新显示列表
                    this.getCategorys()
                }
            }

        })

    }
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { categorys, loadingStatus, subCategorys, parentId, parentName, showStatus } = this.state
        this.category = this.category || {}
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ margin: '0 10px' }} />
                <span>{parentName}</span>
            </span>
        )
        const extra = (<Button type="primary" onClick={() => { this.setState({ showStatus: 1 }) }}><Icon type="plus" />添加</Button>)


        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: 8 }}
                    loading={loadingStatus}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCate}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCate}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={this.category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </Card>
        )
    }
}
