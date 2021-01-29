const AWS = require('aws-sdk');
let s3;
if (process.env.STAGE == 'dev') {
  s3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: 'S3RVER', // This specific key is required when working offline
    secretAccessKey: 'S3RVER',
    endpoint: new AWS.Endpoint('http://localhost:4569'),
  });
} else {
  s3 = new AWS.S3({
    s3ForcePathStyle: true,
  });
}
AWS.config.region = "eu-west-2";

module.exports.getPreSignedUrl = (recipeName, fileType) => {
  console.log(process.env.PICTURES_BUCKET)
  if (fileType !== 'image/jpeg' && fileType !== 'image/png') {
    return new Promise((_, reject) => reject(`File type is invalid, must be either jpeg or png formats`))
  }
  const params = {
    Bucket: process.env.PICTURES_BUCKET,
    Key: `${recipeName}.${fileType.split('/')[1]}`,
    // Expires: 60
    ContentType: fileType
  };
  console.log(`Getting presigned URL with params ${JSON.stringify(params)}`)
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, function (err, url) {
      if (err) {
        console.log(`Error getting presigned url ${err}`)
        reject(err)
      } else {
        console.log(`retrieved presigned url ${url}`)
        resolve(url)
      }
    });
  })
}
module.exports.savePicture = (recipeName, encodedImage) => {
  if (!encodedImage) return new Promise((rs, rj) => {
    console.log("No picture so resolving")
    return rs(recipeName);
  })
  let decodedImage = Buffer.from(encodedImage, 'base64');
  const bucketName = process.env.PICTURES_BUCKET;
  const filePath = recipeName + ".jpeg"
  const params = {
    "Body": decodedImage,
    "Bucket": bucketName,
    "Key": filePath
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        console.log(`There was an error saving the picture for recipes ${recipeName}`, err);
        return reject(err);
      }
      console.log(`Picture for recipe ${recipeName} saved succesfully`)
      return resolve(recipeName);
    }
    );
  });
};