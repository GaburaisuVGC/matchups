const pako = require('pako');
const CryptoJS = require('crypto-js');
const { S3 } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_BUCKET;
const secretKey = process.env.CRYPTO_SECRET;

// Helper function to convert a readable stream to a string
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
};

const decryptData = (encryptedData, secretKey) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const getDecodedDocument = async (id) => {
    const s3Key = id;

    const s3Object = await s3.getObject({
        Bucket: bucketName,
        Key: s3Key
    });

    const encryptedData = await streamToString(s3Object.Body);
    const decryptedBase64Data = decryptData(encryptedData, secretKey);
    const compressedData = Buffer.from(decryptedBase64Data, 'base64');
    const decompressedData = pako.ungzip(compressedData, { to: 'string' });
    const originalData = JSON.parse(decompressedData);

    return originalData;
};

const { v4: uuidv4 } = require('uuid');

const createAndEncodeDocument = async (data) => {
    const jsonStr = JSON.stringify(data);
    const compressedData = pako.gzip(jsonStr);
    const base64CompressedData = Buffer.from(compressedData).toString('base64');
    const encryptedData = CryptoJS.AES.encrypt(base64CompressedData, secretKey).toString();
    const id = uuidv4();

    await s3.putObject({
        Bucket: bucketName,
        Key: id,
        Body: encryptedData,
        ContentType: 'text/plain'
    });

    return id;
};

module.exports = {
    getDecodedDocument,
    createAndEncodeDocument,
};
