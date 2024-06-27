const express = require('express');
const app = express();
const cors = require('cors');
const encodeRouter = require('./routes/encode');
const decodeRouter = require('./routes/decode');
const imagesRouter = require('./routes/images');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 8000;

const corsOptions = {
    origin: process.env.FRONT_URL,
    optionsSuccessStatus: 200
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static('build'));

app.use('/encode', encodeRouter);
app.use('/decode', decodeRouter);
app.use('/parse-pokebin', imagesRouter);
app.use('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});