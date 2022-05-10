const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const appPort = 48003;
const appName = 'Typewriter';

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public/')));;

app.listen(appPort, function () {
    console.log(`${appName} app listening on port ${appPort}!`);
});