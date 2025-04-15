import mongoose, { connect } from "mongoose"

export const connectDB =async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB DB connected on ${conn.connection.host}`);
        
    }catch(error){
        console.log("MONGODB connection error : ", error)
    }
}