const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 48021;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, 'public/')));;

app.listen(port, function () {
    console.log(`Typewriter app listening on port ${port}!`);
});