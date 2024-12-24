import cloudinary from "cloudinary"
export const uploadImageToCloudinary = async (file, folder, quality, height) => {
  console.log("file : ")
  console.log(file)
  // console.log(file.tempFiles)
  const options = {
    folder,
    resource_type: "auto"
  };
  console.log("Uploaded file: ", file);
  //it is must -- Detect auto the file type
  if (quality) options.quality = quality
  if (height) options.height = height
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
