const { Model } = require( 'mongoose' );

/**
 * check if a doc who contains a given field value already exists on database
 * @param { Object } queryFilter
 * @param { Model } Model
 * @returns a document if exists 
 */
 exports.documentExists = async function( queryFilter, Model ){
    try {        
        let model = await Model.findOne( queryFilter );
        if( !model ) return null;
        return model;        
    } catch ( error ) {
        throw error
    };
};