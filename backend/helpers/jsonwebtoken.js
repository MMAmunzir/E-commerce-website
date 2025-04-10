import createError from "http-errors";
import jwt from "jsonwebtoken";
const createToken = (id) => {
  try {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return token;
  } catch (error) {
    throw createError(400, `Token creation failed ${error.message}`);
  }
};

const verifyToken = (payload) => {
  try {
    const decode = jwt.verify({ payload }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return decode;
  } catch (error) {
    throw createError(400, `Token creation failed ${error.message}`);
  }
};

export { createToken, verifyToken };
