import React, { Component } from 'react'
import {
  Tag,
  Button,
  Divider,
  Popconfirm,
  message,
  Switch,
  Modal,
  Input,
  Icon
} from 'antd'
// eslint-disable-next-line
import $post from '../../static/api/api.js'
import MyTable from '../MyTable/MyTable'

export class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rechargeVisible: false,
      money: ''
    }

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
            <Divider type="vertical" />
            <Button
              type="primary"
              onClick={this.handRecharge.bind(this, params)}
            >
              手动充值
            </Button>
          </span>
        )
      }
    ]
    this.searchColumn = [{ key: 'phone', placeholder: '手机号' }]
    this.user = {}
  }

  componentDidMount() {}

  render() {
    const { money } = this.state
    const suffix =
      money > 0 ? <Icon type="close-circle" onClick={this.emptyMoney} /> : null
    return (
      <div className="User">
        <MyTable
          url={this.url}
          row_key={this.row_key}
          columns={this.columns}
          searchColumn={this.searchColumn}
          ref="myTable"
          transition={true}
        />
        <Modal
          title="手工充值"
          visible={this.state.rechargeVisible}
          onCancel={this.hideRecharge}
          onOk={this.confirmRecharge}
        >
          <Input
            placeholder="请输入金额"
            prefix={<Icon type="fire" />}
            onChange={this.onChangeMoney}
            style={{ marginTop: '10px' }}
            value={money}
            suffix={suffix}
          />
        </Modal>
      </div>
    )
  }

  changeStatus = (params, index) => {
    let status = params.status === 1 ? 2 : 1 //计算下一个状态
    let { user_id } = params //获取user_id的值
    let param = { status, user_id } //构造参数对象
    let msg = params.status === 1 ? '拉黑成功' : '解禁成功'
    let url = '/backend/user/status'
    this.refs.myTable.update(param, index, msg, url)
  }

  setAdmin = (text, params, index) => {
    message.success(`用户${params.user_id}已成功设置为管理员`)
  }

  hideRecharge = () => {
    this.setState({
      money: '',
      rechargeVisible: false
    })
  }

  handRecharge = user => {
    this.user = user
    this.setState({
      rechargeVisible: true
    })
  }

  onChangeMoney = e => {
    this.setState({
      money: e.target.value
    })
  }

  emptyMoney = () => {
    this.setState({
      money: ''
    })
  }

  confirmRecharge = () => {
    let reg = /^[1-9][0-9]*$/
    if (!reg.test(Number(this.state.money))) {
      message.error('请输入正确金额')
      this.hideRecharge()
      return
    }

    $post('/backend/user_wallet/handRecharge', {
      user_id: this.user.user_id,
      balance: this.state.money
    }).then(res => {
      console.log('手工充值')
      console.log(res)
      if (res.code === 200) {
        message.success('充值成功')
      } else {
        message.error('充值失败')
      }
      this.hideRecharge()
    })
  }
}

export default User
