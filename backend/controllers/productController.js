import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import createError from "http-errors";
import { successResponse } from "./response.controller.js";
import mongoose from "mongoose";
//add product
const handleAddProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    if (!sizes || typeof sizes !== "string") {
      throw createError(400, "Invalid sizes format");
    }

    let parsedSizes;
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (error) {
      throw createError(400, "Sizes must be a valid JSON string");
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      throw createError(400, "No files were uploaded");
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (img) => img && img.path
    );

    if (images.length === 0) {
      throw createError(400, "No valid image files provided");
    }

    const forever = `product/${category}`;

    let imagesURL = await Promise.all(
      images.map(async (img) => {
        let result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
          folder: forever,
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: parsedSizes, // Use the validated and parsed sizes
      bestseller: bestseller === "true" ? true : false,
      image: imagesURL,
      date: Date.now(),
    };

    const product = await productModel.create(productData);

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "Product was added successfully",
    });
  } catch (error) {
    next(error);
  }
};

//get all product
const handleAllProducts = async (req, res, next) => {
  try {
    const products = await productModel.find();
    // console.log(products);

    if (!products || products.length === 0) {
      throw createError(404, "No products found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "All product was returend successfully",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};
//remove product
const handleRemoveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid mongoose id");
    }
    const product = await productModel.findOneAndDelete({ _id: id });

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was removed successfully",
    });
  } catch (error) {
    next(error);
  }
};
//get single product
const handleSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createError(400, "Invalid mongoose id");
    }

    const product = await productModel.findById(id);

    if (!product) {
      throw createError(404, "Product not found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "product was returned successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  handleAddProduct,
  handleAllProducts,
  handleRemoveProduct,
  handleSingleProduct,
};
