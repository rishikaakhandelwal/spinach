import { Router } from "express";
import verifyJwt from '../middlewares/verifyJwt.js'
import uploadLocal from "../middlewares/multer.middleware.js";
import {
    createStory,
    updateStory,
    uploadImage,
    publishStory,
    archiveStory,
    viewStory,
    getAllStories,
    getUserStories,
} from '../controllers/story.controller.js'

const router = Router()
router.route("/create").post(verifyJwt, createStory)
router.route("/upload-image").post(verifyJwt, uploadLocal.single("image"), uploadImage)
router.route("/update-story/:storyId").patch(verifyJwt, updateStory)
router.route("/publish-story/:storyId").patch(verifyJwt, publishStory)
router.route("/archive-story/:storyId").patch(verifyJwt, archiveStory)

export default router