import React from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'

import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqCategoryStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const Option = Select.Option
/**
 * Product的默认子路由
 */
export default class ProductHome extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],//商品的数组
            total: 0, //商品的总数量
            loading: false,
            searchName: '',//搜索的关键字
            searchType: 'productName'//根据哪个字段搜索
        }
    }
    /**
     * 初始化表格列的数组
     */
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '¥' + price //当前指定了字段对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                render: (product) => {
                    const { _id, status } = product
                    // console.log(_id, status)
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => { this.updateStatus(_id, status === 1 ? 2 : 1) }}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>


                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象作为state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                        </span>
                    )
                }
            },
        ];
    }
    updateStatus = async (categoryId, status) => {
        const result = await reqCategoryStatus(categoryId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }
    /**
     * 定义一个获取指定页码的列表数据
     */
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存当前的页码
        this.setState({ loading: true })
        const { searchName, searchType } = this.state
        // 如果搜索关键字有值，说明要进行搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false })
        if (result.status === 0) {
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }
    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getProducts(1)
    }
    render() {
        const { products, total, loading, searchType, searchName } = this.state
        const title = (
            <span>
                {/* 只有添加了onChange之后Select和Input才是受控组件，不然无法修改它们的值 */}
                <Select value={searchType} style={{ width: 130 }} onChange={value => this.setState({ searchType: value })}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder='请输入关键字'
                    value={searchName}
                    style={{ width: 150, margin: '0 15px' }}
                    onChange={e => this.setState({ searchName: e.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />添加商品
            </Button>
        )


        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    rowket="_id"
                    dataSource={products}
                    columns={this.columns}
                    pagination={{
                        current:this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        total,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}
