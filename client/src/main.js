import mqtt from 'mqtt';
import 'purecss/pure.css';
import 'font-awesome/css/font-awesome.css';
import './marketing.css';
import './main.styl';

// Buttons
const btnConnect = document.querySelector('.btn-connect');
const btnDisconnect = document.querySelector('.btn-disconnect');
const btnPublish = document.querySelector('.btn-publish');
const btnSubscribe = document.querySelector('.btn-subscribe');
const btnUnsubscribe = document.querySelector('.btn-unsubscribe');
const btnClear = document.querySelector('.btn-clear');

// Inputs
const inputTopicPub = document.querySelector('.input-topic-pub');
const inputMessage = document.querySelector('.input-message');
const inputTopicSub = document.querySelector('.input-topic-sub');
const inputBrokerWs = document.querySelector('.input-broker-ws');

const messages = document.querySelector('.messages');

let client;

btnConnect.addEventListener('click', e => {
  e.preventDefault();
  client = mqtt.connect(inputBrokerWs.value);
  appendMessage('connection open :)');
  client.on('message', function (topic, message) {
    console.log(message);
    appendMessage(message);
  });
});

btnDisconnect.addEventListener('click', e => {
  e.preventDefault();
  client && client.end();
  appendMessage('connection closed');
});

btnPublish.addEventListener('click', e => {
  e.preventDefault();
  client && client.publish(inputTopicPub.value, inputMessage.value);
});

btnSubscribe.addEventListener('click', e => {
  e.preventDefault();
  client && client.subscribe(inputTopicSub.value);
  appendMessage(`subscribe -> ${inputTopicSub.value}`);
});

btnUnsubscribe.addEventListener('click', e => {
  e.preventDefault();
  client && client.unsubscribe(inputTopicSub.value);
  appendMessage(`unsubscribe -> ${inputTopicSub.value}`);
});

btnClear.addEventListener('click', e => {
  e.preventDefault();
  clearMessages();
});

function appendMessage(message) {
  const element = document.createElement('p');
  const string = document.createTextNode(message);
  element.appendChild(string);
  messages.appendChild(element);
}

function clearMessages() {
  const count = messages.childNodes.length;
  for (let i = 0; i < count; ++i) {
    messages.removeChild(messages.firstChild);
  }
}
