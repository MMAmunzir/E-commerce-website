import createError from "http-errors";
import jwt from "jsonwebtoken";
import { errorResponse } from "../controllers/response.controller.js";

// filepath: c:\Users\munzi\Desktop\projects\CV_PROJECTS\E commerce\backend\middlewares\auth.js
const isAuthorized = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, {
      statusCode: 404,
      message: "Token not found",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      throw createError(400, "Invalid token");
    }

    req.body = req.body || {}; // Ensure req.body is initialized
    req.body.userId = decode.id;
    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthorized };
