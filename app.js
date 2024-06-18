const dotEnv = require('dotenv');

dotEnv.config();
const username = process.env.APP_USERNAME;
const password = process.env.APP_PASSWORD;

const express = require('express');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const client = mqtt.connect('mqtt://io.adafruit.com', {
    username,
    password,
});

app.use(bodyParser.json());
app.use(express.static('public'));

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

app.post('/control', (req, res) => {
    const { action } = req.body;
    console.log(action)
    if (action === 'OPEN' || action === 'CLOSE') {
        client.publish('ghassenmech/feeds/door', action);
        //res.send(`Door ${action} command sent`);
        
    } else {
        res.send('Invalid action');
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log(username, password);
});
