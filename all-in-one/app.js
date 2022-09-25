const express = require('express');
const port = 3000;
const consumer = require('./consumer')
const bodyParser = require('body-parser')
const sseMW = require('./sse');
var connectionType;
var socketClients=[];
var events=[];
var socketCache=[]
const cors = require('cors');
const app = express()
    .use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json()) // to parse body of content type application/json
    // to serve static files from the *public* folder under the current directory  
    .use(express.static(__dirname + '/public'))
    .get('/websocketupdates', function (req, res){
        console.log('updating using websocket server')
    })
    .get('/longpollingupdates', function (req, res){
        res.status(200);
        res.send(events);
        events=[]
    })
    .get('/sseupdates', function (req, res) {
        var sseConnection = res.sseConnection;
        sseConnection.setup();
        sseClients.add(sseConnection);
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
    .post('/connectionType', function (req, res) {
        socketClients=[];
        res.setHeader('Content-Type', 'application/json');
        connectionType=JSON.stringify(req.body.connectionType )
        console.log(connectionType)
        initialize(connectionType)
        res.end(JSON.stringify(req.body))
    })
    .use(cors());

function initialize(connectionType){
    if (connectionType==='"sockets"'){
        initializeWebSocketServer()
    }
    else if (connectionType==='"sse"'){
        initializeSSEServer()
    }
}

function initializeSSEServer(){
    //configure sseMW.sseMiddleware as function to get a stab at incoming requests, in this case by adding a Connection property to the request
    app.use(sseMW.sseMiddleware)
}
function initializeWebSocketServer(){
    const io = require('socket.io')(Server, {
        cors: {
            origin: '*',
        },
        path: '/websocketupdates'
    });
    io.on('connection', client => {
        console.log('Connected', client);
        for (var i=0; i<socketCache.length; i++){
            client.emit('event', socketCache[i])
        }
        socketCache = []
        socketClients.push(client);
        client.on('disconnect', () => { 
          console.log('Client disconnected');
        });
    });
}

const Server = app.listen(port, () => {
    console.log(`Listening on port ${Server.address().port}`);
});


updateWebSocketClients = function (message) {
    for (var i=0; i<socketClients.length; i++) {
        socketClients[i].emit('event', message);
    }
}


updateSseClients = function (message) {
    var sseClients = new sseMW.Topic();
    sseClients.forEach(function (sseConnection) {
        sseConnection.send(message);
    }
     , this // this second argument to forEach is the thisArg (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
    );
}


const handleMessage = function (message) {
    const messageContent = message.value.toString()
    const messageKey = message.key ? message.key.toString() : ""
    let msg = message
    msg.value = null
    msg.key = null
    msg.content = messageContent
    msg.key = messageKey
    updateWebSocketClients(
      message
    )
    updateSseClients(
        message
    )
    events.push(message)
    socketCache.push(message)
    console.log(events.length)
  }

let topics
async function getStarted() {
    topics = await consumer.getTopics()
    console.log(`Topics have returned: ${topics}`)
    console.log(`Current Conection Type: ${connectionType}`)
    topics.forEach((topic) => { consumer.setMessageHandler(topic, handleMessage) })
    consumer.initializeConsumer(topics)
}
  
getStarted()