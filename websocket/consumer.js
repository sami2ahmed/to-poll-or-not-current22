//websocket consumer 
const Kafka = require('node-rdkafka');
const { configFromPath } = require('./util');
const express = require('express');
const port = 3000;
const app = express();

function createConfigMap(config) {
  if (config.hasOwnProperty('security.protocol')) {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      'sasl.username': config['sasl.username'],
      'sasl.password': config['sasl.password'],
      'security.protocol': config['security.protocol'],
      'sasl.mechanisms': config['sasl.mechanisms'],
      'group.id': 'nodejs-websockets'
    }
  } else {
    return {
      'bootstrap.servers': config['bootstrap.servers'],
      'group.id': 'nodejs-websockets'
    }
  }
}

function createConsumer(config, onData) {
  const consumer = new Kafka.KafkaConsumer(
      createConfigMap(config),
      {'auto.offset.reset': 'earliest'});

  return new Promise((resolve, reject) => {
    consumer
     .on('ready', () => resolve(consumer))
     .on('data', onData);

    consumer.connect();
  });
};


async function consumerExample() {
  if (process.argv.length < 3) {
    console.log("Please provide the configuration file path as the command line argument");
    process.exit(1);
  }
  let configPath = process.argv.slice(2)[0];
  const config = await configFromPath(configPath);

  //let seen = 0;
  let topic = "sse";

  const consumer = await createConsumer(config, ({key, value}) => {
    let k = key.toString().padEnd(10, ' ');
    console.log(`Consumed event from topic ${topic}: key = ${k} value = ${value}`);
  });

  consumer.subscribe([topic]);
  consumer.consume();

  process.on('SIGINT', () => {
    console.log('\nDisconnecting consumer ...');
    consumer.disconnect();
  });

  const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
  });

  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });

  io.on('connection', client => {
    console.log('Connected', client);
    consumer.on('data', function (data) {
      console.log(data.value.toString());
      client.emit('event', data.value.toString());
    });
    client.on('disconnect', () => { 
      console.log('Client disconnected');
    });
  });
}

consumerExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });
