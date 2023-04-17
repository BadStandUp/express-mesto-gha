require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
const { NOT_FOUND_ERROR, NOT_FOUND_CODE } = require('./utils/constants');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log('Connected'))
  .catch((err) => {
    console.log(err);
  });

app.use((req, res, next) => {
  req.user = {
    _id: '6439b0157c938842fc49838f',
  };

  next();
});

app.use('/users', require('./routes/users.router'));
app.use('/cards', require('./routes/cards.router'));

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: NOT_FOUND_ERROR });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
