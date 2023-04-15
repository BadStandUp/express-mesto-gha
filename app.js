const express = require('express');
const mongoose = require('mongoose').default;
const bodyParser = require('body-parser');
require("dotenv").config();

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
})
  .then(() => console.log("Connected"))
  .catch(err => console.log(err))

app.use((req, res, next) => {
  req.user = {
    _id: '6439b0157c938842fc49838f'
  };

  next();
});

app.use('/users', require('./routes/users.router'));
app.use('/cards', require('./routes/cards.router'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
