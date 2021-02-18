import React, { useState, useEffect } from "react"
import {
  getPictureUploadUrl, getPictureDownloadUrl, savePicture, getPicture
} from "../Gateway/query-recipes";
import { Upload, Modal, Image } from 'antd';
import { getUsername } from "../Utilities/helper-functions";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import "./pictureUpload.scss"

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function UploadPicture({pictures, recipeName, setPictures}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleCancel = () => setPreviewVisible(false);
  const handleChange = ({fileList}) => setPictures(fileList);
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
  )
}

function ViewPicture({picture}) {
  return (
    <Image
      width={200}
      src={picture.url}
    />
  )
}

export default function Picture({ recipeName }) {
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true)

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
              setLoading(false)
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
  console.log(getUsername())

  if (loading) return <LoadingOutlined />
  if (getUsername() === "emma") return <UploadPicture pictures={pictures} recipeName={recipeName} setPictures={setPictures} />
  if (pictures[0]) return <ViewPicture picture={pictures[0]} />
  return <div />;
}
