import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload, Image } from 'antd';
import ImgCrop from 'antd-img-crop';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const UploadFile = ({previewImage,setPreviewImage}) => {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        //console.log(file.preview);
        setPreviewOpen(true);
        //setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        setPreviewTitle('upload');
    };


    const handleChange = async ({ fileList: newFileList,file }) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setFileList(newFileList);
        setPreviewImage(file.preview);
        //console.log(file.preview??"")
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{marginTop: 8,}} >
                Upload
            </div>
        </div>
    );


    return (
        <>
        
            <ImgCrop rotate>
                <Upload
                    action=""
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </ImgCrop>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                <Image
                    alt="upload"
                    preview={false}
                    style={{ width: '100%', }}
                    src={previewImage} />
            </Modal>
        </>
    );
};
export default UploadFile;