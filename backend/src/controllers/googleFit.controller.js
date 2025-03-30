import { google } from "googleapis";
import { ApiResponse } from "../utils/util.api.response.js";

const oAuth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI
);

export const googleFit = async (req, res) => {
	try {
		const { code } = req.query;  // ✅ Use req.query to get the authorization code

		if (!code) {
			return res.status(400).json(new ApiResponse(400, "Authorization code is required", "Bad Request"));
		}

		const { tokens } = await oAuth2Client.getToken(code);
		const frontendUrl=`${process.env.REACT_APP_FRONTEND_URL}/dashboard?token=${tokens.access_token}`
		
		
		// res.status(200).json(new ApiResponse(200, tokens.access_token, "Token retrieved successfully"));
		return res.redirect(frontendUrl)
	} catch (error) {
		console.log(error)
		res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
	}
};

export const url = async (req, res) => {
	try {
		const authUrl = oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: process.env.GOOGLE_SCOPE.split(","), // Ensure scope is an array
		});	
		res.json(new ApiResponse(200, authUrl, "Google OAuth URL generated successfully"));
	} catch (error) {
		res.status(500).json(new ApiResponse(500, error.message, "Something went wrong"));
	}
};


export const googleSteps = async (req, res, next) => {
	try {
	  // Set access token for oAuth2Client
	  oAuth2Client.setCredentials({
		access_token:req.token
	  });
	  const fitnessStore = google.fitness({ version: "v1", auth: oAuth2Client });
	  console.log(fitnessStore);
  
	  const dataTypeName = "com.google.step_count.delta";
	  const dataSourceId =
		"derived:com.google.step_count.delta:com.google.android.gms:estimated_steps";
	  console.log("2");
	  const data = {
		aggregateBy: [{ dataTypeName, dataSourceId }],
		bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
		// Request 20 days of data
		startTimeMillis: Date.now() - 20 * 24 * 60 * 60 * 1000,
		endTimeMillis: Date.now()
	  };
	  console.log("3");
	  const result = await fitnessStore.users.dataset.aggregate({
		userId: "me",
		requestBody: data,
		fields: "bucket(dataset(point(value(intVal))))"
	  });
	  console.log("4");
  
	  // Calculate a timestamp for each bucket if not provided
	  const requestStartTime = data.startTimeMillis;
	  const bucketDuration = 24 * 60 * 60 * 1000;
	  if (result.data.bucket) {
		result.data.bucket = result.data.bucket.map((bucket, index) => {
		  // Try bucket.startTimeMillis first, then endTimeMillis,
		  // or calculate it from the request's start time plus the bucket index.
		  const timestamp =
			bucket.startTimeMillis ||
			bucket.endTimeMillis ||
			(requestStartTime + index * bucketDuration);
		  const date = timestamp
			? new Date(parseInt(timestamp)).toLocaleDateString("en-US", {
				month: "long",
				day: "numeric"
			  })
			: "Unknown date";
		  return { ...bucket, date };
		});
	  }
	  console.log(JSON.stringify(result.data, null, 2));
  
	  return res.json(result);
	} catch (error) {
	  return res
		.status(500)
		.json(new ApiResponse(500, error.message, "something went wrong"));
	}
  };
  
