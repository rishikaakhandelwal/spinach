import { ApiError } from '../utils/apiError.utils.js'
import { ApiResponse } from '../utils/apiResponse.utils.js'
import { asyncHandler } from '../utils/asyncHandler.utils.js'
import { Story } from '../models/story.model.js'
import { User } from '../models/user.model.js'

const createStory = asyncHandler(async (req, res) => {
    const { content, state } = req.body;

    if (!req.user?._id) throw new ApiError(401, "Please log in to post a story.");
    if (!content) throw new ApiError(400, "Please provide some content.");

    const storyState = state === 'published' ? 'published' : 'draft';

    const story = await Story.create({
        owner: req.user._id,
        content,
        state: storyState,
        publishedAt: storyState === 'published' ? new Date() : null,
        lastUpdateAt: new Date()
    });

    if (!story) throw new ApiError(500, "Could not create the story.");

    return res
        .status(201)
        .json(new ApiResponse(201, story, "Story created."));
});

const uploadImage = asyncHandler(async(req, res)=>{

})

const updateStory = asyncHandler(async(req, res)=>{
//yaha bhi ye puchna h ki save as draft ya publish krna h, chahe story already published thi ya nhi
})

const publishStory = asyncHandler(async(req, res)=>{

})

const archiveStory = asyncHandler(async(req, res)=>{

})

const viewStory = asyncHandler(async(req, res)=>{

})

const getAllStories = asyncHandler(async(req, res)=>{

})


const getUserStories = asyncHandler(async(req, res)=>{

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