# OTPless-node-auth

This is a demo for [OTPless](https://otpless.com) authentication Backend API integration in NodeJS using TypeScript.

## Try it out

>Clone the `typescript` branch from the repository

```bash
git clone -b typescript https://github.com/bytebane/OTPless-node-auth.git && cd ./OTPless-node-auth
```

> Open [src>constants](./src/constants/index.ts) file and
>> Set the constants with your credentials.
>
>Install and run

```bash
npm i && npm run dev
```

>> **Thats it**. Open [src>auth](./src/auth/index.ts) file and
>>> Use the functions from [auth](./src/auth/index.ts) class to send requests.
>
>>> You will get a successful or error logs  on your console.

## OTPless Package usage

```bash
npm i -S otpless-node-js-auth-sdk
```

```js
//Ignore types for this file
//@ts-ignore
import { UserDetails } from 'otpless-node-js-auth-sdk'

// Send a magic link
await UserDetails.magicLink(mobile, email, redirectURI, channel, clientId, clientSecret)

// Verify code from magic link's approved redirected URI's params
await UserDetails.verifyCode(code, clientId, clientSecret)

// Verify token from frontend (OTPless)
await UserDetails.verifyToken(token, clientId, clientSecret)

// Send OTP
await UserDetails.sendOTP(sendTo, orderId, hash, clientId, clientSecret, channel, otpLength)

// Resend OTP
await UserDetails.resendOTP(orderId, clientId, clientSecret)

// Verify OTP
await UserDetails.verifyOTP(sendTo, orderId, otp, clientId, clientSecret)
```

[***Official Documentation***](https://otpless.com/platforms/magic-link?sdkTab=Node)
