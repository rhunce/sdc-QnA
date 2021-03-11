const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/sdcQandAService', { useNewUrlParser: true, useUnifiedTopology: true });

// ESTABLISHING A CONNECTION
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to database!');
});

module.exports = db;