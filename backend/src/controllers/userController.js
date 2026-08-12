import bcrypt from "bcryptjs";
import UserModel from "../models/Users.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

//sign up new user

export const signup = async(req,res)=>{
    const {fullName,bio,email,password} = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({
                success:false,
                message:"Missing Details"
                

            })
        }
        const user = await UserModel.findOne({email});

        if(user){
            return res.json({
                success:false,
                message:"User Already Exist"
                 

            })
        }
        // here we create the salt so that password become more strong
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt); 
        // here we creating the new user 
        const newUser = await UserModel.create({
            fullName,
            email,
            password:hashedPassword,
            bio
        });
        // now we create the token 
        const token = generateToken(newUser._id);
        res.json({
            success:true,
            userData:newUser,
            token:token,
            message:"Account Created Successfully"
        })



    }
    catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })

    }

};



//controller to login the user

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const userData = await UserModel.findOne({email});


        const isPasswordCorrect = await bcrypt.compare(password,userData.password);

        if(!isPasswordCorrect){
            return res.json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        //if password is true the generate token
        const token = generateToken(userData._id);
        res.json({
            success:true,
            userData,
            token:token,
            message:"Login Successfully",

        })

    }
    catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })

    }

};



//controller to update user profile

export const updateProfile = async(req,res)=>{
    try{
        const{fullName,bio,profilePic} = req.body
        const userId = req.user._id;
        let updatedUser;

        if(!profilePic){
            //find by an id and then update it
            updatedUser = await UserModel.findByIdAndUpdate(userId,{fullName,bio},{new:true});
        }
        else{
            const upload = await cloudinary.uploader.unsigned_upload(profilePic, "chat-profile-pic", {
                resource_type: "auto"
            });
            updatedUser = await UserModel.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});



        }
        res.json({
            success:true,
            user:updatedUser,
            message:"Profile update Successfully"
        })

    }
    catch(error){
        console.log(error.message);
        res.json({
            success:false,
            message:error.message
        })

    }


}