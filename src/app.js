import express from 'express';
import userRouter from './routers/user';
import menstRouter from './routers/menstrual';
import 'dotenv/config';
import './db/mongoose'
import './utils/sms'
import './utils/sms2'

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(userRouter);
app.use(menstRouter);

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
