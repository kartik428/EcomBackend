import Product from "../models/Product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      price,
      discountPrice,
      color,
      fabric,
      sizes,
      description,
      categoryId,
      subCategoryId,
      brandId,
    } = req.body;

    // ================= VALIDATION =================
    if (!title || !price || !categoryId || !subCategoryId || !brandId) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    // ================= PARSE SIZES =================
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = JSON.parse(sizes); // because coming from FormData
    }

    // ================= IMAGE =================
    const image = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // ================= CREATE =================
    const product = new Product({
      title,
      slug,
      price,
      discountPrice,
      color,
      fabric,
      sizes: parsedSizes,
      description,
      categoryId,
      subCategoryId,
      brandId,
      image,
    });

    await product.save();

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { category, subcategory } = req.query; 

    const products = await Product.find()
      .populate("categoryId", "title")
      .populate("subCategoryId", "title")
      .populate("brandId", "title");

    //  filter AFTER populate
    const filteredProducts = products.filter((p) => {
      const matchCategory = category
        ? p.categoryId?.title?.toLowerCase() === category.toLowerCase()
        : true;

      const matchSubCategory = subcategory
        ? p.subCategoryId?.title?.toLowerCase() === subcategory.toLowerCase()
        : true;

      return matchCategory && matchSubCategory;
    });

    res.json({
      data: filteredProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("categoryId", "title")
      .populate("subCategoryId", "title")
      .populate("brandId", "title");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting products",
      error: error.message,
    });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Product.findById(id);

    item.status = item.status === "active" ? "inactive" : "active";
    await item.save();

    res.json({
      message: "Status updated",
      status: item.status,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error Updating Status",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      slug,
      price,
      discountPrice,
      color,
      fabric,
      sizes,
      description,
      categoryId,
      subCategoryId,
      brandId,
    } = req.body;

    // ================= PARSE SIZES =================
    let parsedSizes = [];
    if (sizes) {
      parsedSizes = JSON.parse(sizes);
    }

    // ================= FIND PRODUCT =================
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // ================= IMAGE =================
    const image = req.file ? req.file.path.replace(/\\/g, "/") : product.image; // keep old image

    // ================= UPDATE =================
    product.title = title;
    product.slug = slug;
    product.price = price;
    product.discountPrice = discountPrice;
    product.color = color;
    product.fabric = fabric;
    product.sizes = parsedSizes;
    product.description = description;
    product.categoryId = categoryId;
    product.subCategoryId = subCategoryId;
    product.brandId = brandId;
    product.image = image;

    await product.save();

    res.json({
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};
