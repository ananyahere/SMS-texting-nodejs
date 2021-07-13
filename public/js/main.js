const numberInput = document.getElementById('number')
const textMessage = document.getElementById('message')
const button = document.getElementById('button')
const response = document.querySelector('.response')

button.addEventListener('click', send, false)

function send() {
  const phoneNumber = numberInput.value.replace(/\D/g, '')

  const socket = io()
  socket.on('smsStatus', (data) => {
    response.innerHTML = '<h5>Text message sent to ' + data.number + '!</h5>'
  })

  const text = textMessage.value 

  fetch('/', {
    method: 'post',
    headers: {
      'Content-type': 'application/json' 
    },
    body: JSON.stringify({ phoneNumber , text})
  })
  .then( res => { console.log(res) })
  .catch( err => { console.log(err) })
}
 
