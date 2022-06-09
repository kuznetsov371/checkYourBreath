const mongoose = require('mongoose');
const mongoPath = 'mongodb+srv://admin:admin@checkyourbreath.j98tw.mongodb.net/checkYourBreathDB?retryWrites=true&w=majority';

module.exports = async () => {
    await mongoose.connect(mongoPath, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return mongoose;
};