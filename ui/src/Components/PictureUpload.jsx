import React, { useState, useEffect } from "react"
import {
  getPictureUploadUrl, getPictureDownloadUrl, savePicture, getPicture
} from "../Gateway/query-recipes";
import Upload from 'rc-upload';
import { getUsername } from "../Utilities/helper-functions";
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import "./pictureUpload.scss"

function ActionItems({ onRemove, pictureUrl }) {
  const previewButtom = (
    <a href={pictureUrl} target="_blank" rel="noopener noreferrer" title="Preview file">
      <span role="img" aria-label="eye">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z">
          </path>
        </svg>
      </span>
    </a>
  )
  const deleteButton = (
    <button title="Remove file" type="button" className="delete-button" onClick={onRemove}>
      <span role="img" aria-label="delete" tabIndex="-1" className="delete-button-image">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
        </svg>
      </span>
    </button>
  )
  return (
    <span className="action-buttons">
      {previewButtom}
      {onRemove && deleteButton}
    </span>
  )
}

function PictureTile({ onRemove, pictureUrl }) {
  return (
    <div className="picture-container">
      <img src={pictureUrl} className="picture" />
      {<ActionItems onRemove={onRemove} pictureUrl={pictureUrl} />}
    </div>
  )

}

function UploadButton({ handleUpload, handleChange, handleSuccess, handleError }) {
  const uploadButton = (
    <span className="upload-button">
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    </span>
  );
  return (
    <Upload
      customRequest={handleUpload}
      onStart={handleChange}
      onSuccess={handleSuccess}
      onError={handleError}
    >
      {uploadButton}
    </Upload>
  )
}

function UploadPicture({ pictures, recipeName, setPictures }) {
  const handleChange = (file) => {
    file.url = URL.createObjectURL(file);
    setPictures([file]);
  }
  const onSuccess = (result) => {
    console.log("success", result)
  }
  const onError = (error) => {
    console.error(error)
  }

  const handleUpload = ({ file }) => {
    getPictureUploadUrl(recipeName, file.type)
      .then(url => {
        savePicture(url, file)
          .then(result => {
            onSuccess(result)
          })
          .catch(error => {
            onError(error)
          })
      })
      .catch(error => {
        onError(error)
      })
  }

  function removeImage() {
    console.log("removing file")
    setPictures([])
  }

  return (
    pictures.length === 0
      ? <UploadButton
        handleChange={handleChange}
        handleError={onError}
        handleSuccess={onSuccess}
        handleUpload={handleUpload}
      />
      : <PictureTile onRemove={removeImage} pictureUrl={pictures[0].url} />
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

  const content = () => {
    if (loading){
      return <LoadingOutlined style={{margin: "45%"}} />;
    }
    if (getUsername() === "emma") {
      return <UploadPicture pictures={pictures} recipeName={recipeName} setPictures={setPictures} />;
    }
    if (pictures[0]) {
      return <PictureTile pictureUrl={pictures[0].url} />;
    }
  }

  return (
    <div className="upload-container">
      <div className="picture-border">
        {content()}
      </div>
    </div>
  )
}
