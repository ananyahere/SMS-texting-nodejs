const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const Vonage = require('@vonage/server-sdk')
const socketio = require('socket.io')

// Init Voange
const vonage = new Vonage({
  // I have replaced my API key & Secret 
  apiKey: 'YOURAPIKEY',
  apiSecret: 'YOURAPISECRET'
}, {
  debug: true
})

// Init app
const app = express()

// Template engine setup
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)

// Public folder setup
app.use(express.static(__dirname + '/public'))

// Body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: true} ))

// Index route
app.get('/', (req,res) => {
  res.render('index')
})

// Catch form Submit
app.post('/', (req,res) => {

  const phoneNumber = req.body.phoneNumber
  const text = req.body.text

  const from = "Ananya Sharma"
  const to = phoneNumber
  vonage.message.sendSms( from, to, text, (err, responseData) => {
    if(err) {
      return console.log(err)
    }
    console.log(responseData)
    // Get data from response
    const data = {
      id: responseData.messages[0]['message-id'],
      number: responseData.messages[0]['to']
    }

    // Emit to client
    io.emit('smsStatus', data)
  })
})

// Define port
const port = 8080;

// Start Server
const server = app.listen(port, () => {
  console.log(`Server up on port ${port}.`)
})

// Connect to Socket.io
const io = socketio(server)
io.on('connection', (socket) => {
  console.log('Connected')
  io.on('Disconnect', () => {
    console.log('Disconnected')
  })
})