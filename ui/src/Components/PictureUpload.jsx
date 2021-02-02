import React, { useState, useEffect } from "react"
import {
  getPictureUploadUrl, getPictureDownloadUrl, savePicture, getPicture
} from "../Gateway/query-recipes";
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import "./pictureUpload.scss"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default function PictureUpload({ recipeName }) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const getAndSetPicture = () => {
      getPictureDownloadUrl(recipeName)
        .then(url => {
          getPicture(url)
            .then(result => {
              console.log("retrieved picture", result)
              if (result) {
                const picture = {
                  name: recipeName,
                  url: result.url,
                  status: "done",
                  percent: 100,
                  uid: 1
                }
                setPictures([picture])
              }
            })
            .catch(error => {
              console.log(error)
            })
        })
        .catch(error => {
          console.log(error);
        })
    }
    getAndSetPicture();
  }, [recipeName])


  const handleUpload = ({ file, onSuccess, onError }) => {
    console.log("Handling upload")

    let fileType = file.type
    getPictureUploadUrl(recipeName, fileType)
      .then(url => {
        savePicture(url, file)
          .then(result => {
            onSuccess(result)
          })
          .catch(error => {
            console.log(error)
            onError(error)
          })
      })
      .catch(error => {
        console.log(error);
        onError(error)
      })
  }

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      if (file.response && file.response.url) {
        file.url = file.response.url
      } else {
        file.preview = await getBase64(file.originFileObj);
      }
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList }) => setPictures(fileList);

  function removeImage(file) {
    console.log("removing file")
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={pictures}
        customRequest={handleUpload}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={removeImage}
        className="upload"
      >
        {pictures.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={recipeName}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
