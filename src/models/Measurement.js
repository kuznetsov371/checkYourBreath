const { Schema, SchemaTypes, model } = require('mongoose');

const MeasurementSchema = new Schema({
    value: {
        type:SchemaTypes.Number,
        required:true
    },
    uid:{
        type: SchemaTypes.String,
        ref: 'UserData',
        required:true
    },
    date:{
        type: Date, 
        default: Date.now
    }
});

const Measurement = model('Measurement', MeasurementSchema, 'measurement');

module.exports = Measurement;