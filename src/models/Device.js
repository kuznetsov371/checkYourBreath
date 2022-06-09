const { Schema, SchemaTypes, model } = require('mongoose');

const DeviceSchema = new Schema({
    _id:String,
    statusOn:{
        type: SchemaTypes.Boolean,
        default: false
    },
    user:{
        type: SchemaTypes.String,
        ref: 'UserData'
    }
    
});

const Device = model('Device', DeviceSchema, 'device');

module.exports = Device;