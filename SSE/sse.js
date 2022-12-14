"use strict";

console.log("loading sse.js");

// ... with this middleware:
function sseMiddleware(req, res, next) {
    res.sseConnection = new Connection(res);
    next();
}
exports.sseMiddleware = sseMiddleware;
/**
 * A Connection is a simple SSE manager for 1 client.
 */
var Connection = (function () {
    function Connection(res) {
        this.res = res;
    }
    Connection.prototype.setup = function () {
        console.log("set up SSE stream for response");
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
    };
    Connection.prototype.send = function (data) {
        this.res.write("data: " + JSON.stringify(data) + "\n\n");
    };
    return Connection;
} ());

exports.Connection = Connection;
/**
 * A Topic handles a bundle of connections with cleanup after lost connection.
 */
 function convertEpochToUTC(timeEpoch){
     var d = new Date(timeEpoch);
     return d.toISOString();
 }

var Topic = (function () {
    function Topic() {
        console.log(" constructor for Topic");
        this.connections = [];
    }
    Topic.prototype.add = function (conn) {
        var connections = this.connections;
        connections.push(conn);
        console.log('New client connected, the number of clients is now: ', connections.length);
        conn.res.on('close', function () {
            var i = connections.indexOf(conn);
            if (i >= 0) {
                connections.splice(i, 1);
            }
            var d = new Date()
            timeEpoch = d.getTime()
            console.log(`At ${convertEpochToUTC(timeEpoch)} Client disconnected, now: `, connections.length);
        });
    };
    Topic.prototype.forEach = function (cb) {
        this.connections.forEach(cb);
    };
    return Topic;
} ());
exports.Topic = Topic;
