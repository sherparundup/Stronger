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

		res.status(200).json(new ApiResponse(200, tokens.access_token, "Token retrieved successfully"));
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


export const googleSteps= async(req,res,next)=>{
	try {
		// const token=req.req.body;
		oAuth2Client.setCredentials({ access_token: req.token });
		const fitnessStore = google.fitness({ version: 'v1', auth: oAuth2Client });
		const dataTypeName = 'com.google.step_count.delta';
		const dataSourceId = 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps';
		const data = {
			aggregateBy: [{ dataTypeName, dataSourceId }],
			bucketByTime: { durationMillis: 24 * 60 * 60 * 1000 },
			startTimeMillis: Date.now() - 20 * 24 * 60 * 60 * 1000,
			endTimeMillis: Date.now()
		};
		const result = await fitnessStore.users.dataset.aggregate({
			userId: 'me',
			requestBody: data
		});
		res.json(result);
	} catch (error) {
		return res.status(500).json(new ApiResponse(new ApiResponse(500,error.message,"something went")))
	}

}