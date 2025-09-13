import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async( userID ) => {
  console.log("UserId:", userID)
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    console.log("generate Access and Refresh Token:", accessToken,refreshToken)
    return {accessToken, refreshToken};


  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating Access and Refresh token");
  }
}

// REGISTER USER CONTROLLER
const registerUser = asyncHandler( async (req , res ) =>{
 const {fullname, email, username, password} = req.body;
 if(
  [fullname, email, username, password].some((fields)=>{
    fields?.trim() === "";
  })
 ){
  throw new ApiError(400,"All fields are required!!")
 }

// Check for the existing email and username 
const existedUser = await User.findOne({
  $or:[{ email } , { username }]
})
if(existedUser){
  throw new ApiError(404,"User is already Registered");
}

const avatarLocalPath = req.files?.avatar?.[0]?.path;
// const coverImageLocalPath = req.files?.coverImage?.[0]?.path; 
if(!avatarLocalPath){
  throw new ApiError(400, "Avatar file is required ")
}

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage[0].length>0){
  coverImageLocalPath = req.files.coverImage[0].path
}

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
  throw new ApiError(400,"Avatar field is required !")
}
const user = await User.create({
  fullname,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  username: username.toLowerCase(),
  email,
  password
})
const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"Something went wrong while registering the user ");
}
return res.status(201).json(
  new ApiResponse(200,createdUser,"User Registered Successfully")
)
})

// LOGIN CONTROLLER
const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    console.log(email);

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    
    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
   console.log("AT LOGIN:",accessToken,refreshToken);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "", "User logged Out"))
})

export {registerUser, loginUser , logoutUser}