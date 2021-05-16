const { object } = require('joi');
const Joi = require( 'joi' );

function validateBody( schema ){
    return ( req, res, next ) => {
        const result = schema.validate( req.body );
        if( result.error ){
            return res.status( 404 ).json({
                message: 'There are error in your requisition.',
                content: result.error
            });
        }        
        if( !req.value ) req.value = {};
        req.body = result.value;        
        next();
    }
}

const createUserSchema = Joi.object({
    username: Joi.string()
        .required()
        .trim()
        .uppercase()
        .alphanum()
        .min( 3 )
        .max( 16 ),
    email: Joi.string()
        .required()
        .trim()
        .lowercase()
        .email(),
    password: Joi.string()
        .required()
        .min( 8 )
        .max( 24 )        
});

const createToxicologicalSampleSchema = Joi.object({
    "codigo_amostra": Joi.string()
        .required()
        .trim()
        .uppercase()
        .alphanum()
        .min( 1 )
        .max( 8 ),
    "Cocaína": Joi.number()
        .required(),
    "Anfetamina": Joi.number()
        .required(),           
    "Metanfetamina": Joi.number()
        .required(),           
    "MDA": Joi.number()
        .required(),           
    "MDMA": Joi.number()
        .required(),           
    "THC": Joi.number()
        .required(),           
    "Morfina": Joi.number()
        .required(),           
    "Codeína": Joi.number()
        .required(),           
    "Heroína": Joi.number()
        .required(),           
    "Benzoilecgonina": Joi.number()
        .required(),           
    "Cocaetileno": Joi.number()
        .required(),           
    "Norcocaína": Joi.number()
        .required(),           
});

module.exports = {
    validateBody,
    createUserSchema,
    createToxicologicalSampleSchema  
};

