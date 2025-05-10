import Payment from "../model/payment.model.js";
import productModel from "../model/product.model.js";
import purchasedProduct from "../model/purchasedProduct.model.js";
import PurchasedProduct from "../model/purchasedProduct.model.js";
import mongoose from "mongoose";
import {
  getEsewaPaymentHash,
  verifyEsewaPayment,
} from "../utils/esewa.util.js";
import AddToCartModel from "../model/addToCart.model.js";
import CoachingPlanModel from "../model/CoachingPlanModel.js";
import purchasedCoachPlans from "../model/purchasedCoachPlans.model.js";
import purchasedCoachPlansModel from "../model/purchasedCoachPlans.model.js";
import PaymentpaymentCoachingPlanModel from "../model/payment.coachingPlan.model.js";
export const InitializeEsewa = async (req, res) => {
  try {
    const { ProductId, totalPrice, quantity, UserId } = req.body;
    // Validate item exists and the price matches
    const productData = await productModel.findOne({
      _id: ProductId,
    });

    if (!productData) {
      return res.status(400).send({
        success: false,
        message: "Item not found or price mismatch.",
      });
    }
    console.log("1");
    // Create a record for the purchase
    const purchasedProductData = await PurchasedProduct.create({
      product: ProductId,
      paymentMethod: "esewa",
      totalPrice: totalPrice,
      quantity,
      UserId,
    });
    console.log("2");

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchasedProductData._id,
    });
    console.log("3");

    // Respond with payment details
    return res.json({
      success: true,
      payment: paymentInitiate,
      purchasedProductData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      ok: "error in esewa initialization",
    });
  }
};

export const completePayment = async (req, res) => {
  const { data } = req.query;
  const { id } = req.params;
  console.log("a");

  try {
    const paymentInfo = await verifyEsewaPayment(data);
    console.log("b");

    // Find the purchased item using the transaction UUID
    const purchasedProductData = await purchasedProduct.findById(
      paymentInfo.response.transaction_uuid
    );
    console.log("c");

    if (!purchasedProductData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      productId: paymentInfo.response.transaction_uuid,
      amount: purchasedProductData.totalPrice,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });
    console.log(paymentInfo.response.transaction_uuid);

    // Update the purchased item status to 'completed'
    await purchasedProduct.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed" } }
    );
    console.log(id, "is id");
    // Delete the corresponding cart item upon successful payment
    const product = await productModel.findById(id);
    const productName = product.name;
    const decreaseStock = await productModel.findByIdAndUpdate(
      id,
      {
        $inc: { countInStock: -purchasedProductData.quantity },
      },
      { new: true }
    );

    console.log("Stock updated successfully:", decreaseStock);

    console.log(productName.name);
    const cartDeletionResult = await AddToCartModel.findOneAndDelete({
      ProductId: id,
    });
    console.log("Cart deletion result:", cartDeletionResult);
    // Respond with success message
    // return res.json({
    //   success: true,
    //   message: "Payment successful and cart item removed",
    //   paymentData,
    // });
    // In your completePayment endpoint after processing
    // Ensure the redirect URL includes the query parameter
    return res.redirect(
      `http://localhost:5173?payment=success&pro=${productName}`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
};

export const InitializeEsewaForCoachPlan = async (req, res) => {
  try {
    const { coachId, totalPrice, coachingPlanId, UserId } = req.body;
    // Validate item exists and the price matches
    const coachingPlan = await CoachingPlanModel.findOne({
      _id: coachingPlanId,
    });

    if (!coachingPlan) {
      return res.status(400).send({
        success: false,
        message: "Item not found or price mismatch.",
      });
    }
    console.log("1");
    // Create a record for the purchase
    const purchasedCoachingPlanData = await purchasedCoachPlans.create({
      coachPlan: coachingPlanId,

      paymentMethod: "esewa",
      totalPrice: totalPrice,
      coach: coachId,
      UserId,
    });
    console.log("2");

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: purchasedCoachingPlanData._id,
    });
    console.log("3");

    // Respond with payment details
    return res.json({
      success: true,
      payment: paymentInitiate,
      purchasedCoachingPlanData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      ok: "error in esewa initialization",
    });
  }
};
export const completePaymentForCoachPlan = async (req,res) => {
  const { data } = req.query;
  const { id } = req.params;
  console.log("a");

  try {
    const paymentInfo = await verifyEsewaPayment(data);
    console.log(paymentInfo)
    console.log("b");

    // Find the purchased item using the transaction UUID
    const CoachingPlanData = await purchasedCoachPlans.findById(
      paymentInfo.response.transaction_uuid
    );
    console.log("c");
    console.log(paymentInfo.response.transaction_uuid,'okkoko')
    
    
    
    if (!CoachingPlanData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }
    console.log(CoachingPlanData,'coaching plan data')

    // Create a new payment record in the database
    const paymentData = await PaymentpaymentCoachingPlanModel.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      coachPlan: paymentInfo.response.transaction_uuid,
      amount: CoachingPlanData.totalPrice,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });
    console.log(paymentInfo.response.transaction_uuid);

    // Update the purchased item status to 'completed'
    await purchasedCoachPlans.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed" } }
    );
    await PaymentpaymentCoachingPlanModel.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed" } }
    );
        
    console.log(id, "is id");
    // Delete the corresponding cart item upon successful payment
    const product = await CoachingPlanModel.findById(id);
    const productName = product.title;
    


    console.log(productName);
   ;
    // Respond with success message
    // return res.json({
    //   success: true,
    //   message: "Payment successful and cart item removed",
    //   paymentData,
    // });
    // In your completePayment endpoint after processing
    // Ensure the redirect URL includes the query parameter
    return res.redirect(
      `http://localhost:5173?payment=success&pro=${productName}`
    );
  } catch (error) {
    console.log(error )
    return res.status(500).json({
      success: false,
      error: error.message,
      ok: "error in esewa COMPLETEMENT",
    });
  }
};
