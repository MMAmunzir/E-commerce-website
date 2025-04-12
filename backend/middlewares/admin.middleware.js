import createError from "http-errors";
import jwt from "jsonwebtoken";
import { errorResponse } from "../controllers/response.controller.js";

const isAdmin = async (req, res, next) => {
  try {
    const { token } = req.headers;
    debugger;
    if (!token) {
      return errorResponse(res, {
        statusCode: 404,
        message: "Token not found",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (decode !== process.env.adminEmail + process.env.adminPassword) {
      throw createError(400, "Incorrect email or passwoed");
    }

    next();
  } catch (error) {
    throw error;
  }
};

export default isAdmin;
