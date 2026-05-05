import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./config/db.js";
import subCategoryRoutes from "./routes/subCategory.route.js";
import brandRoutes from "./routes/brand.route.js";
import categoryRoutes from "./routes/category.route.js";
import productRoutes from "./routes/product.route.js";
import SubsPlan from "./routes/subsPlan.route.js";
import ordersRoutes from "./routes/orders.route.js";
import couponRoutes from "./routes/coupon.route.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5001", 
      "http://localhost:5173",
      "https://bangar-admin-frontend.vercel.app/",
      "https://bangar-frontend.vercel.app/",
    ],
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/brands", brandRoutes );
app.use("/api/category", categoryRoutes );
app.use("/api/products", productRoutes );
app.use("/uploads", express.static("uploads"));
app.use("/api/plans", SubsPlan );
app.use("/api/orders", ordersRoutes );
app.use("/api/coupons", couponRoutes );

app.get("/", (req, res) => {
  res.send("API running");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
