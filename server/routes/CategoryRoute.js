import express from "express";
import {
    activeInactive,
    createCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,

} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.patch('/status/:categoryId', activeInactive);


export default router;
