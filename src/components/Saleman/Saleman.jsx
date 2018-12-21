import React, { Component } from 'react'
import MyTable from '../MyTable/MyTable'
import {
  Button,
  Switch,
  Divider,
  message,
  Modal,
  Form,
  Input,
  Icon
} from 'antd'
import $post from '../../static/api/api.js'
import Cookie from 'js-cookie'
import './Saleman.scss'
const FormItem = Form.Item

export class Saleman extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addVisible: false,
      editVisible: false,
      clientVisible: false
    }
    this.url = '/backend/vocational_worker/finds'
    this.columns = [
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '邀请码',
        key: 'invitation_code',
        dataIndex: 'invitation_code'
      },
      {
        title: '手机号',
        key: 'phone',
        dataIndex: 'phone'
      },
      {
        title: '商务人',
        key: 'commerces',
        render: params => {
          return <div>{params.commerces.name}</div>
        }
      },
      {
        title: '客户数',
        key: 'user_num',
        dataIndex: 'user_num'
      },
      {
        title: '加入时间',
        key: 'create_time',
        dataIndex: 'create_time'
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
        title: '备注',
        key: 'remark',
        dataIndex: 'remark'
      },
      {
        title: '操作',
        render: (text, params, index) => {
          return (
            <span>
              <Button type="primary" onClick={this.createQr.bind(this, params)}>
                生成二维码
              </Button>
              <Divider type="vertical" />
              <Button
                type="primary"
                onClick={this.checkClient.bind(this, params)}
              >
                查看客户
              </Button>
              <Divider type="vertical" />
              <Button
                type="primary"
                onClick={this.editSaleman.bind(this, params)}
              >
                编辑
              </Button>
              <Divider type="vertical" />
              <Button
                style={{
                  color: '#fff',
                  backgroundColor: 'rgba(200,60,60,.9)',
                  border: 'none'
                }}
                onClick={this.deleteSaleman.bind(this, params)}
              >
                删除
              </Button>
            </span>
          )
        }
      }
    ]
    this.client = {
      url: '/backend/user/finds',
      columns: [
        { title: '姓名', key: 'name', dataIndex: 'name' },
        { title: '联系方式', key: 'phone', dataIndex: 'phone' },
        {
          title: '类型',
          key: 'type',
          render: params => {
            return (
              <div>
                {params.type === 2
                  ? '银锤合伙人'
                  : params.type === 3
                  ? '金锤合伙人'
                  : '未知'}
              </div>
            )
          }
        }
      ],
      row_key: 'name',
      params: {}
    }
    this.row_key = 'identifier'
    this.userData = {}
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
          left={this.addSalemanBtn()}
          transition={true}
        />
        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          addVisible={this.state.addVisible}
          onCancel={this.hideAdd}
          onCreate={this.handleCreate}
        />
        <EditCreateForm
          wrappedComponentRef={this.saveEditFormRef}
          editVisible={this.state.editVisible}
          onEditCancel={this.onEditCancel}
          onEditCreate={this.onEditCreate}
          initData={this.userData}
        />
        <Modal
          title="客户表"
          visible={this.state.clientVisible}
          onOk={this.hideClient}
          onCancel={this.hideClient}
        >
          {this.state.clientVisible && (
            <MyTable
              url={this.client.url}
              row_key={this.client.row_key}
              columns={this.client.columns}
              params={this.client.params}
              searchColumn={[]}
            />
          )}
        </Modal>
      </div>
    )
  }

  //开关状态
  changeStatus = (params, index) => {
    let status = params.status === 1 ? 2 : 1
    let key = { status }
    let msg = params.status === 1 ? '关闭成功' : '开启成功'
    let url = ''
    this.refs.myTable.update(key, index, msg, url)
  }
  //删除合伙人
  deleteSaleman = params => {
    let id = params.vocational_worker_id
    let key = 'vocational_worker_id'
    let url = '/backend/vocational_worker/deletes'
    let postKey = 'vocational_worker_ids'
    this.refs.myTable.delete(id, key, postKey, url)
  }
  //下载二维码
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

  //查询客户
  checkClient = params => {
    this.client.params = {
      vocational_worker_id: params.vocational_worker_id
    }
    this.setState({
      clientVisible: true
    })
  }
  hideClient = () => {
    this.setState({
      clientVisible: false
    })
  }
  //查询客户

  //编辑合伙人
  editSaleman = params => {
    this.userData = params
    this.setState({
      editVisible: true
    })
  }
  onEditCancel = () => {
    this.setState({
      editVisible: false
    })
  }
  onEditCreate = () => {
    const form = this.editFormRef.props.form
    form.validateFields((err, values) => {
      if (err) {
        message.error('请重新输入')
        return
      }

      let params = {
        ...values,
        vocational_worker_id: this.userData.vocational_worker_id
      }
      $post('/backend/vocational_worker/edit', params).then(res => {
        console.log('编辑合伙人')
        console.log(res)
        if (res.code === 200) {
          message.success('编辑成功')
          this.refs.myTable.getData()
        }
      })
      this.onEditCancel()
    })
  }
  saveEditFormRef = formRef => {
    this.editFormRef = formRef
  }
  //编辑合伙人

  //新建合伙人
  saveFormRef = formRef => {
    this.formRef = formRef
  }
  showAdd = () => {
    this.setState({
      addVisible: true
    })
  }
  hideAdd = () => {
    this.setState({
      addVisible: false
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
      this.hideAdd()
      message.success('添加成功')
    })
  }
  //新建合伙人

  //新建合伙人按钮
  addSalemanBtn() {
    return (
      <div>
        <Button type="primary" onClick={this.showAdd}>
          <Icon type="plus" />
          添加合伙人
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
      const { addVisible, onCancel, onCreate, form } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={addVisible}
          title="添加合伙人"
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
                    pattern: new RegExp(/^1[3456789]\d{9}$/)
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

const EditCreateForm = Form.create()(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const {
        editVisible,
        onEditCancel,
        onEditCreate,
        form,
        initData
      } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={editVisible}
          title="添加业务员"
          okText="确认"
          cancelText="取消"
          onCancel={onEditCancel}
          onOk={onEditCreate}
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
                ],
                initialValue: initData.name
              })(<Input />)}
            </FormItem>
            <FormItem label="手机号" style={{ marginBottom: 0 }}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确的手机号!',
                    pattern: new RegExp(/^1[3465789]\d{9}$/)
                  }
                ],
                initialValue: initData.phone
              })(<Input />)}
            </FormItem>
            <FormItem label="备注" style={{ marginBottom: 0 }}>
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '填写备注'
                  }
                ],
                initialValue: initData.remark
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      )
    }
  }
)
