const express = require('express');
const bodyParser = require('body-parser');
const {handleContact} = require('./utilities/Contact');
require('dotenv').config();

const app = express();
const port = 3200;

app.use(bodyParser.json());

app.post('/identity',handleContact);

app.get('/', (req, res) => {
  res.send('Hey there, this service is created for bitespeed backend task by Garvit. Give it a try! Send a post request to /identity with {email: \'emailid\', phoneNumer: \'phno\'}');
});

app.get('/*', (req, res) => {
  res.send('Sorry, This endpoint doesn\'t exist :)');
});

app.listen(port, () => {
  console.log('Server listening on ',port);
});