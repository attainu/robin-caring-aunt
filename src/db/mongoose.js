const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.CONNECTION_URL, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, () => console.log("Database Connected"));    
} catch (error) { 
    console.log("Could not connect");    
} 