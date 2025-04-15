//generating token
import jwt from "jsonwebtoken"
//we diff between user through jwt
export const generateToken=(userId, res)=>{
    const token=jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {
            //on;y for 7 days means it is fro 7 days after 7 days user have to logn once again 
        expiresIn:"7d"
         } 
)
//sending jwt as a cookie 
    res.cookie("jwt",token,{
        //7d into mili seconds
        maxAge: 7 * 24 * 60 * 60 * 1000,//ms
        //for secure
        httpOnly: true, //prevent xss attacks (cross-site scripting attacks)
        sameSite: "strict",//CSRF attacks cross-site req forgery attacks
        secure:process.env.NODE_ENV !== "development"
    })
    return token;
}