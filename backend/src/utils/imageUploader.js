//to check if file type is supported or note
const cloudinary = require('cloudinary')
function isFileTypeSupported(type, supportedTypes) {
  return supportedTypes.includes(type);
}

//function which uploades the file to cloudinary
//folder - that you have created on cloudinary
exports.uploadImageToCloudinary = async (file, folder, quality, height) => {
  const options = { folder };
  console.log("temp: ");
  console.log(file.tempFilePath);

  //it is must -- Detect auto the file type
  options.resource_type = "auto";
  if (quality) {
    options.quality = quality;
  }
  if (height) {
    options.height = height;
  }
  //syntax -- 1st paranmter mei file.tempFilePath and second contains
  //option objcect -- folder ,  various options such as quality , height , width
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};
// exports.uploadImageToCloudinary = async (req, res) => {
//   try {
//     //data fetch
//     const { name, tags, email } = req.body;
//     console.log(name, tags, email);

//     const file = req.files.imageFile;
//     console.log(file);

//     //validation
//     const supportedTypes = ["jpg", "jpeg", "png"];
//     const type = file.name.split(".")[1].toLowerCase();
//     console.log("file type", type);
//     if (!isFileTypeSupported(type, supportedTypes)) {
//       return res.status(400).json({
//         success: false,
//         message: "File format not supported",
//       });
//     }

//     //file format is supported

//     const response = await uploadFileToCloudinary(file, "uploadFiles");
//     console.log("Respose", response);

//     //store entry in db
//     const fileData = await File.create({
//       name,
//       email,
//       tags,
//       imageUrl: response.secure_url,
//     });

//     console.log("image uploaded");

//     res.status(200).json({
//       status: true,
//       message: "image uploaded successfully",
//       url: response.secure_url,
//     });
//   } catch (e) {
//     console.error(e);
//     res.status(400).json({
//       status: false,
//       message: "dfdfdfdfd",
//       errror: e.message,
//     });
//   }
// };