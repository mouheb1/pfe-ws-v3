const mongoose = require('mongoose');
// Connection à MongoDB
const uri = 'mongodb+srv://jdidiaziz38:b1bNji14KlHB6Gqr@cluster0.cmqfoyo.mongodb.net/urRobot';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB successfully');
});
db.on('error', (error) => {
    console.error('Error connecting to MongoDB:', error);
});