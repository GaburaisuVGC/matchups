const express = require('express');
const router = express.Router();
const pako = require('pako');
const CryptoJS = require('crypto-js');
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

const secretKey = process.env.CRYPTO_SECRET;

// Fonction pour déchiffrer les données à partir de l'ID
function decryptData(encryptedData, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

router.get('/', async (req, res) => {
    const { id } = req.query;
    const s3Key = id;

    try {
        const s3Object = await s3.getObject({
            Bucket: bucketName,
            Key: s3Key
        });

        // S3 object Body is a ReadableStream
        const encryptedData = await streamToString(s3Object.Body);
        const decryptedBase64Data = decryptData(encryptedData, secretKey);
        const compressedData = Buffer.from(decryptedBase64Data, 'base64');
        const decompressedData = pako.ungzip(compressedData, { to: 'string' });
        const originalData = JSON.parse(decompressedData);

        res.json(originalData);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to decode data' });
    }
});

// Helper function to convert a readable stream to a string
async function streamToString(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
}

module.exports = router;
