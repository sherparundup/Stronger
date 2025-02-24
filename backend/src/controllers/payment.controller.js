import Payment from "../model/payment.model.js";
import productModel from "../model/product.model.js";
import purchasedProduct from "../model/purchasedProduct.model.js";
import PurchasedProduct from "../model/purchasedProduct.model.js"
import { getEsewaPaymentHash, verifyEsewaPayment } from "../utils/esewa.util.js";
export const InitializeEsewa=async(req,res)=>{
    try {
        const { ProductId, totalPrice ,quantity} = req.body;
        // Validate item exists and the price matches
        const productData = await productModel.findOne({
          _id: ProductId,
          price: Number(totalPrice),
        });
    
        if (!productData) {
          return res.status(400).send({
            success: false,
            message: "Item not found or price mismatch.",
          });
        }
          console.log("1")
          // Create a record for the purchase
          const purchasedProductData = await PurchasedProduct.create({
            product: ProductId,
            paymentMethod: "esewa",
            totalPrice: totalPrice,
            quantity
          });
          console.log("2")
          
          // Initiate payment with eSewa
          const paymentInitiate = await getEsewaPaymentHash({
            amount: totalPrice,
            transaction_uuid: purchasedProductData._id,
          });
          console.log("3")
    
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
          ok:"error in esewa initialization"       });
      }

}


export const completePayment=async (req, res) => {
    const { data } = req.query; 
  
    try {
      const paymentInfo = await verifyEsewaPayment(data);
  
      // Find the purchased item using the transaction UUID
      const purchasedProductData = await purchasedProduct.findById(
        paymentInfo.response.transaction_uuid
      );
  
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
  
      // Update the purchased item status to 'completed'
      await purchasedProduct.findByIdAndUpdate(
        paymentInfo.response.transaction_uuid,
        { $set: { status: "completed" } }
      );
  
      // Respond with success message
      return res.json({
        success: true,
        message: "Payment successful",
        paymentData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "An error occurred during payment verification",
        error: error.message,
      });
    }
  };