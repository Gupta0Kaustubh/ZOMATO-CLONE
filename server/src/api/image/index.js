import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';

import { ImageModel } from "../../database/allModels";

import { s3Upload } from '../../utils/s3';

const Router = express.Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Route :   /:_id
 * Desc  :   Get image based on their ids
 * params:   _id
 * Access:   Public
 * Method:   GET
 */
Router.get("/:_id", async (req, res) => {
    try {
        const image = await ImageModel.findById(req.params._id);
        return res.json({ image });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   }
});

/**
 * Route :   /
 * Desc  :   Upload given image to s3 and db
 * params:   none
 * Access:   Public
 * Method:   POST
 */
Router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;

        // Using AWS
        const bucketOptions = {
            Bucket: "Zomato-clone",
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        };
        const uploadImage = await s3Upload(bucketOptions);

        // Using MongoDb
        const dbUpload = await ImageModel.create({
            images: [
                {
                    Location: uploadImage.Location,
                },
            ],
        });

        return res.status(200).json({ dbUpload });
    } catch (error) {
        return res.status(500).json({ error: error.message });
   }
});

export default Router;