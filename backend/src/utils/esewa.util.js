import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
async function getEsewaPaymentHash({ amount, transaction_uuid }) {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE}`;

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");
    console.log("one");

    return {
      signature: hash,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
}
async function verifyEsewaPayment(encodedData) {
  try {
    // Decode base64 code received from eSewa
    let decodedData = atob(encodedData);
    decodedData = await JSON.parse(decodedData);

    // Ensure total_amount is formatted correctly (no commas)
    decodedData.total_amount = decodedData.total_amount.replace(/,/g, '');

    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    // Construct the data string to hash
    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;
    console.log("Data to hash:", data);

    const secretKey = process.env.ESEWA_SECRET_KEY;
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    console.log("Calculated Hash:", hash);
    console.log("Received Signature:", decodedData.signature);

    // Compare hashes
    if (hash !== decodedData.signature) {
      throw { message: "Invalid Info", decodedData };
    }

    let reqOptions = {
      url: `${process.env.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      method: "GET",
      headers: headersList,
    };

    let response = await axios.request(reqOptions);
    if (
      response.data.status !== "COMPLETE" ||
      response.data.transaction_uuid !== decodedData.transaction_uuid ||
      Number(response.data.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Invalid Info", decodedData };
    }

    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
}

export { getEsewaPaymentHash, verifyEsewaPayment };
