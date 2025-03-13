import mqtt from 'mqtt'

import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faCheckSquare, faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import { faLink } from '@fortawesome/free-solid-svg-icons'

import 'purecss/build/pure-min.css'
import './marketing.css'
import './style.css'

// Initialize fontawesome
library.add(faLink, faCheckSquare, faThumbsUp, faGithub)
dom.i2svg()

const $ = (id: string) => document.getElementById(id)
const i = (id: string) => document.getElementById(id) as HTMLInputElement | null

// Buttons
const btnConnect = $('btn-connect')
const btnDisconnect = $('btn-disconnect')
const btnPublish = $('btn-publish')
const btnSubscribe = $('btn-subscribe')
const btnUnsubscribe = $('btn-unsubscribe')
const btnClear = $('btn-clear')

// Inputs
const inputUri = i('input-uri')
const inputUsername = i('input-username')
const inputPassword = i('input-password')
const inputTopicPub = i('input-topic-pub')
const inputMessage = i('input-message')
const inputTopicSub = i('input-topic-sub')

// Output
const messages = $('messages')

if (
  btnConnect == null ||
  btnDisconnect == null ||
  btnPublish == null ||
  btnSubscribe == null ||
  btnUnsubscribe == null ||
  btnClear == null ||
  inputUri == null ||
  inputUsername == null ||
  inputPassword == null ||
  inputTopicPub == null ||
  inputMessage == null ||
  inputTopicSub == null ||
  messages == null
) {
  console.log('Failed')
} else {
  let client: mqtt.Client | undefined = undefined

  const appendMessage = (message: string) => {
    const element = document.createElement('p')
    const string = document.createTextNode(message)
    element.appendChild(string)
    messages.appendChild(element)
  }

  const clearMessages = () => {
    const count = messages.childNodes.length
    for (let i = 0; i < count; ++i) {
      const child = messages.firstChild
      if (child != null) {
        messages.removeChild(child)
      }
    }
  }

  btnConnect.addEventListener('click', (e) => {
    e.preventDefault()
    client = mqtt.connect(inputUri.value, {
      username: inputUsername.value,
      password: inputPassword.value,
    })
    appendMessage('connection open :)')
    client.on('message', (_topic, message) => {
      console.log(message)
      appendMessage(message.toString())
    })
  })

  btnDisconnect.addEventListener('click', (e) => {
    e.preventDefault()
    client?.end()
    appendMessage('connection closed')
  })

  btnPublish.addEventListener('click', (e) => {
    e.preventDefault()
    client?.publish(inputTopicPub.value, inputMessage.value)
  })

  btnSubscribe.addEventListener('click', (e) => {
    e.preventDefault()
    client?.subscribe(inputTopicSub.value)
    appendMessage(`subscribe -> ${inputTopicSub.value}`)
  })

  btnUnsubscribe.addEventListener('click', (e) => {
    e.preventDefault()
    client?.unsubscribe(inputTopicSub.value)
    appendMessage(`unsubscribe -> ${inputTopicSub.value}`)
  })

  btnClear.addEventListener('click', (e) => {
    e.preventDefault()
    clearMessages()
  })
}
