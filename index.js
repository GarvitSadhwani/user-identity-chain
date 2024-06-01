const express = require('express');
const bodyParser = require('body-parser');
const {handleContact} = require('./utilities/Contact');
require('dotenv').config();

const app = express();
const port = 3200;

app.use(bodyParser.json());

app.post('/identity',handleContact);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log('Server listening on ',port);
});