import React, { Component } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

/**
 * 用来指定商品详情的富文本编辑器
 */
export default class RichTextEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState: EditorState.createEmpty(),  //创建一个无内容的编辑对象
        }
        if (this.props.detail) {
            const contentBlock = htmlToDraft(this.props.detail)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }


        }
    }
    static propTypes = {
        detail: PropTypes.string
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }
    // 通过方法向父组件传值
    getDetail = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }
    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/manage/img/upload');
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
                const data = new FormData();
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url  //得到图片地址
                    resolve({ data: { link: url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                })
            }
        )
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px solid #000', padding: 10, minHeight: 200 }}
                onEditorStateChange={this.onEditorStateChange} //绑定数据监听
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />

        )
    }
}
