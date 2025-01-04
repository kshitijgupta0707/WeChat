//creating an instance of mongoose
import mongoose from "mongoose";

//for fetching information from env file
import dotenv from 'dotenv'

const dbConnect = async() =>{
    try{
    //    dotenv.config({ path: '../.env' });
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("Database connected successfully")
    }
    catch(error){
        console.log("Db connection error");
        console.error(error);
        process.exit(1);
   } 
}
export {dbConnect};