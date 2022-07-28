const mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR OWN SERVER
const database = 'jwtapp';          // REPLACE WITH YOUR OWN DB NAME

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${server}/${database}`);

        console.log('MongoDB connected!!');
    } catch (err) {
        console.log('Failed to connect to MongoDB', err);
    }
};

connectDB()
module.exports = { connectDB: connectDB}
