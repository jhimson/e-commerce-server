require('dotenv').config()
const express = require('express')
const multer = require('multer')
const Router = express.Router();
const AWS = require('aws-sdk')
const { uuid } = require('uuidv4');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_AccessKeyId,
    secretAccessKey:  process.env.AWS_SecretAccessKey
})

const storage = multer.memoryStorage({
    destination: function(req, file, callback){
        callback(null, '')
    }
})

const upload = multer({
    storage
}).single('image')


Router.post('/', upload, (req, res) => {
    let myFile = req.file.originalname.split(".");
    const fileType = myFile[1];
   
    const params = {
        Bucket: process.env.AWS_BucketName,
        Key: `${uuid()}.${fileType}`,
        Body: req.file.buffer 

    }
    s3.upload(params, (error, data) => {
        if(error){
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

module.exports = Router;