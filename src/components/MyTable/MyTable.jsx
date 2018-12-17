import React, { Component } from 'react'
import { Table, Modal, message } from 'antd'
import $post from '../../static/api/api.js'
import 'animate.css'

export class MyTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false,
      currentPage: 1,
      url: '',
      params: {},
      searchColumn: [],
      deleteIndex: -1
    }
  }

  componentWillMount() {
    this.setState({
      url: this.props.url ? this.props.url : '',
      params: this.props.params ? this.props.params : {},
      searchColumn: this.props.searchColumn ? this.props.searchColumn : []
    })
  }
  componentDidMount() {
    this.getData()
  }

  render() {
    const columns = this.props.columns
    const row_key = this.props.row_key
    const dataSource = this.state.dataSource
    const loading = this.state.loading
    const pagination = {
      ...this.state.pagination,
      onChange: this.pageChange.bind(this)
    }

    return (
      <div className="myTable">
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={row_key}
          pagination={pagination}
          rowClassName={(record, index) => {
            return this.state.deleteIndex === record.user_id
              ? 'animated zoomOutLeft'
              : 'animated fadeInRight'
          }}
        />
      </div>
    )
  }

  getData = () => {
    let url = this.state.url
    let params = this.state.params
    let page = this.state.currentPage
    this.setState({
      loading: true
    })
    $post(url, { ...params, page }).then(res => {
      console.log('获取第' + page + '页数据')
      console.log(res)
      if (res.code === 200) {
        this.setState({
          dataSource: res.data.data,
          loading: false,
          currentPage: res.data.current_page > 0 ? res.data.current_page : 1,
          pagination: { ...this.state.pagination, total: res.data.total }
        })
      }
    })
  }

  pageChange = page => {
    this.setState(
      {
        currentPage: page
      },
      () => {
        this.getData()
      }
    )
  }

  delete = (val, key, url = '') => {
    let self = this
    Modal.confirm({
      title: '提示',
      content: '确认删除该条数据吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const dataSource = self.state.dataSource.filter(item => {
          return item[key] !== val
        })

        self.setState({
          deleteIndex: val
        })

        setTimeout(() => {
          self.setState({
            dataSource
          })
        }, 800)
      }
    })
  }

  update = (newVal, key, index, msg = '修改成功', url = '') => {
    console.log(newVal)
    console.log(key)
    console.log(index)
    message.success(msg)
    console.log(url)

    let dataSource = this.state.dataSource.map((item, order) => {
      return order === index ? { ...item } : item
    })
    console.log(dataSource)
  }
}

export default MyTable
