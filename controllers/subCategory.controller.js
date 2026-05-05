import SubCategory from "../models/SubCategory.model.js";

export const createSubCategory = async (req, res) => {
  try {
    const { title, categoryId, metaTitle, metaKeywords, metaDescription } =
      req.body;

    //  validation FIRST
    if (!title || !categoryId) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }

    //  slug
    const baseSlug = title.toLowerCase().replace(/ /g, "-");

    let slug = baseSlug;
    let count = 1;

    while (await SubCategory.findOne({ slug })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    //  safe keywords parsing
    let parsedKeywords = [];
    if (metaKeywords) {
      try {
        parsedKeywords = JSON.parse(metaKeywords);
      } catch (err) {
        parsedKeywords = metaKeywords.split(",");
      }
    }

    const subCategory = new SubCategory({
      title,
      slug,
      categoryId,
      metaTitle,
      metaKeywords: parsedKeywords,
      metaDescription,
      image: req.file ? req.file.path : null,
    });

    await subCategory.save();

    res.status(201).json({
      message: "SubCategory created",
      subCategory,
    });
  } catch (err) {
    console.log("ERROR:", err);

    res.status(500).json({
      message: "Error creating subcategory",
      error: err.message,
    });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = {
      title: { $regex: search, $options: "i" },
    };

    const data = await SubCategory.find(query)
      //   .populate("categoryId", "name")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ sortOrder: 1 });

    const total = await SubCategory.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching subcategories",
      error: err.message,
    });
  }
};

export const deleteSubCategories = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "SubCategory not found",
      });
    }

    res.json({
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting subcategory",
      error: error.message,
    });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SubCategory.findById(id);

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

export const toggleInTrend = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await SubCategory.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Not found" });
    }

    item.inTrend = !item.inTrend;

    await item.save();

    res.json({
      message: "Trend updated",
      inTrend: item.inTrend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating trend",
      error: error.message,
    });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await SubCategory.findByIdAndUpdate(
      id,
      {
        ...req.body,
        ...(req.file && { image: req.file.path }),
      },
      { new: true },
    );

    res.json({
      message: "Updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating",
      error: error.message,
    });
  }
};
