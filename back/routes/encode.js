const express = require('express');
const router = express.Router();
const pako = require('pako');
const CryptoJS = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const {
    S3,
} = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
});

const bucketName = process.env.AWS_BUCKET;

function base64UrlSafeEncode(data) {
    return data.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const secretKey = process.env.CRYPTO_SECRET;

router.post('/', async (req, res) => {
    const data = req.body;
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

    res.send({ id: base64UrlSafeEncode(id) });
});

module.exports = router;
