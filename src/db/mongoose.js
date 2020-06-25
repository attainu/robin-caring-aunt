import mongoose from 'mongoose';

try {
    mongoose.connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, () => console.log("DB Connected"));
} catch (error) {
    console.log(`DB GOT ERROR ${error}`);
} 