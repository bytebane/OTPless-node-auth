// @ts-ignore
import { UserDetail } from 'otpless-node-js-auth-sdk'
import { CHANNEL, CLIENT_ID, CLIENT_SECRET, EMAIL, MOBILE, REDIRECT_URL, log } from '../constants'

class Auth {
	constructor() {
		//? Validate required parameters
		if (!CHANNEL || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL || (!MOBILE && !EMAIL)) {
			throw new Error('Missing required parameters')
		}
	}

	//? Sends a magic link to the user which on approval redirects user to a specific URL with a code
	sendMagicLink = () => {
		//? Send a magic link to the user
		// * magicLink(MOBILE, EMAIL, REDIRECT_URL, CHANNEL, CLIENT_ID, CLIENT_SECRET)
		UserDetail.magicLink(MOBILE, EMAIL, REDIRECT_URL, CHANNEL, CLIENT_ID, CLIENT_SECRET)
			.then((data: any) => {
				//? Return the magic link tokens
				log({
					success: true,
					userData: data,
				})
			})
			.catch((err: any) => {
				//? Handle the error
				log({
					success: false,
					error: err,
				})
			})
	}

	//? Verify the code
	verifyCode = (code: String) => {
		if (!code) {
			log({
				success: false,
				error: 'Code is required',
			})
		}
		// ? Verify the code
		UserDetail.verifyCode(code, CLIENT_ID, CLIENT_SECRET)
			.then((verifiedUser: any) => {
				// ? Return the verified user
				log({
					success: true,
					data: verifiedUser,
				})
			})
			.catch((err: any) => {
				// ? Handle the error
				log({
					success: false,
					error: err,
				})
			})
	}

	//? Verify Token from the FrontEnd Otpless authentication SDK
	verifyToken = (token: String) => {
		if (!token) {
			log({
				success: false,
				error: 'Token is required',
			})
		}
		// ? Verify the token
		UserDetail.verifyToken(token, CLIENT_ID, CLIENT_SECRET)
			.then((verifiedUser: any) => {
				// ? Return the verified user
				log({
					success: true,
					data: verifiedUser,
				})
			})
			.catch((err: any) => {
				// ? Handle the error
				log({
					success: false,
					error: err,
				})
			})
	}

	//? Sends an OTP to the user via selected channel
	sendOTP = () => {
		//? Send an OTP to the user via Email or SMS or WhatsApp or both SMS and WhatsApp
		UserDetail.sendOTP(MOBILE ?? EMAIL, undefined, undefined, CLIENT_ID, CLIENT_SECRET, CHANNEL, 6)
			.then((data: any) => {
				//? Return the success response
				log({
					success: true,
					userData: data,
				})
			})
			.catch((err: any) => {
				//? Handle the error if any
				log({
					success: false,
					error: err,
				})
			})
	}

	//? Resend the OTP
	resendOTP = (orderID: String) => {
		//? Resend the OTP to the user via Email or SMS or WhatsApp or both SMS and WhatsApp
		UserDetail.resendOTP(orderID, CLIENT_ID, CLIENT_SECRET)
			.then((data: any) => {
				//? Return the success response
				log({
					success: true,
					userData: data,
				})
			})
			.catch((err: any) => {
				//? Handle the error if any
				log({
					success: false,
					error: err,
				})
			})
	}

	//? Verify the OTP
	verifyOTP = (orderID: String, otp: String) => {
		//? Verify the OTP
		UserDetail.verifyOTP(MOBILE ?? EMAIL, orderID, otp, CLIENT_ID, CLIENT_SECRET)
			.then((data: any) => {
				//? Return the success response
				log({
					success: true,
					userData: data,
				})
			})
			.catch((err: any) => {
				//? Handle the error if any
				log({
					success: false,
					error: err,
				})
			})
	}
}

export default new Auth()
