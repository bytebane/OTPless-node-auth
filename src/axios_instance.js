import axios from 'axios'

// ? Create an axios instance with the base URL and headers
const axiosInstance = axios.create({
	baseURL: 'https://auth.otpless.app',
	headers: {
		clientId: process.env.AUTH_CLIENT_ID,
		clientSecret: process.env.AUTH_CLIENT_SECRET,
		'Content-Type': 'application/json',
	},
	timeout: 10000,
})

export default axiosInstance
