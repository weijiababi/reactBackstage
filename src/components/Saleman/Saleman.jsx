import React, { Component } from 'react'
import MyTable from '../MyTable/MyTable'
import { Tag, Button, Switch, Divider, message, Modal, Form, Input } from 'antd'
import $post from '../../static/api/api.js'
import Cookie from 'js-cookie'
import './Saleman.scss'
const FormItem = Form.Item

export class Saleman extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
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
        title: '加入时间',
        key: 'create_time',
        dataIndex: 'create_time'
      },
      {
        title: '操作',
        render: (text, params, index) => {
          return (
            <span>
              <Button
                type="primary"
                size="small"
                onClick={this.createQr.bind(this, params)}
              >
                生成二维码
              </Button>
              <Divider type="vertical" />
              <Button
                style={{
                  color: '#fff',
                  backgroundColor: 'rgba(200,60,60,.9)',
                  border: 'none'
                }}
                size="small"
                onClick={this.deleteSaleman.bind(this, params)}
              >
                删除
              </Button>
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
          searchColumn={[]}
          ref="myTable"
          left={this.addSalemanBtn()}
        />
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.hideModal}
          onCreate={this.handleCreate}
        />
      </div>
    )
  }

  changeStatus = (params, index) => {
    let status = params.status === 1 ? 2 : 1
    let key = { status }
    let msg = params.status === 1 ? '关闭成功' : '开启成功'
    let url = ''
    this.refs.myTable.update(key, index, msg, url)
  }

  deleteSaleman = params => {
    let id = params.vocational_worker_id
    let key = 'vocational_worker_id'
    let url = '/backend/vocational_worker/deletes'
    let postKey = 'vocational_worker_ids'
    this.refs.myTable.delete(id, key, postKey, url)
  }

  createQr = params => {
    let id = params.vocational_worker_id
    $post('/backend/vocational_worker/makeQrCode', {
      vocational_worker_id: id
    }).then(res => {
      console.log('获取二维码')
      console.log(res)
      if (res.code === 200) {
        let url = res.data.url + '&session_id=' + Cookie.get('session')
        window.location.href = url
        message.success('获取二维码成功')
      }
    })
  }

  saveFormRef = formRef => {
    this.formRef = formRef
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  hideModal = () => {
    this.setState({
      visible: false
    })
  }

  handleCreate = () => {
    const form = this.formRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        message.error('请重新输入')
        return
      }

      console.log(values)
      this.hideModal()
      message.success('添加成功')
    })
  }

  addSalemanBtn() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          添加业务员
        </Button>
      </div>
    )
  }
}

export default Saleman

const CollectionCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={visible}
          title="添加业务员"
          okText="确认"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <FormItem label="姓名" style={{ marginBottom: 0 }}>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入姓名!',
                    type: 'string'
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="手机号" style={{ marginBottom: 0 }}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的手机号!',
                    pattern: new RegExp(/^1[34578]\d{9}$/)
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="密码" style={{ marginBottom: 0 }}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入有效长度密码!',
                    min: 6,
                    max: 12
                  }
                ]
              })(<Input type="password" />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)
