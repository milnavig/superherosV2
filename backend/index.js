require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./routes/index');
const sequelize = require('./db');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileupload({}));
app.use('/api', router);
app.use(errorHandler); // middleware for error handling

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log('The server is started'));
  } catch(err) {
    console.log(err);
  }
}

start();

module.exports.app = app;
