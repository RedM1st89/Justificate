    // server.js
    const mongoose = require('mongoose');
    require('dotenv').config(); // If using dotenv for connection string

    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-test'; // Replace mydatabase

    mongoose.connect(dbURI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));

