
export const isThereGoogleFitToken=((req, res, next) => {
	const token = req.headers?.authorization?.split(' ')[1];
	if (!token) {
		return next(new Error('Please provide a token to access this resource'));
	}
	req.token = token;
	next();
});