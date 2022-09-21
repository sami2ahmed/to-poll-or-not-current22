/*
should be run by passing Confluent bootstrap server and api key/secret
node consumer.js <bootstrap-server> <api-key> <api-secret>
EXAMPLE: node producer.js pkc-xxxxx.eastus.azure.confluent.cloud:9092 Y7ZOR4FG5XXXXXX /KCJSSESroFssS0PN1VkkLn15m6HHASfXs29FvYHuO7lkvcp2rmFd79o7xxxxxx
*/
var myArgs = process.argv.slice(2);

const { Kafka } = require('kafkajs')

const conf = {
    brokers: [myArgs[0]],
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: myArgs[1],
      password: myArgs[2],
    },
  }

  const kafka = new Kafka(conf)
  const consumer = kafka.consumer({
    groupId: 'sse-consumer'
  })

  const main = async () => {
  await consumer.connect()

  await consumer.subscribe({
    topic: 'sse',
    fromBeginning: true
  })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('Received message', {
        topic,
        partition,
        key: message.key.toString(),
        value: message.value.toString()
      })
    }
  })
}

main().catch(async error => {
  console.error(error)
  try {
    await consumer.disconnect()
  } catch (e) {
    console.error('Failed to gracefully disconnect consumer', e)
  }
  process.exit(1)
})
