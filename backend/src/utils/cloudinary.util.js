import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("no local file path");
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "Stronger",
    });
    fs.unlinkSync(localFilePath);

    console.log("File uploaded successfully on cloudinary");
    console.log(response);
    return response;
  } catch (error) {
    console.log("erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    console.log(error.message);
    fs.unlinkSync(localFilePath);
    return null;
  }
};
export { uploadOnCloudinary };
