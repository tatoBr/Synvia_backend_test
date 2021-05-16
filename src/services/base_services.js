"use strict"

const { Model } = require( 'mongoose' );

const { httpStatusCodes } = require( '../utils/constants' );
const { documentExists } = require( '../utils/databaseHelpers' );

module.exports = class Services{
    /**
     * Base Services contructor
     * @param { String } name 
     * @param { Model } Model
     * @param { * } mapper 
     */
    constructor( name, Model, mapper ){
        this.name = name;
        this.Model = Model;
        this.mapper = mapper;        
    }

    create = async ( data, queryFilter ) => {        
        try {
            if( await documentExists( queryFilter, this.Model )){                
                return {
                    status: httpStatusCodes.CONFLICT,
                    message: `${ this.name } already Exists`,
                    content: data,
                };
            };  
    
            let created = await this.Model.create( data );
            if( this.mapper ) created = this.mapper.map( created );
            return {
                status: httpStatusCodes.CREATED,
                message: `${ this.name } created successfully.`,
                content: created,
            };
        } catch ( error ) {
            throw error
        };
    };
    
    readAll = async () => {        
        try {
            let documents = await this.Model.find();
            let message = documents.length <= 0 ? `No ${ this.name } registered.` : `${ this.name } list retrieved.`;       
            if( this.mapper ) documents = documents.map( doc => this.mapper.map( doc ));           
            return {
                status: httpStatusCodes.OK,
                message,
                content: documents,
            }        
        } catch ( error ) {
            throw error;  
        };
    };

    readById = async( id )=>{        
        try {
            let document = await this.Model.findById( id );
            if( !document ){
                return {
                    status: httpStatusCodes.NOT_FOUND,
                    message: `${ this.name } does no exist.`,
                    content: null
                };
            };
            if( this.mapper ) document = this.mapper.map( document );
            return {
                status: httpStatusCodes.OK,
                message: `${ this.name } found.`,
                content: document
            };
            
        } catch ( error ) {
            throw error;
        };
    };

    update = async ( id, update ) => {        
        try {            
            let updated = await this.Model.findByIdAndUpdate( id, update, {
                new: true,
                omitUndefined: true, 
                lean: true,
                runValidators: true
            });
            
            if( !updated ){
                return {
                    status: httpStatusCodes.NOT_FOUND,
                    message: `${ this.name } does no exist.`,
                    content: null
                };
            };
            
            if( this.mapper ) updated = this.mapper.map( updated );
            return {
                status: httpStatusCodes.ACCEPTED,
                message: `${ this.name } updated.`,
                content: updated
            };

        } catch (error) {
            throw error;
        };
    };

    delete = async id => {        
        try {
            let deleted = await this.Model.findByIdAndDelete( id );
            
            if( !deleted ){
                return {
                    status: httpStatusCodes.NOT_FOUND,
                    message: `${ this.name } does no exist.`,
                    content: null
                };
            };
            if( this.mapper ) deleted = this.mapper.map( deleted );
            return {
                status: httpStatusCodes.ACCEPTED,
                message: `${ this.name } deleted.`,
                content: deleted
            };

        } catch ( error ) {
            throw error;
        };
    };
};