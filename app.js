const express = require('express');
const userRouter = require('./routers/user');
const menstRouter = require('./routers/menstrual');
require('dotenv').config();
require('./db/mongoose');
// require('./utils/sms')
require('./utils/email')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(menstRouter);

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
