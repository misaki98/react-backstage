import React from 'react'
import {
    Card,
    Form,
    Input,
    Cascader,
    Button,
    Icon,
    message
} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'

const { Item } = Form
const { TextArea } = Input

/**
 * Product的添加路由组件
 */
class ProductAddUpdate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            options: []
        }
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    // 获取分类列表数据，并显示
    // async函数返回的是一个promise对象，其值由async函数的结果来决定
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                // 如果是一级列表，就直接初始化
                this.initOptions(categorys)
            } else {
                // 返回二级列表，返回的是promise对象，且状态为成功，value：categorys
                return categorys
            }

        }
    }
    initOptions = async (categorys) => {
        // 根据数据生成对于数组，并更新options状态
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))
        // 如果是一个二级分类商品的更新，就需要提前获取数据
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategory = await this.getCategorys(pCategoryId)
            // 生成二级下拉列表的options
            const childOptions = subCategory.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            // 关联到对应的一级option上去
            options.find(item => item.value === pCategoryId).children = childOptions
        }

        this.setState({ options })
    }

    /**
     * 需要写一个验证价格的自定义验证器
     */
    validatePrice = (rule, value, callback) => {
        if (value * 1 >= 0) {
            callback() //验证通过
        } else {
            callback('价格必须大于0')
        }


    }
    submit = () => {
        // 进行提交的表单验证，如果通过了才能发请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                // 1. 收集数据，并封装成product对象
                const { name, desc, price, categoryIds } = values
                let categoryId, pCategoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
                if (this.isUpdate) {
                    product._id = this.product._id
                }
                // 2. 调用接口请求函数添加或更新
                const result = await reqAddOrUpdateProduct(product)
                // 3. 根据结果提示相应信息
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
            }
        })
    }
    /**
     * 用于加载下一级列表的回调函数
     */
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true

        // 根据选中的分类，获取其下一级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            // 当前分类有二级列表，且二级列表有值
            targetOption.children = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
        } else {
            // 当前分类无二级列表
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
            // 必须要用这种写法来保证更新数组是改变了它的指针，在纯组件的情况下。针对对象或者数组内部的修改不会被捕获
        })
    }
    componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }
    componentDidMount() {
        this.getCategorys('0')
    }
    render() {
        const { product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        // 用来接收级联分类Id的数组
        const categoryIds = []
        if (this.isUpdate) {
            // 商品是一个一级分类的商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 3 }, //一共24格，占6格，指定左侧label的宽度
            wrapperCol: { span: 8 },  //指定右侧包裹的宽度
        }
        const title = (
            <span>
                <LinkButton onClick={() => { this.props.history.goBack() }}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} />
                </LinkButton>
                <span>添加商品</span>
            </span>
        )
        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title}>
                <Form {...formItemLayout}>
                    <Item label='商品名称'>
                        {getFieldDecorator('name', {
                            initialValue: product.name,
                            rules: [
                                { required: true, message: '必须输入商品名称' }
                            ]
                        })(
                            <Input placeholder='请输入商品名称' />
                        )}
                    </Item>
                    <Item label='商品描述'>
                        {getFieldDecorator('desc', {
                            initialValue: product.desc,
                            rules: [
                                { required: true, message: '必须输入商品描述' }
                            ]
                        })(
                            <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
                        )}
                    </Item>
                    <Item label='商品价格'>
                        {getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                                { required: true, message: '必须输入商品价格' },
                                { validator: this.validatePrice }
                            ]
                        })(
                            <Input placeholder='请输入商品价格' type='number' addonAfter="元" />
                        )}

                    </Item>
                    <Item label='商品分类'>
                        {getFieldDecorator('categoryIds', {
                            initialValue: categoryIds,
                            rules: [
                                { required: true, message: '必须指定商品分类' }
                            ]
                        })(
                            <Cascader
                                options={this.state.options}  //指定需要显示的列表数据
                                loadData={this.loadData}  //指定当选择某个列表项的时候加载下一级列表的回调
                            />
                        )}

                    </Item>
                    <Item label='商品图片'>
                        {/* 使用ref来获取子组件对象，从而通过调用子组件对象的方法来获取数据 */}
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 3 }} wrapperCol={{ span: 20 }} >
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>{this.isUpdate ? '更新' : '添加'}</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
