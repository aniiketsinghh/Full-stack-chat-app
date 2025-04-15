import express from "express"
import {app, server} from "./lib/socket.js"
app.use(express.json())
import cookieParser from "cookie-parser"
app.use(cookieParser());
import dotenv from "dotenv";
import path from "path"
dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true,
}))
const __dirname=path.resolve();
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
const PORT=process.env.PORT;
import {connectDB} from "./lib/db.js"
import cors from "cors"

//routes
app.use("/api/auth",authRoutes);
//this will help to take user's id pass emial
//{fullName,email,oassword}=res.body
//now we can fatch the data
app.use("/api/messages",messageRoutes);


if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist", "index.html"));
    })
}



server.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB()
})