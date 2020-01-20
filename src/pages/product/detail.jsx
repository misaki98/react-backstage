import React from 'react'
import {
    Card,
    Icon,
    List
} from 'antd'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'
const Item = List.Item

/**
 * Product的详情子路由
 */
export default class ProductDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cName1: '',//一级分类名称
            cName2: '',//二级分类名称
        }
    }
    async componentDidMount() {
        const { categoryId, pCategoryId } = this.props.location.state
        if (pCategoryId === '0') {
            // 一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({ cName1 })
        } else {
            // 二级分类向的商品
            /**
             * 多个await方式发送多个请求，后面一个请求需要等待前面那个请求的结束
             * const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
             */
            // 一次性发送多个请求，只有全部成功才正常处理
            // 返回的是一个由回调组成的数组
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name

            this.setState({ cName1, cName2 })
        }
    }

    render() {
        // 读取携带过来的状态数据
        const product = this.props.location.state
        const { cName1, cName2 } = this.state
        const title = (
            <span>
                <Icon
                    type='arrow-left'
                    style={{ color: 'green', marginRight: 15, fontSize: 20 }}
                    onClick={() => this.props.history.goBack()}
                />
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item>
                        <span className='left'>商品名称:</span>
                        <span>{product.name}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品描述:</span>
                        <span>{product.desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{product.price}</span>
                    </Item>
                    <Item>
                        {/* 通过额外发请求来获取分类ID对于的分类名称 */}
                        <span className='left'>所属分类:</span>
                        <span>{cName2 ? cName1 + '----->' + cName2 : cName1}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品图片:</span>
                        <span>
                            {
                                product.imgs.map(img => (
                                    <img className='product-img' src={BASE_IMG_URL + img} alt="img" key={img} />
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{ __html: product.detail }}>
                            {/* 需要在此处展示富文本数据，需要使用React中的dangerouslySetInnerHTML */}
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}
