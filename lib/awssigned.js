import clientS3Pkg, { ListObjectsCommand, GetObjectCommand } from "@aws-sdk/client-s3";

const {
  //CreateBucketCommand,
  //DeleteObjectCommand,
  PutObjectCommand,
  //DeleteBucketCommand,
  S3Client 
} = clientS3Pkg;

// Note there's something like this you can do:
// 
//   AWS.config.update({ accessKeyId: $.trim($scope.creds.access_key), secretAccessKey: $.trim($scope.creds.secret_key) });
//   AWS.config.region = 'us-east-1';
//


const REGION = 'us-east-2'; // e.g. 'us-east-1'
const s3Client =  new S3Client({ region: REGION });

import s3RequestPresignerPkg from "@aws-sdk/s3-request-presigner";
const { getSignedUrl } = s3RequestPresignerPkg;

export const createSignedUrl = async (filename, mimeType, expiration) => {
    // Create the command.
    const command = new PutObjectCommand({
      Bucket: `pp-upload-test`,
      Key: filename,
      ContentType: mimeType//,
//      ACL: 'authenticated-read'  // Copied this from here: https://github.com/aws/aws-sdk-js/issues/1237
    });

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: expiration || 3600,
    });

    return signedUrl;
};



export const listBucket = async (prefix) => {
  const command = new ListObjectsCommand({
    Bucket: `pp-upload-test`,
    Prefix: prefix
  });

  const data = await s3Client.send(command);
  if (!data || !data.Contents) {
    return null;
  }

  return data.Contents.map((elem) => elem.Key);
}


export const getObject = async (key) => {
  const command = new GetObjectCommand({
    Bucket: `pp-upload-test`,
    Key: key
  });

  const streamToString = (stream) =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });

  const data = await s3Client.send(command);
  const bodyContents = await streamToString(data.Body);
  return bodyContents;
}
