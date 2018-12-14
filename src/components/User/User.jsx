import React, { Component } from 'react'
import { Table, Tag, Button } from 'antd'
import $post from '../../static/api/api.js'

export class User extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataList: [],
      columns: [
        {
          title: '用户名',
          dataIndex: 'name',
          key: 'name',
          render: name => <a href="javascript:;">{name}</a>
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
          render: id => <Tag color="blue">{id}</Tag>
        },
        {
          title: '加入时间',
          dataIndex: 'create_time',
          key: 'create_time'
        },
        {
          title: '操作',
          key: 'action',
          render: params => (
            <span>
              <Button
                type="danger"
                onClick={this.getDetail.bind(this, params.user_id)}
              >
                查询用户
              </Button>
            </span>
          )
        }
      ],
      loading: true,
      currentPage: 1,
      pagination: {}
    }
  }

  componentWillMount() {
    this.getData()
  }

  componentDidMount() {}

  render() {
    const dataSource = this.state.dataList
    const columns = this.state.columns
    const loading = this.state.loading
    const pagination = {
      ...this.state.pagination,
      onChange: this.pageChange.bind(this)
    }
    return (
      <div className="User">
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="user_id"
          loading={loading}
          pagination={pagination}
        />
      </div>
    )
  }

  getData = (page = 1) => {
    this.setState({
      loading: true
    })

    $post('/user/finds', { page }).then(res => {
      console.log(res)
      this.setState({
        dataList: res.data.data,
        loading: false,
        pagination: { ...this.state.pagination, total: res.data.total },
        currentPage: res.data.current_page
      })
    })
  }

  getDetail = id => {
    alert(id)
  }

  pageChange = newPage => {
    this.getData(newPage)
  }
}

export default User
