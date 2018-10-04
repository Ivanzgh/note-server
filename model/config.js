const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/note-server' ,{ useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected success')
});

module.exports = db;