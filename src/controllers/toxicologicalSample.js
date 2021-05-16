"user strict";

const Controller = require('./base_controller');
const { ToxicologicalSampleServices } = require('../services/toxicologicalSample');

module.exports = class UserController extends Controller {
    constructor() {
        super('Toxicological Sample', new ToxicologicalSampleServices());
    };

    post = async ( req, res, next ) => {
        try {
            const serviceResponse = await this.services.create( req.body, { sample_code: req.body.sample_code })
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });
        } catch ( error ) {
            next( error );
        }
    };
    mountSample = ( req, res, next )=>{
        let mounted = { sample_code: '', drugs: []};
        mounted.sample_code = req.body["codigo_amostra"];

        delete req.body["codigo_amostra"];

        for( let key in req.body ){        
            mounted.drugs.push({ name: key.toLowerCase(), value: req.body[ key ], isPositive: null})
        }
        this.services.testSample( mounted );
        
        req.body = mounted;
        next();
    }
};