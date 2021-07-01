const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Because database may take sometime to fetch the data and give it back to us. In order to not stopping the server, we use promises

mongoose.connect('mongodb+srv://Username:Password@cluster0.j1u4m.mongodb.net/TaskManager?authSource=admin&replicaSet=atlas-dh0nbs-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true', 
                    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Database is connected'))
    .catch((error) => console.log(error))

module.exports = mongoose;