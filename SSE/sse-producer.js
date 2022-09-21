/*
should be run by passing Confluent bootstrap server and api key/secret
node producer.js <bootstrap-server> <api-key> <api-secret>
EXAMPLE: node producer.js pkc-xxxxx.eastus.azure.confluent.cloud:9092 Y7ZOR4FG5XXXXXX /KCJSSESroFssS0PN1VkkLn15m6HHASfXs29FvYHuO7lkvcp2rmFd79o7xxxxxx
*/
var myArgs = process.argv.slice(2);

const { Kafka } = require('kafkajs')

const conf = {
    clientId: 'sse-producer',
    brokers: [myArgs[0]],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: myArgs[1],
      password: myArgs[2],
    },
  }

const kafka = new Kafka(conf)
const producer = kafka.producer()
// end kafka specific code ^

'use strict';
const request = require('request');
const fs = require('fs');
var stream;
var message;
var partialMessage;
require('dotenv').config();

// make sure you are using a paid tier api key from IEX Cloud
console.log('Now the value is:', process.env.IEXCLOUD_PUBLIC_KEY);
var key = process.env.IEXCLOUD_PUBLIC_KEY;

  function connect() {
     stream = request({
      url: 'https://cloud-sse.iexapis.com/stable/cryptoEvents?symbols=btcusd&token='+ key,
      headers: {
        'Accept': 'text/event-stream',
        sandbox: true,
        version: "stable",
      }
    })
  }
  connect();

  // make response into reusable object for kafka
  stream.on('data', (response) => {
    var chunk = response.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
      cleanedChunk = partialMessage + cleanedChunk;
      partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
      if (message) {
        try {
          var quote = JSON.parse(message)[0];
          const sendMessage = async() => {
            await producer.connect()
            await producer.send(
              payloads = {
                topic: 'sse',
                messages: [
                  { key: quote.timestamp.toString(), value: JSON.stringify(quote) }
                ]
              })
              console.log('payloads=', payloads)
          };
          sendMessage();
        } catch (error) {
          partialMessage = message;
        }
      }
    });
  });

  function wait () {
    setTimeout(wait, 10000);
  }
wait();
