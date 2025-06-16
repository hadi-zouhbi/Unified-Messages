import mongoose, { mongo } from "mongoose";
import dotenv from 'dotenv'

//Access dotenv
dotenv.config()

const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        console.log(`Error Connecting to DB --- ${error}`)
        // Kill the process if connection fails
        process.exit(1)
    }
}

export default connectDb