import { Router } from "express";
import { updateUserData, fetchUserData, addUserData } from "../controller/api";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.put("/update-user-data", authMiddleware, updateUserData);
router.post("/fetch-user-data", authMiddleware, fetchUserData);
router.post("/add-user", authMiddleware, addUserData); // New route for adding users

export default router;
