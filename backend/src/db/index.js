import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${prcess.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Database Connected.")
    } catch (error) {
        console.log("MongoDB connection error !", error)
        process.exit(1)
    }
}