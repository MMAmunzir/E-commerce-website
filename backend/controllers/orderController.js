import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { successResponse } from "./response.controller.js";
import Stripe from "stripe";

const currency = "lkr";
const delivery_charge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;

    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });

    return successResponse(res, {
      statusCode: 200,
      message: "order place success",
    });
  } catch (error) {
    next(error);
  }
};

const placeOrderStripe = async (req, res, next) => {
  try {
    const { userId, address, amount, items } = req.body;
    const { origin } = req.headers;
    const orderData = {
      items,
      address,
      amount,
      userId,
      paymentMethod: "stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = await orderModel.create(orderData);
    await newOrder.save();
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: delivery_charge * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    next(error);
  }
};

// const placeOrderRazorpay = async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// };

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.find({});

    return successResponse(res, {
      statusCode: 200,
      message: "All orders return successfully",
      payload: orders,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const userOrders = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });

    return successResponse(res, {
      statusCode: 200,
      message: "All orders return successfully",
      payload: orders,
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    return successResponse(res, {
      statusCode: 200,
      message: "status updated",
    });
  } catch (error) {
    next(error);
  }
};

const verifyStripePayment = async (req, res, next) => {
  try {
    const { orderId, success, userId } = req.body;

    if (success === "true") {
      await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true },
        { new: true }
      );
      await userModel.findByIdAndUpdate(
        userId,
        { cartData: {} },
        { new: true }
      );

      return successResponse(res, {
        statusCode: 200,
        message: "successfully verified",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
    }
  } catch (error) {
    next(error);
  }
};

export {
  placeOrder,
  placeOrderStripe,
  //   placeOrderRazorpay,
  getAllOrders,
  userOrders,
  updateOrderStatus,
  verifyStripePayment,
};
