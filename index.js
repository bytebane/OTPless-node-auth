import 'dotenv/config'
import app from './src/app.js'

const PORT = process.env.PORT || 8000
// Start server
app.listen(PORT, () => {
	console.log('Listening on port ' + PORT)
}).on('error', (err) => {
	console.error(err)
})
