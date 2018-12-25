import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export class ArticlePublish extends Component {
  handleEditorChange = e => {
    console.log(e.target.getContent())
  }
  render() {
    return (
      <div className="articlePublice">
        <Editor
          initialValue="<p>This is the initial content of the editor</p>"
          init={{
            plugins: 'link image code',
            toolbar:
              'undo redo | bold italic | alignleft aligncenter alignright | code',
            language: 'zh_cn'
          }}
          onChange={this.handleEditorChange}
        />
      </div>
    )
  }
}

export default ArticlePublish
