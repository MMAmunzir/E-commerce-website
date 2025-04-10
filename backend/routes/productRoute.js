import express from "express";

import {
  handleAddProduct,
  handleAllProducts,
  handleRemoveProduct,
  handleSingleProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import isAdmin from "../middlewares/admin.middleware.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  isAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),

  handleAddProduct
);
productRouter.get("/all", handleAllProducts);
productRouter.get("/:id", isAdmin, handleSingleProduct);
productRouter.delete("/:id", isAdmin, handleRemoveProduct);

export default productRouter;
