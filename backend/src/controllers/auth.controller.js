import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signup=async(req,res)=>{

    const { fullName,email,password}=req.body
    //if you wrote only this (res.body) it will not work 
    // for work it you have to go on main file and Write
    // app.use(express.json());
   try{
    if(!fullName || !email || !password){
        return res.status(400).json({message:"each field is required"})
    }
        if( password.length < 6 ){
            return res.status(400).json({message: "password must be atleast 6 characters"})
        }
        //find user email
        const user= await User.findOne({email})
        //if exits email then show them already exists msg
        if (user) return res.status(400).json({message:"email already exists"})

        //just this two line will hash your pass
        const salt = await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt)

        //calling user model that new user is creating!
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        //for store data into db you need token(JWT);
        if(newUser){
            //generate jwt token in utils.js
            generateToken(newUser._id,res)//res mtlb cookie watch in utis.js
            //save the user to the database
            await newUser.save();

            //send this data to user if success
            res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic,
            })

        }else{
            res.status(400).json({message:"Invalid user data"})
        }
   }catch(error){
        console.log("Error in signUp controller",error.message);
        res.status(500).json({message:"Internal server error"});
   }
};

export const login=async (req,res)=>{
    const {email, password}=req.body;
    try{
        const user =await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }

        const isPasswordCorrect= await bcrypt.compare(password,user.password);
            if(!isPasswordCorrect){
                return res.status(400).json({message:"Invalid credentials"})
            }

        generateToken(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    }catch(error)
        {
            console.log("Error in login controller", error.message);
            res.status(500).json({message: "internal server error"})
        }   
    }

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logout successfully"})
    }catch(error){
        res.status(500).json({message:"Internal server error"})
        console.log("Error in logout controller", error.message);
    }
}

export const updateProfile=async(req,res)=>{
    try{
    const {profilePic}=req.body;
        const userId=req.user._id; //req.user isliye likha cuz protectoute ka complete data isme store kr diya 

        if(!profilePic){
            return res.status(400).json({message: "profile pic is required"});
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic)
        const updateUser=await User.findByIdAndUpdate(userId,
            {profilePic: uploadResponse.secure_url},
        {new:true}
    )
    res.status(200).json(updateUser)
    }catch(error){
        console.log("ERROR IN UPDATEPROFILE",error.message)
        res.status(500).json({message:"error in updateProfile"});
    }
}

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("error in checkAuth controller",error.message)
        res.status(500).json({message: "internal server error"})
    }
}

