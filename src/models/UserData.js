const { Schema, SchemaTypes, model } = require('mongoose');

const UserDataSchema = new Schema({
    _id:String,
    cmToken: {
        type:SchemaTypes.String,
        required:true
    },
    daysDrunk: {
        type: SchemaTypes.Number,
        default: 0
    },
    record: {
        type: SchemaTypes.Number,
        default: 0
    },
    highest:{
        type:SchemaTypes.Number,
        default: 0
    }
});

const UserData = model('UserData', UserDataSchema, 'usersData');

module.exports = UserData;