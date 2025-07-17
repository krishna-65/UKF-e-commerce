import Category from "../models/Category.js";

// Create category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(409).json({ message: "Category already exists" });
        }

        const category = await Category.create({ name, description });
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get single category by ID
export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update category
export const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const updated = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category updated", updated });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

