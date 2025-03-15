import Payment from "../model/payment.membership.model.js";
import {
  MembershipModel,
  UserMembershipModel,
} from "../model/membership.model.js";
import {
  getEsewaPaymentHash,
  verifyEsewaPayment,
} from "../utils/esewa.util.js";
import { ApiResponse } from "../utils/util.api.response.js";
import emailSender from "../utils/nodemailor.util.js";

export const InitializeEsewa = async (req, res) => {
  try {
    const { Membership, totalPrice, UserId } = req.body;
    console.log(Membership, totalPrice, UserId);
    console.log("jsjsj");

    // Validate item exists and the price matches
    const MembershipData = await MembershipModel.findOne({
      _id: Membership,
    });

    if (!MembershipData) {
      return res.status(400).send({
        success: false,
        message: "Membership not found or price mismatch.",
      });
    }
    console.log("1");
    // Create a record for the purchase
    const UserMembershipModelData = await UserMembershipModel.create({
      membershipId: Membership,
      paymentMethod: "esewa",
      price: totalPrice,
      userId: UserId,
    });
    console.log("2");

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: UserMembershipModelData._id,
    });
    console.log("3");

    // Respond with payment details
    return res.json({
      success: true,
      payment: paymentInitiate,
      UserMembershipModelData,
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
    const UserMembershipModelData = await UserMembershipModel.findById(
      paymentInfo.response.transaction_uuid
    ).populate("userId")
    .populate("membershipId")
    console.log("cat");
    console.log(id || "hi");
    console.log(paymentInfo.response.transaction_uuid);

    if (!UserMembershipModelData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    console.log("dog");
    console.log(UserMembershipModelData.price);
    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      MembershipId: paymentInfo.response.transaction_uuid,
      amount: UserMembershipModelData.price,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });
    console.log(paymentInfo.response.transaction_uuid);

    // Update the purchased item status to 'completed'
    await UserMembershipModel.findByIdAndUpdate(
      paymentInfo.response.transaction_uuid,
      { $set: { status: "completed", membershipStatus: "active" } }
    );
    console.log(id, "is id");
    // Delete the corresponding cart item upon successful payment
    const membership = await MembershipModel.findById(id);

    const membershipName = membership.MembershipName;
    const message=`your membership of ${UserMembershipModelData?.membershipId?.MembershipName} for ${UserMembershipModelData?.userId?.name} has been activated for  ${UserMembershipModelData?.membershipId?.duration} months at the price of   ${UserMembershipModelData?.membershipId?.price} `
    const subject="membership payment";
    const userEmail=UserMembershipModelData?.userId?.email;
    await emailSender(userEmail,message,subject)

    // Respond with success message
    // return res.json({
    //   success: true,
    //   message: "Payment successful and cart item removed",
    //   paymentData,
    // });
    // In your completePayment endpoint after processing
    // Ensure the redirect URL includes the query parameter
    return res.redirect(
      `http://localhost:5173?payment=success&pro=${membershipName}`
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
};

export const userMembership = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json(new ApiResponse(400, {}, "No ID found"));
    }

    // Get all active, completed memberships for the user.
    const userMemberships = await UserMembershipModel.find({
      userId: id,
      status: "completed",
      membershipStatus: "active",
    }).populate("userId").populate("membershipId"); // Ensure membershipId contains duration

    if (!userMemberships || userMemberships.length === 0) {
      return res.status(400).json(new ApiResponse(400, {}, "No active membership found"));
    }

    // Assuming only one active membership per user, get the first one.
    const userMembership = userMemberships[0];
    console.log(userMembership);

    // Correctly extract the values from the membership document.
    const membershipName = userMembership.membershipId?.MembershipName;
    const userEmail = userMembership.userId?.email;
    const userName = userMembership.userId?.name;

    if (!userMembership.purchasedDate || !userMembership.membershipId?.duration) {
      return res.status(400).json(new ApiResponse(400, {}, "Invalid membership data"));
    }

    // Get duration in days (assuming duration is in months)
    const duration = userMembership.membershipId.duration * 30; 

    // Convert purchasedDate to a Date object.
    const purchasedDate = new Date(userMembership.purchasedDate);
    if (isNaN(purchasedDate.getTime())) {
      return res.status(400).json(new ApiResponse(400, {}, "Invalid purchased date"));
    }

    // Calculate membership end date.
    const membershipEndDate = new Date(purchasedDate);
    membershipEndDate.setDate(membershipEndDate.getDate() + duration);

    // Calculate remaining days.
    const daysLeft = (membershipEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    console.log("Membership End Date:", membershipEndDate);
    console.log("Days Left:", daysLeft);

    const subject = `Reminder for gym membership`;

    // Send reminder emails based on remaining days.
    if (daysLeft < 7 && daysLeft >= 0) {
      const message = `Hello ${userName}, this is just a reminder that your membership (${membershipName}) has only 7 days left.`;
      await emailSender(userEmail, subject, message);
    } else if (daysLeft < 0) {
      const message = `Hello ${userName}, this is just a reminder that your membership (${membershipName}) has ended.`;
      await emailSender(userEmail, subject, message);
    } else {
      console.log(`Days left: ${Math.ceil(daysLeft)}`);
    }

    return res.status(200).json(new ApiResponse(200, { userMemberships, daysLeft }, "Membership found"));
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};

