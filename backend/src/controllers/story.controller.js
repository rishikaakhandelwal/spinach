import { ApiError } from '../utils/apiError.utils.js'
import { ApiResponse } from '../utils/apiResponse.utils.js'
import { asyncHandler } from '../utils/asyncHandler.utils.js'
import { Story } from '../models/story.model.js'
import { User } from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.utils.js'
import { isValidObjectId } from 'mongoose'
import mongoose from 'mongoose'

const createStory = asyncHandler(async (req, res) => {
    const { content } = req.body;

    if (!req.user?._id) throw new ApiError(401, "Please log in to post a story.");
    if (!content) throw new ApiError(400, "Please provide some content.");

    // const storyState = state === 'published' ? 'published' : 'draft';
    //isme archive ka option mat rakhna, archive publish krne k baad hi ho skta h

    const story = await Story.create({
        owner: req.user._id,
        content,
        state: "draft",
        // publishedAt: storyState === 'published' ? new Date() : null,
        publishedAt: null,
        lastUpdateAt: new Date()
    });

    if (!story) throw new ApiError(500, "Could not create the story.");

    return res
        .status(201)
        .json(new ApiResponse(201, story, "Story created."));
});

const uploadImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path
    if (!imageLocalPath) throw new ApiError(400, "Please upload an image.");

    const image = await uploadOnCloudinary(imageLocalPath)
    if (!image) throw new ApiError(500, "Could not upload the image.");

    return res
        .status(200)
        .json(new ApiResponse(200, image, "Image uploaded."))
})

const updateStory = asyncHandler(async (req, res) => {
    //yaha bhi ye puchna h ki save as draft ya publish krna h, chahe story already published thi ya nhi
    //yaha nahi puchenge because publish k lie alag route hai
    const userId = req.user._id

    const { content } = req.body
    if (!content) throw new ApiError(401, "Please provide some content.");

    const { storyId } = req.params
    if (!isValidObjectId(storyId)) throw new ApiError(400, "Invalid story Id.");
    const story = await Story.findById(storyId)
    if (!story) throw new ApiError(404, "Story not found.");
    if (!story.owner.equals(userId)) throw new ApiError(401, "You are not the owner of this story.")

    const updatedStory = await Story.findByIdAndUpdate(
        storyId,
        {
            content: content,
            lastEditedAt: new Date()
        },
        { new: true }
    )
    if (!updatedStory) throw new ApiError(500, "Could not update the story.");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedStory, "Story updated."))
})

const publishStory = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const { storyId } = req.params
    if (!isValidObjectId(storyId)) throw new ApiError("story id isnt valid.");
    const story = await Story.findById(storyId)
    if (!story) throw new ApiError(404, "Story not found.");
    if (!story.owner.equals(userId)) throw new ApiError(401, "You are not the owner of this story.")

    const publishedStory = await Story.findByIdAndUpdate(
        storyId,
        {
            state: "published",
            publishedAt: new Date()
        },
        { new: true }
    )
    if (!publishedStory) throw new ApiError(500, "Could not publish the story.");

    return res
        .status(200)
        .json(new ApiResponse(200, publishedStory, "Story published."))
})

const archiveStory = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const { storyId } = req.params
    if (!isValidObjectId(storyId)) throw new ApiError("story id isnt valid.");
    const story = await Story.findById(storyId)
    if (!story) throw new ApiError(404, "Story not found.");
    if (!story.owner.equals(userId)) throw new ApiError(401, "You are not the owner of this story.")

    const archivedStory = await Story.findByIdAndUpdate(
        storyId,
        {
            state: "archived",
            publishedAt: null
        },
        { new: true }
    )
    if (!archivedStory) throw new ApiError(500, "Could not archive the story.");

    return res
        .status(200)
        .json(new ApiResponse(200, archivedStory, "Story archived."))
})

const viewStory = asyncHandler(async (req, res) => {
    //archive ya draft hone par user hi owner hona jaroori hai
    //owner me user dikhna chahiye pura
    //kya ye kaam baki publish, archive, update wale controllers me bhi krna chahiye?

    const userId = req.user._id
    const { storyId } = req.params
    if (!isValidObjectId(storyId)) throw new ApiError(400, "Invalid story id.");

    // const story = await Story.findById(storyId)
    // if (!story) throw new ApiError(404, "The story does not exist.");
    // if (!story.state != "published") {
    //     if (!story.owner.equals(userId)) throw new ApiError(401, "You do not own this story.")
    // }

    const [story] = await Story.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(storyId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { fullName: 1, username: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$owner" }
    ])
    if (!story) throw new ApiError(404, "The story does not exist.");
    if (story.state !== "published" && !story.owner._id.equals(userId)) {
        throw new ApiError(403, "You do not own this story.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, story, "Story fetched."))

})

const getAllStories = asyncHandler(async (req, res) => {

})


const getUserStories = asyncHandler(async (req, res) => {

})

export {
    createStory,
    updateStory,
    uploadImage,
    publishStory,
    archiveStory,
    viewStory,
    getAllStories,
    getUserStories,
}