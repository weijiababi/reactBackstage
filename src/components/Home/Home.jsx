import React, { Component } from 'react'
import { Layout, Menu, Icon, message, Avatar } from 'antd'
import { Route, Redirect, Switch, Link } from 'react-router-dom'
import Cookie from 'js-cookie'
import $post from '../../static/api/api.js'
import User from '../User/User'
import Saleman from '../Saleman/Saleman'
import Product from '../Product/Product'
import Address from '../Address/Address'
import Admin from '../Admin/Admin'
import './Home.scss'
const { Header, Sider, Content } = Layout
export class Home extends Component {
  state = {
    collapsed: false,
    selectItem: ['0'],
    navList: [
      {
        name: 'user',
        icon: 'user',
        link: '/home/user'
      },
      {
        name: 'saleman',
        icon: 'robot',
        link: '/home/saleman'
      },
      {
        name: 'admin',
        icon: 'thunderbolt',
        link: '/home/admin'
      },
      {
        name: 'address',
        icon: 'video-camera',
        link: '/home/address'
      },
      {
        name: 'product',
        icon: 'upload',
        link: '/home/product'
      }
    ]
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  getCookie = () => {
    $post('/backend/manager/login', {
      name: '伟佳',
      password: '123456'
    }).then(res => {
      console.log(res)
      if (res.code === 200) {
        message.success('成功获取session')
        Cookie.set('session', res.data.session_id)
      }
    })
  }

  checkNav = () => {
    this.state.navList.map((item, index) => {
      if (item.link === window.location.pathname) {
        this.setState({
          selectItem: Array.of(String(index)) //Array.from({ length: 1 }, () => String(index))
        })
      }
      return item.link === window.location.pathname
    })
  }

  componentWillMount() {
    this.checkNav()
  }

  render() {
    const navList = this.state.navList
    return (
      <Layout style={{ height: '100%' }}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={this.state.selectItem}
          >
            {navList.map((item, index) => {
              return (
                <Menu.Item key={index}>
                  <Link to={item.link}>
                    <Icon type={item.icon} />
                    <span>{item.name}</span>
                  </Link>
                </Menu.Item>
              )
            })}
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <Icon
              type="menu-unfold"
              onClick={this.toggle}
              className={this.state.collapsed ? 'trigger rotate' : 'trigger'}
            />
            <Avatar
              icon="user"
              onClick={this.getCookie}
              style={{ margin: '0 20px' }}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
              overflowY: 'auto',
              overflowX: 'hidden'
            }}
          >
            <Switch>
              <Route path="/home/user" exact component={User} />
              <Route path="/home/saleman" exact component={Saleman} />
              <Route path="/home/admin" exact component={Admin} />
              <Route path="/home/product" exact component={Product} />
              <Route path="/home/address" exact component={Address} />
              <Redirect exact from="/home" to="/home/user" />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default Home
