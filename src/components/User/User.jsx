import React, { Component } from 'react'
import { Tag, Button, Divider, Popconfirm, message, Switch } from 'antd'
// eslint-disable-next-line
import $post from '../../static/api/api.js'
import MyTable from '../MyTable/MyTable'

export class User extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.url = '/backend/user/finds'
    this.row_key = 'user_id'
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
        render: name => <Tag>{name}</Tag>
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone'
      },
      {
        title: '用户id',
        dataIndex: 'user_id',
        key: 'user_id',
        render: id => <Tag>{id}</Tag>
      },
      {
        title: '加入时间',
        dataIndex: 'create_time',
        key: 'create_time'
      },
      {
        title: '是否拉黑',
        key: 'status',
        render: (text, params, index) => {
          return (
            <Switch
              defaultChecked={params.status === 1}
              onChange={this.changeStatus.bind(this, params, index)}
            />
          )
        }
      },
      {
        title: '操作',
        key: 'action',
        render: (text, params, index) => (
          <span>
            <Popconfirm
              title="是否将该用户设为管理员"
              onConfirm={this.setAdmin.bind(this, text, params, index)}
              okText="确认"
              cancelText="取消"
            >
              <Button size="small">设为管理员</Button>
            </Popconfirm>
          </span>
        )
      }
    ]
    this.searchColumn = [
      {
        key: 'phone',
        type: 'input',
        placeholder: '手机号',
        initialVal: ''
      }
    ]
  }

  render() {
    return (
      <div className="User">
        <MyTable
          url={this.url}
          row_key={this.row_key}
          columns={this.columns}
          searchColumn={this.searchColumn}
          ref="myTable"
        />
      </div>
    )
  }

  changeStatus = (params, index) => {
    let status = params.status === 1 ? 2 : 1
    let { user_id } = params
    let key = { status, user_id }
    let msg = params.status === 1 ? '拉黑成功' : '解禁成功'
    let url = '/backend/user/status'
    this.refs.myTable.update(key, index, msg, url)
  }

  setAdmin = (text, params, index) => {
    message.success(`用户${params.user_id}已成功设置`)
  }
}

export default User
