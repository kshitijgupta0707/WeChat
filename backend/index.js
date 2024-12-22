const express = require("express");
const app = express();
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

// const { dbConnect } = require("./config/database");
// const { connectCloudinary } = require("./config/cloudinary");
// const dotenv = require("dotenv");

// const courseRoute = require("./routes/Course");
// const paymentRoute = require("./routes/Payments");
// const profileRoute = require("./routes/Profile");
// const userRoute = require("./routes/User");

// const cookieParser = require("cookie-parser");
// //so that backend can entertain front end request
// const cors = require("cors");
// const fileUpload = require("express-fileupload");

// dotenv.config();
// const port = process.env.PORT || 4000;

// connectCloudinary();
// dbConnect();

// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "/tmp",
//   })
// );
// app.use(
//   cors({
//     origin: "http://locathost:3000",
//     credentials: true,
//   })
// );

// app.use("/course", courseRoute);
// app.use("/payment", paymentRoute);
// app.use("/profile", profileRoute);
// app.use("/auth", userRoute);

// app.get("/", (req, res) => {
//   return res.status(200).json({
//     success: true,
//     message: "Your server is running",
//   });
// });
