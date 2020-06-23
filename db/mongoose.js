const mongoose = require('mongoose');
require('dotenv').config();

try {
    mongoose.connect(process.env.CONNECTION, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    }, () => console.log("Database Connected"));    
} catch (error) { 
    console.log("could not connect");    
}