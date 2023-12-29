// All the constants are mandatory to be set, DO NOT LEAVE IT EMPTY.
const CLIENT_ID: string = ''
const CLIENT_SECRET: string = ''
const REDIRECT_URL: string = 'https://google.com'
const CHANNEL: string = '' //SMS or WHATSAPP or EMAIL or SMS,WHATSAPP
// Set both or atleast one of the following is mandatory
const MOBILE: string = ''
const EMAIL: string = ''

export { CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, CHANNEL, MOBILE, EMAIL }

export const log = console.log
