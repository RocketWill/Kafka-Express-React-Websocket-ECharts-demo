const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const kafka = require('kafka-node');
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
    kafkaHost: '192.168.178.80:9092'
});
const consumer = new Consumer(
    client,
    [{
        topic: "realTimeChart",
        partition: 0, // get latest offset
        fromOffset: -1
    }], {
        autoCommit: false
    }
)

// consumer.on('message', (message) => {
//     console.log(message);
// })


// our localhost port
const port = 4001

const app = express()

// app.use(cors({
//     credentials: true,
//     origin: true
// }))

// our server instance
const server = http.createServer(app)

// This creates our socket using the instance of the server
const io = socketIO(server)

// This is what the socket.io syntax is like, we will work this later
io.on('connection', socket => {
    console.log('User connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    consumer.on('message', (message) => {
        if (message.value != "realTimeChart") {
            const netFlowMag = JSON.parse(message.value);
            const res = {
                time: netFlowMag.timestamp_arrival.substring(11,19),
                bytes: netFlowMag.bytes
            }
            socket.emit('onnn', res);
        }

        // client.broadcast.emit('broad', message.value);
    })
})

server.listen(port, () => console.log(`Listening on port ${port}`))




// if (require.main === module) {
//     app.listen(PORT, () => {
//         console.log('server started at http://localhost:' + PORT);
//     });
// }