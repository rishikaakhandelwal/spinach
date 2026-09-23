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
    updateStory,
    getUserStories,
} from '../controllers/story.controller.js'

const router = Router()
router.route("/create").post(verifyJwt, createStory)
router.route("/upload-image").post(verifyJwt, uploadLocal(image), )

export default router