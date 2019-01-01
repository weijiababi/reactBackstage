import React, { Component } from 'react'
import { Card, Row, Col, Skeleton, Avatar } from 'antd'
import './monitor.scss'

export class monitor extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.cardList = [
      {
        title: '今日交易总额',
        value: '124,543,233',
        unit: '元'
      },
      {
        title: '销售目标完成率',
        value: '92',
        unit: '%'
      },
      {
        title: '活动剩余时间',
        value: '6',
        unit: '天'
      },
      {
        title: '每秒交易总额',
        value: '234',
        unit: '元'
      }
    ]
  }

  render() {
    return (
      <div className="monitor">
        <Row gutter={24}>
          <Col xl={18} lg={24} md={24} sm={24} xs={24}>
            <Card title="活动实时交易情况" style={{ height: '600px' }}>
              <Row>
                {this.cardList.map(item => {
                  return (
                    <Col md={6} sm={12} xs={24} key={item.title}>
                      <div className="dataItem">
                        <span className="dataTitle">{item.title}</span>
                        <div className="dataContent">
                          <span className="dataValue">{item.value}</span>
                          <span className="dataUnit">{item.unit}</span>
                        </div>
                      </div>
                    </Col>
                  )
                })}
                {/**
                  卫星图表
                */}
              </Row>
            </Card>
          </Col>
          <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              title="活动情况预测"
              style={{ height: '288px' }}
              loading={true}
            >
              {/**
                实时数据图
              */}
              <Card.Meta
                title="card title"
                description="This is the description"
                avatar={
                  <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                }
              />
            </Card>
            <Card
              title="券核效率"
              style={{ marginTop: '24px', height: '288px' }}
            >
              {/**
                加速计图
              */}
              <Skeleton loading={true} avatar active>
                <Card.Meta
                  title="card title"
                  description="This is the description"
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                />
              </Skeleton>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default monitor
