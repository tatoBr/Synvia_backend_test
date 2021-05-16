"use strict"

if( process.env.NODE_ENV !== 'production' ){
    require( 'dotenv' ).config()
}

const passport = require( 'passport' );
const JwtStrategy = require( 'passport-jwt' ).Strategy;
const ExtractJwt = require( 'passport-jwt').ExtractJwt;

const UserModel = require( '../models/user' );
const secret = process.env.JWT_SECRET;

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret    
};

async function verifyCallback( payload, done ){
    try {
        const user = await UserModel.findById( payload._id );
        if( !user ) return done( null, false );

        return done( null, user );
        
    } catch (error) {
        return done( error, false );
    }
}

exports.jwtStrategy = new JwtStrategy( options, verifyCallback );

