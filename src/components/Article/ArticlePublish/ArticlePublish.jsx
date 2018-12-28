import React, { Component } from 'react'
//eslint-disable-next-line
import { message, Form, Button, Input, Radio, Icon, Upload, Modal } from 'antd'
import Cookie from 'js-cookie'
import E from 'wangeditor'

export class ArticlePublish extends Component {
  constructor(props) {
    super(props)
    this.state = {
      content: '',
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url:
            'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ]
    }
  }
  componentDidMount() {
    this.initEditor()
  }
  initEditor() {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    this.editor = editor
    editor.customConfig.zIndex = 100
    editor.customConfig.uploadImgServer =
      'http://gc.moscales.com/backend/article/upload'
    editor.customConfig.uploadImgMaxLength = 1
    editor.customConfig.customUploadImg = (files, insert) => {
      if (files[0]) {
        const formData = new window.FormData()
        formData.append('files', files[0], 'cover.jpg') //分别为表单名称，表单值以及文件名
        formData.append('session_id', Cookie.get('session'))
        fetch('http://gc.moscales.com/backend/article/upload', {
          method: 'POST',
          body: formData
        })
          .then(res => {
            return res.json()
          })
          .then(res => {
            const data = res.data
            if (data) {
              insert('http://gc.moscales.com' + data)
            } else {
              message.info(res.msg)
            }
          })
      } else {
        message.info('請選擇要上傳的圖片')
      }
    }
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.customConfig.lang = {
      设置标题: 'Title',
      字号: 'Size',
      文字颜色: 'Color',
      设置列表: 'List',
      有序列表: '',
      无序列表: '',
      对齐方式: 'Align',
      靠左: '',
      居中: '',
      靠右: '',
      正文: 'p',
      链接文字: 'link text',
      链接: 'link',
      上传图片: 'Upload',
      网络图片: 'Web',
      图片link: 'image url',
      插入视频: 'Video',
      格式如: 'format',
      上传: 'Upload',
      创建: 'init'
    }
    editor.customConfig.onchange = html => {
      this.setState({
        content: html
      })
      console.log(this.state.content)
    }
    editor.create()
    //提取内容this.editor.txt.html()
    //提取txt this.editor.txt.text()
    //获取内容后填入this.editor.txt.html(data.content)
    //追加内容this.editor.txt.append('<p>追加的内容</p>')
    //清除内容this.editor.txt.clear()
  }

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  handleChange = ({ fileList }) => {
    console.log(fileList)
    this.setState({
      fileList
    })
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false
    })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state
    const data = {
      session_id: Cookie.get('session')
    }
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="articlePublice">
        <FormWrapper />
        <div className="clearfix" style={{ marginBottom: '20px' }}>
          <Upload
            action="https://gc.moscales.com/backend/article/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            name={'files'}
            data={data}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
        </div>
        <div ref="editorElem" />
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}

export default ArticlePublish

const FormWrapper = Form.create()(
  class extends React.Component {
    state = {
      title: '',
      intro: '',
      key: '',
      type: '0',
      img: ''
    }
    render() {
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
        labelCol: { span: 1 },
        wrapperCol: { span: 6 }
      }
      return (
        <div>
          <Form.Item
            {...formItemLayout}
            label="title"
            style={{ marginBottom: '8px' }}
          >
            {getFieldDecorator('title', {
              rules: [
                {
                  required: true,
                  message: 'please input the title'
                }
              ]
            })(<Input placeholder="please input the title" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="intro"
            style={{ marginBottom: '8px' }}
          >
            {getFieldDecorator('intro', {
              rules: [
                {
                  required: true,
                  message: 'please input the intro'
                }
              ]
            })(<Input placeholder="please input the intro" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="type"
            style={{ marginBottom: '8px' }}
          >
            {getFieldDecorator('type', {
              initialValue: '1'
            })(
              <Radio.Group>
                <Radio value="1">normal</Radio>
                <Radio value="2">learn</Radio>
                <Radio value="3">help</Radio>
              </Radio.Group>
            )}
          </Form.Item>
        </div>
      )
    }
  }
)
