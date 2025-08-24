// Yehan hum claudinary related kam kar lenge 

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
    cloud_name: process.env.CALOUDINARY_CLOUD_NAME,
    api_key: process.env.CALOUDINARY_API_KEY,
    api_secret: process.env.CALOUDINARY_API_SECRET
});


// Method bana rehe hai jo local se file utha ke upload kar dega easily 
// Pehle image ye video ko temprory server pe store karenge (fir store krenge )

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) {
            throw new Error("❌ File Path is not provided !");
        }

        // Upload the file on cloudinary 
        // ->Ye response hi details lake dega cloudinary se 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        })


        //File uploaded Successfully 
        // ->Pura response bhej rhe hai jo chiye hoga wo nikal lega URL 
        console.log("✅ File uploaded Successfully !", response.url);
        return response;

    } catch (error) {
        fs.unlink(localFilePath);
        //rmeove the locally saved temporary file as the upload operation gto failed 
        // ->Agr nahi karenge to ye file beker me para rehega (delete ko unlink karna bolte hai )

        return null;

    }
}