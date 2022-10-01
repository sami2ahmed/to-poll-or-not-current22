const express = require('express');
const port = 3000;
const consumer = require('./consumer')
const bodyParser = require('body-parser')
var events=[];
const cors = require('cors');
const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json()) // to parse body of content type application/json
    // to serve static files from the *public* folder under the current directory
    .use(express.static(__dirname + '/public'))
    .get('/longpollingupdates', function (req, res){
        res.status(200);
        res.send(events);
        events=[]
    })
    .get('/topics', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(topics))
    })
    .post('/config', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        // reinitialize the Kafka Topic Consumer from the earliest messages available on the topic
        consumer.initializeConsumer(topics,true)
        res.end(JSON.stringify(req.body ))
    })
    .use(cors());


const Server = app.listen(port, () => {
    console.log(`Listening on port ${Server.address().port}`);
});


const handleMessage = function (message) {
    const messageContent = message.value?.toString() || '';
    const messageKey = message.key ? message.key.toString() : ""
    let msg = message
    msg.value = null
    msg.key = null
    msg.content = messageContent
    msg.key = messageKey
    events.push(message)
  }

let topics
async function getStarted() {
    topics = await consumer.getTopics()
    console.log(`Topics have returned: ${topics}`)
    topics.forEach((topic) => { consumer.setMessageHandler(topic, handleMessage) })
    consumer.initializeConsumer(topics)
}

getStarted()
