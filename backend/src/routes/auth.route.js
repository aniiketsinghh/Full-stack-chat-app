import express from "express"
import { login, logout, signup,  updateProfile, checkAuth} from "../controllers/auth.controller.js";
const router=express.Router();
import { protectRoute } from "../middleware/auth.middleware.js";

//controllers
router.post("/signup",signup)//ok

router.post("/login",login)

router.post("/logout",logout)

//portectRoute run krege updateprofile se phle
//its a middleware
//first protectRoute second updateProfile
router.put("/update-profile", protectRoute ,updateProfile)

//means after refresh the page it authenticate is every thing ok then good otherwise send back on login page
router.get("/check",protectRoute, checkAuth);
export default router;