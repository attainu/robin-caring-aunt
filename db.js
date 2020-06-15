const dotenv = require('dotenv');
dotenv.config();
const mongodb = require('mongodb');

mongodb.connect(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true, useUnifiedTopology: true
}, (err, data) => {
  module.exports = data;
  const app = require('./app');
  app.listen(process.env.PORT);
});