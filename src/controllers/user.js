"user strict";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const jwt = require('jsonwebtoken');
const Controller = require('./base_controller');
const UserServices = require('../services/user');
const { httpStatusCodes } = require('../utils/constants');

module.exports = class UserController extends Controller {
    constructor() {
        super('User', new UserServices());
    };
    post = async ( req, res, next ) => {
        try {
            const filter = {
                $or: [
                    { email: req.body.email },
                    { username: req.body.username }
                ]}
            const serviceResponse = await this.services.create( req.body, filter )
            const { message, content, status } = serviceResponse;

            return res.status( status ).json({ message, content });
        } catch ( error ) {
            next( error );
        }
    };
    getByEmail = async email => {
        try {
            const { id } = req.params;

            const serviceResponse = await this.services.readByEmail(email)
            const { message, content, status } = serviceResponse;

            return res.status(status).json({ message, content });
        } catch (error) {
            next(error);
        };
    };

    signIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;

            const serviceResponse = await this.services.authenticate(email, password);
            const { message, content, status } = serviceResponse;            
            if (status !== httpStatusCodes.OK)
                return res.status(status).json({ message, content });

            const secret = process.env.JWT_SECRET
            let payload = {
                _id: content._id,
                username: content.username
            };

            let token = jwt.sign( payload, secret, { expiresIn: '1h' });
            
            res.set('Authorization', token );
            return res.status(status).json({ message, content });
        } catch (error) {
            next( error );
        };
    };
};