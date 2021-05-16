const mongoose = require( 'mongoose' );
const { Schema } = mongoose;

const schema = new Schema({
    sample_code: {
        type: Schema.Types.Number,
        required: true, 
        index: true       
    },
    drugs: [{
        name: {
            type: Schema.Types.String,
            required: true           
        },
        value: {
            type: Schema.Types.Number,
            required: true
        },
        isPositive: Schema.Types.Boolean
    }],
    tested: {
        type: Schema.Types.Boolean,
        default: false
    },
    result:{
        type: Schema.Types.Boolean,
        default: true,
        index: true
    }
});

module.exports = mongoose.model( 'ToxicologicalSample', schema );