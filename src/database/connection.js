const mongoose = require('mongoose')
const config = require('../config/database')

module.exports = ( async() => await mongoose.connect(
    config.uri,
    config.options,
    error =>{
        if( error ) return console.log( error.stack );
        console.log( 'connected to db' );
    }
))();