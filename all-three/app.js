const express = require('express');
const port = 3000;
const consumer = require('./consumer')
const bodyParser = require('body-parser')
const sseMW = require('./sse');
var events=[];
var currentEvents = [];
var socketClients=[];
var sseClients;
const cors = require('cors');
const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json()) // to parse body of content type application/json
    // to serve static files from the *public* folder under the current directory
    .use(express.static(__dirname + '/public'))
    .use(sseMW.sseMiddleware)
    .get('/websocketupdates', function (req, res){
        console.log('updating using websocket server')
    })
    .get('/sseupdates', function (req, res) {
        var sseConnection = res.sseConnection;
        sseConnection.setup();
        sseClients.add(sseConnection);
      })
    .get('/longpollingupdates', function (req, res){
        res.status(200);
        var offset = req.query.offset
        offsetEvents = updateLongPollingClient(parseInt(offset))
        currentEvents = offsetEvents["events"]
        res.setHeader('currentOffset', offsetEvents["currentOffset"])
        console.log(Object.prototype.toString.call(currentEvents))
        if (Object.prototype.toString.call(currentEvents)==='[object Undefined]'){
            console.log(currentEvents)
        }
        res.send(currentEvents);
    })
    .get('/topics', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(topics))
    })
    .post('/config', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        events=[]
        // reinitialize the Kafka Topic Consumer from the earliest messages available on the topic
        consumer.initializeConsumer(topics,true)
        res.end(JSON.stringify(req.body ))
    })
    .use(cors());

sseClients = new sseMW.Topic();

function initializeWebSocketServer(){
        const io = require('socket.io')(Server, {
            cors: {
                origin: '*',
            },
            path: '/websocketupdates'
        });
        io.on('connection', client => {
            console.log('Connected', client);
            socketClients.push(client);
            client.on('disconnect', () => {
                delete socketClients[socketClients.indexOf(client)]
                console.log('Client disconnected');
            });
        });
    }

const Server = app.listen(port, () => {
    console.log(`Listening on port ${Server.address().port}`);
});

updateWebSocketClients = function (message) {
    for (var i=0; i<socketClients.length; i++) {
        if(socketClients[i]!=undefined){
            socketClients[i].emit('event', message);
        }
    }
}

updateSseClients = function (message) {
    sseClients.forEach(function (sseConnection) {
        sseConnection.send(message);
    }
     , this // this second argument to forEach is the thisArg (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
    );
}

const updateLongPollingClient = function (offset) {
    if ((events.length - offset -1) >= 100) { 
        return {"currentOffset": offset+100, "events": events.slice(offset, offset+100)}
    }
    else {
        setTimeout(updateLongPollingClient, 1000, offset); 
    }
}

const handleMessage = function (message) {
    const messageContent = message.value?.toString() || '';
    const messageKey = message.key ? message.key.toString() : ""
    let msg = message
    msg.value = null
    msg.key = null
    msg.content = messageContent
    msg.key = messageKey
    events.push(message)
    updateWebSocketClients(
        message
      )
    updateSseClients(
        message
    )
  }

let topics
async function getStarted() {
    topics = await consumer.getTopics()
    console.log(`Topics have returned: ${topics}`)
    topics.forEach((topic) => { consumer.setMessageHandler(topic, handleMessage) })
    consumer.initializeConsumer(topics)
    initializeWebSocketServer()
}

getStarted()
