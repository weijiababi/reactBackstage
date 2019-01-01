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
  Icon,
  Radio
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
      clientVisible: false,
      commercesVisible: false,
      partnerVisible: false,
      selectedCommerces: {},
      selectedPartner: {}
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
    this.searchColumn = [
      { key: 'phone', placeholder: '手机号' },
      { key: 'name', placeholder: '姓名' },
      { key: 'remark', placeholder: '备注', isMore: true },
      { key: 'commerces_name', placeholder: '商务名字' },
      {
        type: 'select',
        key: 'type',
        placeholder: '请选择',
        options: [{ value: 1, label: '银锤' }, { value: 2, label: '金锤' }],
        isMore: true
      },
      {
        type: 'datePicker',
        key: 'date',
        placeholder: '请选择日期',
        isMore: true
      }
    ]
    this.row_key = 'identifier'
    this.userData = {}
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
    this.commerces = {
      url: '/backend/commerces/finds',
      columns: [
        { title: '姓名', key: 'name', dataIndex: 'name' },
        { title: '手机号', key: 'phone', dataIndex: 'phone' },
        { title: '备注', key: 'remark', dataIndex: 'remark' },
        {
          title: '操作',
          key: 'action',
          render: params => {
            return (
              <Button
                type="primary"
                onClick={this.selectCommerces.bind(this, params)}
              >
                选择
              </Button>
            )
          }
        }
      ],
      row_key: 'commerces_id',
      searchColumn: [{ key: 'name', placeholder: '商务人员名字' }]
    }
    this.partner = {
      url: '/backend/vocational_worker/chooseVocationalWorker',
      columns: [
        { title: '姓名', key: 'name', dataIndex: 'name' },
        { title: '手机号', key: 'phone', dataIndex: 'phone' },
        { title: '备注', key: 'remark', dataIndex: 'remark' },
        {
          title: '操作',
          key: 'action',
          render: params => {
            return (
              <Button
                type="primary"
                onClick={this.selectPartner.bind(this, params)}
              >
                选择
              </Button>
            )
          }
        }
      ],
      row_key: 'name',
      searchColumn: [
        { key: 'name', placeholder: '姓名' },
        { key: 'phone', placeholder: '手机号' }
      ]
    }
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
          searchColumn={this.searchColumn}
          transition={true}
        />

        <CollectionCreateForm
          wrappedComponentRef={this.saveFormRef}
          addVisible={this.state.addVisible}
          onCancel={this.hideAdd}
          onCreate={this.handleCreate}
          showCommerces={this.showCommerces}
          showPartner={this.showPartner}
          commerces={this.state.selectedCommerces}
          partner={this.state.selectedPartner}
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
          destroyOnClose={true}
        >
          <MyTable
            url={this.client.url}
            row_key={this.client.row_key}
            columns={this.client.columns}
            params={this.client.params}
            searchColumn={[]}
          />
        </Modal>

        <Modal
          title="选择商务负责人"
          visible={this.state.commercesVisible}
          onOk={this.hideCommerces}
          onCancel={this.hideCommerces}
          width={700}
          destroyOnClose={true}
        >
          <MyTable
            url={this.commerces.url}
            row_key={this.commerces.row_key}
            columns={this.commerces.columns}
            searchColumn={this.commerces.searchColumn}
          />
        </Modal>

        <Modal
          title="选择合伙人"
          visible={this.state.partnerVisible}
          onOk={this.hidePartner}
          onCancel={this.hidePartner}
          width={700}
          destroyOnClose={true}
        >
          <MyTable
            url={this.partner.url}
            row_key={this.partner.row_key}
            columns={this.partner.columns}
            searchColumn={this.partner.searchColumn}
          />
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
      selectedCommerces: {},
      selectedPartner: {},
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

      let params = {
        ...values,
        commerces_id:
          JSON.stringify(this.state.selectedCommerces.commerces_id) !== '{}'
            ? this.state.selectedCommerces.commerces_id
            : '',
        p_id:
          JSON.stringify(this.state.selectedPartner) !== '{}'
            ? this.state.selectedPartner.vocational_worker_id
            : ''
      }
      console.log(params)
      this.hideAdd()
      message.success('添加成功')
    })
  }
  //新建合伙人

  showCommerces = () => {
    this.setState({
      commercesVisible: true
    })
  }
  hideCommerces = () => {
    this.setState({
      commercesVisible: false
    })
  }
  selectCommerces = obj => {
    this.setState({
      selectedCommerces: obj
    })
    this.hideCommerces()
  }
  showPartner = () => {
    this.setState({
      partnerVisible: true
    })
  }
  hidePartner = () => {
    this.setState({
      partnerVisible: false
    })
  }
  selectPartner = obj => {
    this.setState({
      selectedPartner: obj
    })
    this.hidePartner()
  }

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
      const {
        addVisible,
        onCancel,
        onCreate,
        form,
        showCommerces,
        showPartner,
        commerces,
        partner
      } = this.props
      const { getFieldDecorator } = form
      return (
        <Modal
          visible={addVisible}
          title="添加合伙人"
          okText="确认"
          cancelText="取消"
          onCancel={onCancel}
          onOk={onCreate}
          destroyOnClose={true}
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
              })(<Input placeholder="姓名" />)}
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
              })(<Input placeholder="手机号" />)}
            </FormItem>
            <FormItem label="备注" style={{ marginBottom: 0 }}>
              {getFieldDecorator('remark')(<Input placeholder="备注" />)}
            </FormItem>
            <FormItem label="昵称" style={{ marginBottom: 0 }}>
              {getFieldDecorator('nickname')(<Input placeholder="昵称" />)}
            </FormItem>
            <FormItem label="邀请码" style={{ marginBottom: 0 }}>
              {getFieldDecorator('invitation_code', {
                rules: [
                  {
                    required: true,
                    message: '请输入正确长度的邀请码',
                    pattern: new RegExp(/^\d{6}$/)
                  }
                ]
              })(<Input placeholder="邀请码" />)}
            </FormItem>
            <FormItem label="合伙人类型" style={{ marginBottom: 0 }}>
              {getFieldDecorator('type', {
                initialValue: '2',
                rules: [{ required: true }]
              })(
                <Radio.Group>
                  <Radio value="2">银锤合伙人</Radio>
                  <Radio value="3">金锤合伙人</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <FormItem label="商务负责人" style={{ marginBottom: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Button
                  type="primary"
                  onClick={showCommerces}
                  style={{ marginRight: '5px' }}
                >
                  选择负责人
                </Button>
                <span>
                  {JSON.stringify(commerces) !== '{}' ? (
                    <div>已选择: {commerces.name}</div>
                  ) : null}
                </span>
              </div>
            </FormItem>
            <FormItem label="合伙人" style={{ marginBottom: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Button
                  type="primary"
                  onClick={showPartner}
                  style={{ marginRight: '5px' }}
                >
                  选择合伙人
                </Button>
                <span>
                  {JSON.stringify(partner) !== '{}' ? (
                    <div>已选择: {partner.name}</div>
                  ) : null}
                </span>
              </div>
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
          destroyOnClose={true}
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
