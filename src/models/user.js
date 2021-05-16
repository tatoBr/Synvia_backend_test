const bcrypt = require( 'bcrypt' );
const mongoose = require( 'mongoose' );
const { Schema } = mongoose;
const SALT_ROUNDS = 12;

const schema = new Schema({
    username: {
        required: true,
        unique: true,
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
    },
    email: {
        required: true,
        unique: true,
        type: Schema.Types.String,
        trim: true,
        lowercase: true
    },
    password: {
        required: true,
        type: Schema.Types.String        
    }
});

schema.methods.validatePassword = async function( password ){
    try {
        return await bcrypt.compare( password, this.password );        
    } catch ( error ) {
        throw error;
    }
}

schema.pre( 'save', async function encryptPassword(){
    try {
        this.password = await bcrypt.hash( this.password, SALT_ROUNDS );
    } catch (error) {
        throw error;
    }
});

module.exports = mongoose.model( 'User', schema );