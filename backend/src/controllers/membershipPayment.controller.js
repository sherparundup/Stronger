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
import { userModel } from "../model/user.model.js";

export const InitializeEsewa = async (req, res) => {
  try {
    const { Membership, totalPrice, UserId } = req.body;
    console.log(Membership, totalPrice, UserId);
    console.log("jsjsj");

    // Validate item exists and the price matches
    const MembershipData = await MembershipModel.findOne({
      _id: Membership,
    });
    console.log("membershippp",MembershipData)

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
      duration:MembershipData.duration,
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
  // Extract query and route parameters
  const { data } = req.query;
  const { id } = req.params;
  console.log("a");

  try {
    // 1. Verify the payment using the eSewa gateway
    const paymentInfo = await verifyEsewaPayment(data);
    console.log("b");

    // 2. Retrieve the membership purchase record using the transaction UUID, and populate user and membership details
    const UserMembershipModelData = await UserMembershipModel.findById(
      paymentInfo.response.transaction_uuid
    )
      .populate("userId")
      .populate("membershipId");
    console.log("cat");
    console.log(id || "hi");
    console.log(paymentInfo.response.transaction_uuid);
    console.log(UserMembershipModelData, "membership data");

    // 3. If the purchase record isn't found, return an error response
    if (!UserMembershipModelData) {
      return res.status(500).json({
        success: false,
        message: "Purchase not found",
      });
    }

    console.log("dog");
    console.log(UserMembershipModelData.price);

    // 4. Check if a payment record already exists to prevent duplicate key error
    let paymentData = await Payment.findOne({
      transactionId: paymentInfo.decodedData.transaction_code,
    });

    if (paymentData) {
      console.log("Payment record already exists:", paymentData);
    } else {
      // Create a payment record in the database with payment details
      paymentData = await Payment.create({
        pidx: paymentInfo.decodedData.transaction_code,
        transactionId: paymentInfo.decodedData.transaction_code,
        MembershipId: paymentInfo.response.transaction_uuid,
        amount: UserMembershipModelData.price,
        dataFromVerificationReq: paymentInfo,
        apiQueryFromUser: req.query,
        paymentGateway: "esewa",
        status: "success",
      });
      console.log(
        "Payment record created:",
        paymentInfo.response.transaction_uuid
      );
    }

    // 5. Check if the user already has an active membership to extend its duration.
    // Populate the membershipId field so we can access its duration.
    const existingMembership = await UserMembershipModel.findOne({
      userId: UserMembershipModelData.userId._id,
      membershipId: UserMembershipModelData.membershipId._id,

      membershipStatus: "active",
    }).populate("membershipId");

    if (existingMembership) {
      console.log("Existing membership found:", existingMembership);

      const membership = await MembershipModel.findById(id);
      const prevDuration = existingMembership.duration;

      console.log(prevDuration, "Previous Duration");
      
      // Add the previous duration to the new duration (in months)
      const updatedDuration =
      existingMembership.membershipId.duration + prevDuration;
      
      console.log(updatedDuration, "updatedDuration");
      // Update the existing membership record with the new expiration date.
      const ok = await UserMembershipModel.findOneAndUpdate(
        { membershipId: existingMembership.membershipId._id }, 
        {
          $set: {
            duration: updatedDuration, // Add the durations together
            status: "completed",
            membershipStatus: "active",
          },
        }
      );
      console.log("okkk",ok);
      console.log("Membership extended successfully.");
    } else {
      // If no active membership exists, update the current membership record normally.
      await UserMembershipModel.findByIdAndUpdate(
        paymentInfo.response.transaction_uuid,
        { $set: { status: "completed", membershipStatus: "active" } }
      );
      console.log("New membership activated.");
    }

    console.log(id, "is id");
    const enablingIsMember = await userModel.findByIdAndUpdate(
      UserMembershipModelData.userId, 
      { isMember: true }, 
      { new: true } 
  );
  
    if(enablingIsMember){
      console.log("mebership status is active")
    }
    // 6. Prepare and send an email notification to the user about the activated membership.
    const membershipName = UserMembershipModelData.membershipId.MembershipName;
    const message = `Your membership of ${UserMembershipModelData.membershipId.MembershipName} for ${UserMembershipModelData.userId.name} has been activated for ${UserMembershipModelData.membershipId.duration} months at the price of ${UserMembershipModelData.membershipId.price}`;
    const subject = "Membership Payment";
    const userEmail = UserMembershipModelData.userId.email;
    await emailSender(userEmail, message, subject);

    // 7. Redirect the user to a frontend URL with payment success indication.
    return res.redirect(
      `http://localhost:5173?payment=success&pro=${membershipName}`
    );
  } catch (error) {
    // 8. Handle errors by sending an error response.
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
    })
      .populate("userId")
      .populate("membershipId"); // Ensure membershipId contains duration

    if (!userMemberships || userMemberships.length === 0) {
      return res.status(400).json(new ApiResponse(400, {}, "No active membership found"));
    }

    const emailPromises = [];
    const membershipReminders = [];

    const calculateDaysLeft = (membershipEndDate) => {
      return (membershipEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    };

    for (let userMembership of userMemberships) {
      // Extract values
      const membershipName = userMembership.membershipId?.MembershipName;
      const userEmail = userMembership.userId?.email;
      const userName = userMembership.userId?.name;

      if (!userMembership.purchasedDate || !userMembership.membershipId?.duration) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid membership data"));
      }

      // Calculate membership duration and end date
      const duration = userMembership.membershipId.duration * 30;
      const purchasedDate = new Date(userMembership.purchasedDate);
      if (isNaN(purchasedDate.getTime())) {
        return res.status(400).json(new ApiResponse(400, {}, "Invalid purchased date"));
      }

      // Calculate membership end date
      const membershipEndDate = new Date(purchasedDate);
      membershipEndDate.setDate(membershipEndDate.getDate() + duration);

      const daysLeft = calculateDaysLeft(membershipEndDate);
      const subject = `Reminder for gym membership`;

      // Send reminder emails based on remaining days
      if (daysLeft < 7 && daysLeft >= 0) {
        const message = `Hello ${userName}, this is just a reminder that your membership (${membershipName}) has only 7 days left.`;
        emailPromises.push(emailSender(userEmail, subject, message));
        membershipReminders.push({ membershipName, daysLeft, message });
      } else if (daysLeft < 0) {
        const message = `Hello ${userName}, this is just a reminder that your membership (${membershipName}) has ended.`;
        emailPromises.push(emailSender(userEmail, subject, message));
        await userModel.findByIdAndUpdate(
          userMembership.userId,
          { isMember: false },
          { new: true }
        );
        membershipReminders.push({ membershipName, daysLeft, message });
      } else {
        console.log(`Membership: ${membershipName} - Days left: ${Math.ceil(daysLeft)}`);
      }
    }

    // Wait for all emails to be sent
    await Promise.all(emailPromises);

    // Return the response
    return res.status(200).json(new ApiResponse(200, { userMemberships, membershipReminders }, "Memberships found"));
  } catch (error) {
    console.log(error);
    return res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
  }
};
