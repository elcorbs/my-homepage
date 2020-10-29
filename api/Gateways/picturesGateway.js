const AWS = require('aws-sdk');
const s3 = new AWS.S3();
AWS.config.region = "eu-west-2";

module.exports.savePicture = (recipeName, encodedImage) => {
  let decodedImage = Buffer.from(encodedImage, 'base64');
  const bucketName = process.env.PICTURES_BUCKET;
  const filePath = recipeName + ".jpg"
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
      return resolve(name);
    }
    );
  });
};