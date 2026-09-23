import { Router } from "express";
import {getCurrentUser, registerUser, loginUser, updatePassword, updateProfile, deleteAccount, logout, updateAvatar} from '../controllers/user.controller.js'
import verifyJwt from '../middlewares/verifyJwt.js'
import uploadLocal from "../middlewares/multer.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/get-user").get(verifyJwt, getCurrentUser)
router.route("/update-password").patch(verifyJwt, updatePassword)
router.route("/update-profile").patch(verifyJwt, updateProfile)
router.route("/delete-account").delete(verifyJwt, deleteAccount)
router.route("/logout").get(verifyJwt, logout)
router.route("/update-avatar").patch(verifyJwt, uploadLocal(avatar), updateAvatar)

export default router