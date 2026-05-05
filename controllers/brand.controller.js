import Brand from "../models/Brand.model.js";

export const createBrands = async (req, res) => {
  try {
    const { title } = req.body;

    const brand = new Brand({
      title,
      banner: req.file ? req.file.path : null,
    });

    await brand.save();

    res.json({
      message: "Brand created",
      brand,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating brand",
      error: error.message,
    });
  }
};

export const getBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });
    res.json({
      message: "Brands fetched",
      data: brands,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching brands",
      error: error.message,
    });
  }
};
export const updateBrands = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Brand.findByIdAndUpdate(
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
      message: "Error updating brands",
      error: error.message,
    });
  }
};
export const deleteBrands = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Brand.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    res.json({
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting brands",
      error: error.message,
    });
  }
};
