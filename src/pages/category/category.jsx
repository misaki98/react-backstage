import React from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys } from '../../api'

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
                        <LinkButton onClick={() => { this.setState({ showStatus: 2 }) }}>修改分类</LinkButton>
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
    getCategorys = async () => {
        this.setState({ laodingState: true })
        const { parentId } = this.state
        const result = await reqCategorys(parentId)
        this.setState({ laodingState: false })
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
        this.setState({
            showStatus: 0
        })
    }
    addCate = () => {

    }
    updateCate = () => {

    }
    componentDidMount() {
        this.getCategorys()
    }
    render() {
        const { categorys, loadingStatus, subCategorys, parentId, parentName, showStatus } = this.state

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
                    <p>add.</p>
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCate}
                    onCancel={this.handleCancel}
                >
                    <p>update.</p>
                </Modal>
            </Card>
        )
    }
}
