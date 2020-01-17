import React from 'react'
import {
    Tree,
    Input,
    Form
} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'


const { TreeNode } = Tree
const { Item } = Form

const treeData = [
    {
        title: '平台权限',
        key: 'all',
        children: [...menuList]
    }
]

export default class UpdateFrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // expandedKeys: ['all'],
            checkedKeys: this.props.role.menus,
            selectedKeys: [],
        }
    }
    static propTypes = {
        role: PropTypes.object.isRequired
    }
    componentWillMount() {
        this.treeNode = this.renderTreeNodes(treeData)
        
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            checkedKeys: nextProps.role.menus,
        })
    }
    /**
     * 为父组件提供最新menus
     */
    getMenus = () => this.state.checkedKeys


    onExpand = expandedKeys => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
        })
    }

    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys)
        this.setState({ checkedKeys })
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info)
        this.setState({ selectedKeys })
    }

    renderTreeNodes = data =>
        data.map(item => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                )
            }
            return <TreeNode key={item.key} {...item} />;
        });

    render() {
        const { role } = this.props
        return (
            <Form>
                <Item label='角色名称' wrapperCol={{ span: 15 }} labelCol={{ span: 5 }}>
                    <Input value={role.name} disabled />

                </Item>
                <Tree
                    checkable
                    onExpand={this.onExpand}
                    // expandedKeys={this.state.expandedKeys}
                    defaultExpandAll={true}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.treeNode}
                </Tree>
            </Form>

        )
    }
}

