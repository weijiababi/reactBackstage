import React, { Component } from 'react'
import MyTable from '../MyTable/MyTable'
// eslint-disable-next-line
import { Tag, Button, Switch, Divider, Popconfirm, message } from 'antd'

export class Saleman extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.url = '/backend/vocational_worker/finds'
    this.columns = [
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '手机号',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '状态',
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
        title: '昵称',
        key: 'nickname',
        dataIndex: 'nickname',
        render: nickname => {
          return nickname === '' ? '暂未设置' : <Tag>{nickname}</Tag>
        }
      },
      {
        title: '操作',
        render: (text, params, index) => {
          return (
            <span>
              <Button size="small">删除</Button>
            </span>
          )
        },
        fixed: 'right',
        width: 200
      }
    ]
    this.row_key = 'identifier'
  }

  componentDidMount() {}

  render() {
    return (
      <div className="saleman">
        <MyTable
          url={this.url}
          row_key={this.row_key}
          columns={this.columns}
          ref="myTable"
        />
      </div>
    )
  }

  changeStatus(params, index) {
    let status = params.stauts === 1 ? 2 : 1
    let key = 'status'
    let msg = params.status === 1 ? '关闭成功' : '开启成功'
    let url = ''
    this.refs.myTable.update(status, key, index, msg, url)
  }
}

export default Saleman
