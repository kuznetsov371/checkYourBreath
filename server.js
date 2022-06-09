const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const db = require('./db');

const webSocketServer = require('./webSocketServer');

const apiRouter = require('./src/api/index');

const app = express();

const PORT = process.env.PORT || 3000;

webSocketServer.onWSS(
    new WebSocket.Server({
        server: app.listen(PORT)
    })
);

app.use(bodyParser.urlencoded());
app.use(express.json());

app.use('/api', apiRouter);


const connectToDB = async () => {
    await db().then(mongoose => {
        try {
            console.log('Connected to mongodb!');
            app.listen(() => {
                console.log(`Server is running on port: ${PORT}`);
            });

        } catch {
            mongoose.connection.close();
        }
    })
}

connectToDB();

