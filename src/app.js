import express from 'express'
import { UserDetail } from 'otpless-node-js-auth-sdk'

// Load environment variables
const clientId = process.env.AUTH_CLIENT_ID || ''
const clientSecret = process.env.AUTH_CLIENT_SECRET || ''

// Create an express instance
const app = express()

/**
 * *Error Handler
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns res || next
 */
const errorHandler = (err, req, res, next) => {
	console.error(err)
	if (res.headersSent) {
		return next(err)
	}
	res.status(500).send('Internal Server Error')
}

app.get('/', (req, res) => {
	res.status(200).send({
		success: true,
		message: 'Hello World!',
	})
})

/**
 * * Send Magic Link
 * @request { mobile, email, redirectURI } @body
 * @request { channel } @params [channel = SMS || WHATSAPP]
 * @response { success: Boolean, data: Object }
 */
app.post('/magic-link/:channel', async (req, res) => {
	const { channel } = req.params
	const { mobile, email, redirectURI } = req.body
	if (!channel) {
		return res.status(400).send({
			success: false,
			error: 'Channel is required',
		})
	}
	if (!mobile && !email) {
		return res.status(400).send({
			success: false,
			error: 'Either mobile or email is required',
		})
	}
	try {
		//? Send a magic link to the user
		// * magicLink(MOBILE, EMAIL, REDIRECT_URL, CHANNEL, CLIENT_ID, CLIENT_SECRET)
		const magicLinkTokens = await UserDetail.magicLink(mobile, email, redirectURI ?? `http://localhost:${process.env.PORT}`, channel, clientId, clientSecret)
		//? Return the magic link tokens
		res.status(200).send({
			success: true,
			data: magicLinkTokens,
		})
	} catch (err) {
		//? Handle the error
		console.log(err)
		res.status(500).send({
			success: false,
			error: err,
		})
	}
})

/**
 * * Verify Code
 * * Received from the redirected url's Parameter - code
 * @request { code } @body
 * @response { success: Boolean, data: Object }
 */
app.post('/verify-code', async (req, res) => {
	// ? Get the code from the request body
	const { code } = req.body
	// ? Validate the code
	if (!code) {
		return res.status(400).send({
			success: false,
			error: 'Code is required',
		})
	}

	// ? Verify the code
	UserDetail.verifyCode(code, clientId, clientSecret)
		.then((verifiedUser) => {
			// ? Return the verified user
			res.status(200).send({
				success: true,
				data: verifiedUser,
			})
		})
		.catch((err) => {
			// ? Handle the error
			console.log(err)
			res.status(500).send({
				success: false,
				error: err,
			})
		})
})

/**
 * * Verify Token
 * * Received from the FrontEnd Login and stored in localStorage & cookies
 * @request { token } @body
 * @response { success: Boolean, data: Object }
 */
app.post('/verify-token', async (req, res) => {
	// ? Get the token from the request body
	const { token } = req.body
	// ? Validate the token
	if (!token) {
		return res.status(400).send({
			success: false,
			error: 'Token is required',
		})
	}
	try {
		// ? Verify the token
		const verifiedUser = await UserDetail.verifyToken(token, clientId, clientSecret)
		// ? Return the verified user
		res.status(200).send({
			success: true,
			data: verifiedUser,
		})
	} catch (err) {
		// ? Handle the error
		console.log(err)
		res.status(500).send({
			success: false,
			error: err,
		})
	}
})

/**
 * * Send OTP
 * @request { mobile, email, orderId, hash, otpLength, channel } @body [either mobile or email mandatory, orderId- optional, hash- optional, otpLength- optional, channel- optional]
 * @channel { SMS || WHATSAPP || SMS,WHATSAPP || EMAIL }
 * @param hash optional and only for @SMS
 * @response {success: Boolean, data: { orderId: String }}
 */
app.post('/otp/send/:channel', async (req, res) => {
	const channel = req.params.channel
	const { mobile, email, orderId, hash, otpLength } = req.body
	//? Validate the request
	if (!mobile && !email) {
		return res.status(400).send({
			success: false,
			error: 'Either mobile or email is required',
		})
	}
	if (!channel) {
		return res.status(400).send({
			success: false,
			error: 'Channel is required',
		})
	}
	try {
		//? Send an OTP to the user via Email or SMS or WhatsApp or both SMS and WhatsApp.
		const response = await UserDetail.sendOTP(mobile ?? email, orderId, hash, clientId, clientSecret, channel, parseInt(otpLength ?? '6'))
		console.log('Success', response)
		// ? Handle the error if any
		if (response?.errorMessage) {
			return res.status(500).send(response)
		}
		// ? Return the success response
		res.status(200).send({
			success: true,
			data: response,
		})
	} catch (err) {
		console.log('Error', err)
		res.status(500).send({
			success: false,
			error: err,
		})
	}
})

/**
 * * Resend OTP
 * @request { orderId } @body  [orderID-mandatory]
 * @response {success: Boolean, data: { orderId: String }}
 */
app.post('/otp/resend', async (req, res) => {
	const { orderId } = req.body
	//? Validate the request
	if (!orderId) {
		return res.status(400).send({
			success: false,
			error: 'Order ID is required',
		})
	}
	try {
		// ? Resend the OTP
		const response = UserDetail.resendOTP(orderId, clientId, clientSecret)
		console.log('Success', response)
		// ? Handle the error if any
		if (response?.errorMessage) {
			return res.status(500).send(response)
		}
		// ? Return the success response
		res.status(200).send({ success: true, ...response })
	} catch (error) {
		// ? Handle the error
		console.log('Error', error)
		res.status(500).send({
			success: false,
			error: error,
		})
	}
})

/**
 * * Verify OTP
 * @request { orderId, otp, mobile, email } @body  [orderID-mandatory, otp-mandatory, either mobile or email mandatory]
 * @response {success: Boolean, data: { isOTPVerified: Boolean }}
 */
app.post('/otp/verify', async (req, res) => {
	// ? Extract data from the request body
	const { orderId, otp, mobile, email } = req.body

	// ? Validate the request
	if (!orderId || !otp) {
		return res.status(400).send({
			success: false,
			error: 'Invalid request - orderId and otp is required',
		})
	}
	if (!mobile && !email) {
		return res.status(400).send({
			success: false,
			error: 'Invalid request - mobile or email is required',
		})
	}

	// ? Verify the OTP
	try {
		const response = await UserDetail.verifyOTP(mobile ?? email, orderId, otp, clientId, clientSecret)
		console.log('Success', response)
		// ? Handle the error if any
		if (response?.errorMessage) {
			return res.status(500).send(response)
		}
		// ? Return the success response
		res.status(200).send({
			success: true,
			...response,
		})
	} catch (err) {
		// ? Handle the error
		console.log('Error', err)
		res.status(500).send({
			success: false,
			error: err,
		})
	}
})

// ? Express server configuration
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(errorHandler)

export default app
