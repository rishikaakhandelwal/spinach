import { Router } from "express";
import {getCurrentUser, registerUser, loginUser} from '../controllers/user.controller.js'
import verifyJwt from '../middlewares/verifyJwt.js'

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/get-user").get(verifyJwt, getCurrentUser)

export default router