import React from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './add-form'
import UpdateFrom from './update-form'
import { formateDate } from '../../utils/dateUtils'
import user from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Role extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [], //所有角色的列表
            role: {}, //选中的角色
            isShowAdd: false, //是否显示添加界面
            isShowUpdate: false, //是否显示更新页面
        }
        this.authForm = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (time) => formateDate(time)

            }, {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            }, {
                title: '授权人',
                dataIndex: 'auth_name'
            },
        ]
    }
    componentWillMount() {
        this.initColumn()
    }
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({ roles })
        } else {
            message.error(result.message)
        }
    }
    componentDidMount() {
        this.getRoles()
    }
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }//点击行
        }
    }
    /**
     * 添加角色
     */
    addRole = () => {
        // 进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1.隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                const roleName = this.form.getFieldValue('roleName')
                const result = await reqAddRole(roleName)
                this.form.resetFields()
                if (result.status === 0) {
                    // 3.重新显示列表
                    this.getRoles()
                } else {
                    message.error(err)
                }
            }
        })
    }
    /**
     * 更新角色
     */
    updateRole = async () => {
        const { _id } = this.state.role
        const menus = this.authForm.current.getMenus()
        const auth_name = user.user.username
        const result = await reqUpdateRole({ _id, auth_name, menus })
        this.setState({ isShowUpdate: false })
        if (result.status === 0) {
            const role = result.data
            this.setState({ role })
            
            // 如果当前更新的是自己角色的权限，则强制退出
            if (role._id === user.user.role_id) {
                user.user = {}
                storageUtils.removeUser()
                this.props.history.replace('/login')
                message.success('角色权限更变，请重新登录')
            } else {

            }
            this.getRoles()
            message.success('设置权限成功')
        } else {
            message.error(result.msg)
        }

    }
    render() {
        const { roles, role, isShowAdd, isShowUpdate } = this.state
        const title = (
            <span>
                <Button style={{ marginRight: 10 }} type='primary' onClick={() => { this.setState({ isShowAdd: true }) }}>创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={() => { this.setState({ isShowUpdate: true }) }}>设置角色权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id],onSelect:(role)=>{this.setState({role})} }}
                    onRow={this.onRow}
                />
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => { this.setState({ isShowAdd: false }); this.form.resetFields() }}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowUpdate}
                    onOk={this.updateRole}
                    onCancel={() => { this.setState({ isShowUpdate: false }) }}
                >
                    <UpdateFrom
                        role={role} ref={this.authForm}
                    />
                </Modal>
            </Card>

        )
    }
}
