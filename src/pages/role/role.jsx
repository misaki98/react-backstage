import React from 'react'
import {
    Card,
    Button,
    Table,
    message
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles } from '../../api'

export default class Role extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: [], //所有角色的列表
            role: {}, //选中的角色
        }
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',

            }, {
                title: '授权时间',
                dataIndex: 'auth_time'
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

    render() {
        const { roles,role } = this.state
        const title = (
            <span>
                <Button style={{ marginRight: 10 }} type='primary'>创建角色</Button>
                <Button type='primary' disabled={!role._id}>设置角色权限</Button>
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
                    rowSelection={{ type: 'radio' ,selectedRowKeys:[role._id]}}
                    onRow={this.onRow}
                />

            </Card>
        )
    }
}
