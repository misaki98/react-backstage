import React from 'react'
import {
    Card,
    Button,
    Table,
    message,
    Modal
} from 'antd'
import { reqAddOrUpdateUser, reqUsers, reqDeleteUser } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import AddUpdate from './add-update'


export default class User extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isShowAdd: false,
            users: [],
            user: {},
            roles: []
        }
    }
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.setState({ users, roles })
        } else {
            message.error(result.msg)
        }
    }
    initColumn = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            }, {
                title: '邮箱',
                dataIndex: 'email'
            }, {
                title: '电话',
                dataIndex: 'phone'
            }, {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            }, {
                title: '所属角色',
                dataIndex: 'role_id',
                render: (id) => {
                    const target = this.state.roles.find((role) => role._id === id)
                    return target ? target.name : '无'
                }
            }, {
                title: '操作',
                render: (user) => (<span>
                    <LinkButton onClick={() => { this.setState({ isShowAdd: true, user }) }}>修改</LinkButton>
                    <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
                </span>)
            }
        ]
    }
    updateUser = () => { }
    // 删除指定用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功！')
                    this.getUsers()
                }
            }
        })
    }
    componentWillMount() {
        this.initColumn()
    }
    componentDidMount() {
        this.getUsers()
    }
    addOrUpdateUser = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 1.隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                const { username, password, phone, email, role_id } = values
                const user = { username, password, phone, email, role_id }
                if (this.state.user._id) {
                    user._id = this.state.user._id
                }
                const result = await reqAddOrUpdateUser(user)
                this.form.resetFields()
                if (result.status === 0) {
                    // 3.重新显示列表
                    this.getUsers()
                    message.success(`${(this.state.user._id)?'更新':'添加'}用户成功`)
                } else {
                    message.error(result.msg)
                }
            }
        })
    }

    render() {
        const { users, isShowAdd, roles, user } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => { this.setState({ isShowAdd: true,user:{} }) }}>创建用户</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={users}
                    columns={this.columns}
                    bordered
                    rowKey='_id'
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    onRow={this.onRow}
                />
                <Modal
                    title={user._id ? '修改用户' : '创建用户'}
                    visible={isShowAdd}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => { this.setState({ isShowAdd: false }); this.form.resetFields() }}
                >
                    <AddUpdate
                        setForm={(form) => { this.form = form }}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }
}
