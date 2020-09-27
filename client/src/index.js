import mqtt from 'mqtt'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons'
import { faCheckSquare, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

import 'purecss/build/pure-min.css'
import './marketing.css'
import './style.css'

// Initialize fontawesome
library.add(faLink, faCheckSquare, faThumbsUp, faGithub)
dom.i2svg()

// Buttons
const btnConnect = document.getElementById('btn-connect')
const btnDisconnect = document.getElementById('btn-disconnect')
const btnPublish = document.getElementById('btn-publish')
const btnSubscribe = document.getElementById('btn-subscribe')
const btnUnsubscribe = document.getElementById('btn-unsubscribe')
const btnClear = document.getElementById('btn-clear')

// Inputs
const inputUri = document.getElementById('input-uri')
const inputUsername = document.getElementById('input-username')
const inputPassword = document.getElementById('input-password')

const inputTopicPub = document.getElementById('input-topic-pub')
const inputMessage = document.getElementById('input-message')
const inputTopicSub = document.getElementById('input-topic-sub')

// Output
const messages = document.getElementById('messages')

let client

btnConnect.addEventListener('click', (e) => {
  e.preventDefault()
  client = mqtt.connect(inputUri.value, {
    username: inputUsername.value,
    password: inputPassword.value,
  })
  appendMessage('connection open :)')
  client.on('message', function (topic, message) {
    console.log(message)
    appendMessage(message)
  })
})

btnDisconnect.addEventListener('click', (e) => {
  e.preventDefault()
  client && client.end()
  appendMessage('connection closed')
})

btnPublish.addEventListener('click', (e) => {
  e.preventDefault()
  client && client.publish(inputTopicPub.value, inputMessage.value)
})

btnSubscribe.addEventListener('click', (e) => {
  e.preventDefault()
  client && client.subscribe(inputTopicSub.value)
  appendMessage(`subscribe -> ${inputTopicSub.value}`)
})

btnUnsubscribe.addEventListener('click', (e) => {
  e.preventDefault()
  client && client.unsubscribe(inputTopicSub.value)
  appendMessage(`unsubscribe -> ${inputTopicSub.value}`)
})

btnClear.addEventListener('click', (e) => {
  e.preventDefault()
  clearMessages()
})

function appendMessage(message) {
  const element = document.createElement('p')
  const string = document.createTextNode(message)
  element.appendChild(string)
  messages.appendChild(element)
}

function clearMessages() {
  const count = messages.childNodes.length
  for (let i = 0; i < count; ++i) {
    messages.removeChild(messages.firstChild)
  }
}
