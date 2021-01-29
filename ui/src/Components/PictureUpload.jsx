// import React, { useState } from "react"
// import { Upload, Modal } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';
import { getPictureUrl, savePicture } from "../Gateway/query-recipes";
// import "./pictureUpload.scss"

// export default function PictureUpload({ recipeName }) {
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [previewImage, setPreviewImage] = useState("");
//   const [previewTitle, setPreviewTitle] = useState("false");
//   const [picture, setPicture] = useState(null);
//   const handleCancel = () => setPreviewVisible(false);

//   const handlePreview = async file => {
//     setPreviewVisible(true);
//     setPreviewImage(file.response.url);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
//   };

//   const uploadButton = (
//     <div className="Nulled-out-upload">
//       <PlusOutlined />
//       <div style={{ marginTop: 8 }}>Upload</div>
//     </div>
//   );

//   const handleUpload = ({file, onSuccess, onError}) => {
//     console.log("Handling upload")

//     let fileType = file.type
//     getPictureUrl(recipeName, fileType)
//       .then(url => {
//         savePicture(url, file)
//           .then(result => {
//             onSuccess(result)
//           })
//           .catch(error => {
//             console.log(error)
//             onError(error)
//           })
//       })
//       .catch(error => {
//         console.log(error);
//         onError(error)
//       })
//   }
  

//   function beforeUpload(file) {
//     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//     if (!isJpgOrPng) {
//       console.log('You can only upload JPG/PNG file!');
//     }
//     const isLt2M = file.size / 1024 / 1024 < 2;
//     if (!isLt2M) {
//       console.log('Image must smaller than 2MB!');
//     }
//     return isJpgOrPng && isLt2M;
//   }

//   function removeImage(file){
//     console.log("removing file")
//   }

//   const onChange = ({ file }) => {
//     setPicture(file);
//   };

//   return (
//     <>
//       <Upload
//         listType="picture-card"
//         onPreview={handlePreview}
//         customRequest={handleUpload}
//         beforeUpload={beforeUpload}
//         onRemove={removeImage}
//         onChange={onChange}
//       >
//         {console.log("picture", picture)}
//           {picture == null ? uploadButton : null }
//       </Upload>
//       <Modal
//         visible={previewVisible}
//         title={previewTitle}
//         footer={null}
//         onCancel={handleCancel}
//       >
//         <img alt="example" style={{ width: '100%' }} src={previewImage} />
//       </Modal>
//     </>
//   );
// }
import React from "react"
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: [],
  };
    handleUpload = ({file, onSuccess, onError}) => {
    console.log("Handling upload")

    let fileType = file.type
    getPictureUrl("recipe", fileType)
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

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    console.log(file)
    if (!file.url && !file.preview) {
      if (file.response && file.response.url) {
        file.url = file.response.url
      } else {
        file.preview = await getBase64(file.originFileObj);
      } 
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
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
          fileList={fileList}
          customRequest={this.handleUpload}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}