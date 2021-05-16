const  Services  = require( '../services/base_services' );

module.exports = class Controller{
    /**
     * Base Controller Contructor
     * @param { String } _name 
     * @param { Services } _services 
     */
    constructor( _name, _services ){
        this.name = _name;
        this.services = _services;        
    };

    post = async ( req, res, next )=>{
        try {
            const serviceResponse = await this.services.create( req.body )
            const { message, content, status } = serviceResponse;            
            return res.status( status ).json({ message, content });
        } catch ( error ) {
            next( error );
        }
    };

    get = async( req, res, next )=>{
        try {
            const serviceResponse = await this.services.readAll();
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });

        } catch ( error ) {
            next( error );
        }
    };

    getById = async ( req, res, next )=>{
        try {          
            const { id } = req.params;

            const serviceResponse = await this.services.readById( id );
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });      
        } catch ( error ) {
            next( error );
        }
    };
    
    patch = async ( req, res, next )=>{
        try {          
            const { id } = req.params;
            const data  = req.body;

            const serviceResponse = await this.services.update( id, data );
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });      
        } catch (error) {
            next( error );
        }
    };  

    delete = async ( req, res, next )=>{
        try {          
            const { id } = req.params;            

            const serviceResponse = await this.services.delete( id );
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });      
        } catch (error) {
            next( error );
        };
    };
};