const express = require('express');
const app = express();
const cors = require('cors');
const documentRouter = require('./src/features/documents/document.routes.js');
const integrationRouter = require('./src/features/integrations/integration.routes.js');
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 8000;

const allowedOrigins = [process.env.FRONT_URL, 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.static('build'));

app.use('/', documentRouter);
app.use('/', integrationRouter);
app.use('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});