import { User } from '../models/user.model.js'
import {ApiError} from '../utils/apiError.utils.js'
import {ApiResponse} from '../utils/apiResponse.utils.js'
import {asyncHandler} from '../utils/asyncHandler.utils.js'

const generateAccessAndRefreshTokens = async (userId) =>{
    try {
        const user = await User.findById(userId)
        if(!user) throw new ApiError(404, "Could not generate tokens as user was not found.");
    
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
    
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Could not generate token(s): ", error)
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    const {username, fullName, password, email} = req.body
    if(!fullName.trim() || !username.trim() || !password.trim() || !email.trim()) throw new ApiError(400, "Please send complete information.");

    const isUser = await User.findOne({username})
    if(isUser) throw new ApiError(400, "User with this username already exists.");

    const isUserWithEmail = await User.findOne({email})
    if(isUserWithEmail) throw new ApiError(400, "User with this email already exists.");

    const createUser = await User.create({
        fullName: fullName.trim(),
        username: username.trim(),
        password: password.trim(),
        email: email.trim()
    })
    if(!createUser) throw new ApiError(500, "User could not be created.");

    createUser.select(" -password -refresToken -")
    
    return res
    .status(201)
    .json(new ApiResponse(201, createUser, "User created."))
})

const loginUser = asyncHandler(async (req, res)=>{
    const {username, password} = req.body
    if(!username.trim() || !password.trim() ) throw new ApiError(400, "Please send complete information.");
    
    const user = await User.findOne({username})
    if(!user) throw new ApiError(404, "User with this username not found.");
    
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    user.select(" -password -refreshToken ")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, user, "User is logged in."))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User details fetched."))
})

const updatePassword = asyncHandler(async (req, res)=>{
    const {oldPassword, newPassword} = req.body
    const 
})

const updateProfile = asyncHandler(async (req, res)=>{
    
})

const deleteAccount = asyncHandler(async (req, res)=>{

})
const updateAvatar = asyncHandler(async(req, res)=>{

})

const getSavedLists = asyncHandler(async(req, res)=>{

})

const getReposts = asyncHandler(async(req, res)=>{

})

export {
    registerUser,
    loginUser,
    getCurrentUser,
    updatePassword,
    updateProfile,
    deleteAccount,
    updateAvatar,
    getSavedLists,
    getReposts
}