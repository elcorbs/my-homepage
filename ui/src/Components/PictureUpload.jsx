import React, { useEffect, useState } from "react"
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getPictureUrl, savePicture } from "../Gateway/query-recipes";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default function PictureUpload({recipeName}) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("false");
  const [savedFile, setSavedFile] = useState(null);
  const [pictureUrl, setPictureUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  let uploadInput;
  // const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
      console.log(file.preview)
    }
    setPreviewVisible(true);
    setPreviewImage(file.url || file.preview);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  };

  // const handleChange = ({ file }) => setSavedFile(file);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleChange = (ev) => {
    setSuccess(false)
    setPictureUrl("")
  }
  const handleUpload = (ev) => {
    let file = uploadInput.files[0];
    let [_, fileType] = uploadInput.files[0].name.split('.');
    console.log("Preparing the upload");
    console.log(file)
    getPictureUrl("picture")
    .then(url => {
      setPictureUrl(url);
      console.log("Recieved a signed request " + url);
      
      savePicture(url, file, fileType)
      .then(result => {
        console.log("Response from s3", result)
        setSuccess(true);
      })
      .catch(error => {
        console.log(error)
        alert("ERROR " + error);
      })
    })
    .catch(error => {
      console.log(error);
      alert(JSON.stringify(error));
    })
  }

  return (
    <>
      <input onChange={handleChange} ref={(ref) => { uploadInput = ref; }} type="file"/>
      <button onClick={handleUpload}>UPLOAD</button>
      {/* <Upload
        action={pictureUrl}
        listType="picture-card"
        showUploadList={false}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {savedFile ? <img src={savedFile.url} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal> */}
    </>
  );
}