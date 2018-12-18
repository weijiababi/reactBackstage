import React, { Component } from 'react'
import { Table, Modal, message, Input, Button } from 'antd'
import $post from '../../static/api/api.js'
import 'animate.css'
import './MyTable.scss'

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
      deleteIndex: -1,
      deleteKey: '',
      searchParams: {}
    }
    this.currentKey = ''
  }

  componentWillMount() {
    //将props的值传入state
    let searchParams = this.handleSearchColumn(this.props.searchColumn)

    this.setState({
      searchParams,
      url: this.props.url ? this.props.url : '',
      params: this.props.params ? this.props.params : {},
      searchColumn: this.props.searchColumn ? this.props.searchColumn : []
    })
  }
  componentDidMount() {
    this.getData()
  }

  render() {
    const { columns, row_key } = this.props
    const { dataSource, loading, searchColumn } = this.state
    const pagination = {
      ...this.state.pagination,
      onChange: this.pageChange.bind(this)
    }

    const showControl = this.props.left || searchColumn.length

    return (
      <div className="myTable">
        {showControl ? (
          <div className="control">
            <div className="control-left">{this.props.left}</div>
            <div className="control-right">
              {searchColumn.length > 0 && <div>{this.renderSearch()}</div>}
            </div>
          </div>
        ) : null}
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={row_key}
          pagination={pagination}
          rowClassName={(record, index) => {
            return this.state.deleteIndex === record[this.state.deleteKey]
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

  delete = (val, key, postKey, url = '') => {
    //被删除的值，被删除的key，需要做fetch的key， url
    let self = this
    Modal.confirm({
      title: '提示',
      content: '确认删除该条数据吗',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        let params = {}
        params[postKey] = Array.of(val)
        $post(url, params).then(res => {
          console.log(res)
          if (res.code === 200) {
            const dataSource = self.state.dataSource.filter(item => {
              return item[key] !== val
            })

            self.setState({
              deleteIndex: val,
              deleteKey: key
            })

            setTimeout(() => {
              self.setState({
                dataSource
              })
            }, 750)
          } else {
            message.warning(res.msg)
          }
        })
      }
    })
  }

  update = (key, index, msg = '修改成功', url = '') => {
    let dataSource = this.state.dataSource.map((item, order) => {
      return order === index ? Object.assign(item, key) : item
    })
    this.setState({
      dataSource
    })
    message.success(msg)
  }

  handleSearchColumn = columns => {
    let params = {}
    if (columns.length && columns.length > 0) {
      columns.map((item, index) => {
        params[item.key] = item.initialVal
        return item.key
      })
    }
    return params
  }

  handleInput = e => {
    console.log(this.currentKey)
    console.log(e.target.value)
  }

  renderSearch() {
    const { searchColumn } = this.state
    return (
      <div className="search">
        {searchColumn.map((item, index) => {
          return (
            <Input
              type={item.type}
              placeholder={item.placeholder}
              key={index}
              style={{ marginRight: '5px' }}
              onChange={this.handleInput}
              onFocus={(this.currentKey = item.key)}
            />
          )
        })}
        <Button type="primary">搜索</Button>
      </div>
    )
  }
}

export default MyTable
