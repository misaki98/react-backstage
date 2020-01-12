import React from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
/**
 * 用于图片上传的组件
 */
export default class PicturesWall extends React.Component {
    constructor(props) {
        super(props)
        let fileList = []
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img
            }))
        }
        this.state = {
            previewVisible: false, //标识是否显示大图预览
            previewImage: '', // 大图的url地址
            fileList
            //  [
            //     {
            //         uid: '-1',  //每一个file都有一个唯一的ID，建议设置为负数，防止冲突
            //         name: 'image.png', //图片文件名
            //         status: 'done',  //图片状态：done已上传 uploading正在上传 error上传出错 removed已删除
            //         url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', //图片的目标地址
            //     }
            // ],
        }
    }
    static propTypes = {
        imgs: PropTypes.array
    }
    //获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    //   隐藏Modal
    handleCancel = () => this.setState({ previewVisible: false });
    // 显示指定file对应的图片文件
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        // 显示大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };
    /**
     * file当前操作的图片文件
     * fileList 所有已上传图片文件对象的数组
     */
    handleChange = async ({ file, fileList }) => {
        // 一旦上传成功，就将当前上传的file信息进行修正
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('图片上传成功！')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]  //将file与fileList关联
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            // 如果删除了图片，需要通知服务器删除
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功！')
            } else {
                message.error('删除图片失败')
            }
        }

        // 在上传或删除的过程中更新fileList状态
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        return (
            <div >
                <Upload
                    action="/manage/img/upload"  //指定上传图片的地址
                    accept='image/*' //指定只接受图片格式文件
                    name='image'  //请求参数名
                    listType="picture-card"
                    fileList={fileList}  //所有已上传图片文件对象的数组
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
;