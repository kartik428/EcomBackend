import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
  try {
    const { title, slug, metaTitle, metaKeywords, metaDescription } = req.body;

    //  validation
    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    //  slug auto (optional but useful)
    const finalSlug = slug ? slug : title.toLowerCase().replace(/ /g, "-");

    //  create category
    const category = new Category({
      title,
      slug: finalSlug,
      metaTitle,
      metaKeywords,
      metaDescription,
      image: req.file ? req.file.path : null,
    });

    await category.save();

    //  success response
    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

export const deleteCategories = async(req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

        if (!deleted) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Category.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    // toggle
    item.status = item.status === "active" ? "inactive" : "active";

    await item.save();

    res.json({
      message: "Status updated",
      status: item.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status",
      error: error.message,
    });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // find existing
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // update fields safely
    category.title = req.body.title || category.title;
    category.slug = req.body.slug || category.slug;
    category.metaTitle = req.body.metaTitle || category.metaTitle;
    category.metaDescription =
      req.body.metaDescription || category.metaDescription;

    // keywords fix
    if (req.body.metaKeywords) {
      try {
        category.metaKeywords = JSON.parse(req.body.metaKeywords);
      } catch {
        category.metaKeywords = req.body.metaKeywords
          .split(",")
          .map((k) => k.trim());
      }
    }

    // image update
    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    res.json({
      message: "Category updated successfully",
      data: category,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating category",
      error: error.message,
    });
  }
};