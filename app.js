const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const helmet = require('helmet');
const limiter = require('./middleware/limiter');

require('dotenv').config();

const router = require('./routes/router');
const { errorHandler } = require('./middleware/errors');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mestodb';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected'))
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(limiter);
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
