// User ka routes yehan rakhenge 
import { Router } from "express";
import { registerUser } from "../Controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

// Middleware use kiya hai yehan pe =====Upload===
router.route("/register").post(
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
);


export default router;