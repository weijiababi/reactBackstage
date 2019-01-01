import React, { Component } from 'react'
import MyTable from '../MyTable/MyTable'
import { Tag, Button, Divider, Icon } from 'antd'

export class Admin extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.url = '/backend/manager/finds'
    this.row_key = 'manager_id'
    this.columns = [
      {
        title: 'id',
        key: 'manager_id',
        dataIndex: 'manager_id',
        render: id => <Tag>{id}</Tag>
      },
      {
        title: '管理员',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '昵称',
        key: 'nick_name',
        dataIndex: 'nick_name'
      },
      {
        title: '加入时间',
        key: 'create_time',
        dataIndex: 'create_time'
      },
      {
        title: '操作',
        key: 'action',
        render: (text, params, index) => (
          <span>
            <Button type="primary">编辑用户</Button>
            <Divider type="vertical" />
            <Button
              style={{
                color: '#fff',
                backgroundColor: 'rgba(200,60,60,.9)'
              }}
              onClick={this.deleteAdmin.bind(this, params)}
            >
              删除
            </Button>
          </span>
        )
      }
    ]
    this.searchColumn = [
      {
        key: 'name',
        placeholder: '管理员名字'
      }
    ]
  }

  render() {
    return (
      <div className="admin">
        <MyTable
          url={this.url}
          columns={this.columns}
          row_key={this.row_key}
          searchColumn={this.searchColumn}
          ref="myTable"
          left={this.addAdmin()}
          transition={true}
        />
      </div>
    )
  }

  deleteAdmin = admin => {
    let id = admin.manager_id
    let key = 'manager_id'
    let url = '/backend/manager/deletes'
    let postKey = 'manager_ids'
    this.refs.myTable.delete(id, key, postKey, url)
  }

  addAdmin() {
    return (
      <div>
        <Button type="primary">
          <Icon type="plus" />
          添加管理员
        </Button>
      </div>
    )
  }
}

export default Admin
