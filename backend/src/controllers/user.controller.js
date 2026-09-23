import { User } from '../models/user.model.js'
import { ApiError } from '../utils/apiError.utils.js'
import { ApiResponse } from '../utils/apiResponse.utils.js'
import { asyncHandler } from '../utils/asyncHandler.utils.js'

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (!user) throw new ApiError(404, "Could not generate tokens as user was not found.");

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Could not generate token(s): ", error)
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, password, email } = req.body
    if (!fullName?.trim() || !username?.trim() || !password?.trim() || !email?.trim()) throw new ApiError(400, "Please send complete information.");

    const isUser = await User.findOne({ username })
    if (isUser) throw new ApiError(400, "User with this username already exists.");

    const isUserWithEmail = await User.findOne({ email })
    if (isUserWithEmail) throw new ApiError(400, "User with this email already exists.");

    const createUser = await User.create({
        fullName: fullName.trim(),
        username: username.trim(),
        password: password,
        email: email.trim()
    })
    if (!createUser) throw new ApiError(500, "User could not be created.");

    createUser.password = undefined;
    createUser.refreshToken = undefined;
    return res
        .status(201)
        .json(new ApiResponse(201, createUser, "User created."))
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    if (!username?.trim() || !password?.trim()) throw new ApiError(400, "Please send complete information.");

    const user = await User.findOne({ username })
    if (!user) throw new ApiError(404, "User with this username not found.");
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(401, "Password incorrect.")

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    user.password = undefined
    user.refreshToken = undefined
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

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) throw new ApiError(400, "Please send both passwords.");

    const userId = req.user._id
    if (!userId) throw new ApiError(401, "You are unauthorised.");

    const userProfile = await User.findById(userId)
    const isPasswordValid = await userProfile.isPasswordCorrect(oldPassword)
    if (!isPasswordValid) throw new ApiError(400, "Wrong old password.");

    userProfile.password = newPassword
    await userProfile.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password Updated."))
})

const updateProfile = asyncHandler(async (req, res) => {
    const { username, fullName, email, about } = req.body
    if (!username?.trim() && !fullName?.trim() && !email?.trim() && !about) throw new ApiError(400, "Please send something to update.");

    const userId = req.user._id
    if (!userId) throw new ApiError(401, "Unauthorised request.");

    const updatedInfo = {}
    if (username) updatedInfo.username = username
    if (fullName) updatedInfo.fullName = fullName
    if (email) updatedInfo.email = email
    if (about) updatedInfo.about = about

    const updatedProfile = await User.findByIdAndUpdate(
        userId,
        updatedInfo,
        { new: true }
    ).select("-password -refreshToken")
    if (!updatedProfile) throw new ApiError(500, "Could not update the profile.");

    return res
        .status(200)
        .json(new ApiResponse(200, updateProfile, "Profile updated."))
})

const deleteAccount = asyncHandler(async (req, res) => {
    const { password } = req.body
    if (!password) throw new ApiError(401, "Please send the password for verification.");

    const userId = req.user._id
    if (!userId) throw new ApiError(401, "Invalid user.");

    const userProfile = await User.findById(userId)
    if (!userProfile) throw new ApiError(404, "User with this userId was not found.");

    const isPasswordValid = await userProfile.isPasswordCorrect(password)
    if (!isPasswordValid) throw new ApiError(400, "Password incorrect.");

    const deleted = await userProfile.deleteOne();
    if (deleted.deletedCount !== 1) throw new ApiError(500, "Could not delete the account.")

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "Account deleted."))
})

const updateAvatar = asyncHandler(async (req, res) => {

})

const getSavedLists = asyncHandler(async (req, res) => {

})

const getReposts = asyncHandler(async (req, res) => {

})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out successfully"))
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
    getReposts,
    logout
}