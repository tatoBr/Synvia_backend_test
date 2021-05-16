const Model = require('../models/user');
const Service = require('./base_services');
const { httpStatusCodes } = require('../utils/constants');
const { documentExists } = require('../utils/databaseHelpers');
const user = require('../models/user');

module.exports = class UserService extends Service {
    constructor() {
        super('User', Model, {
            map: user => ({ _id: user._id, email: user.email })
        });
    };

    readByEmail = async email => {
        try {
            const document = await this.Model.findOne({ email: email });
            if (!document) {
                return {
                    status: httpStatusCodes.NOT_FOUND,
                    message: `${this.name} does no exist.`,
                    content: null
                };
            };            
            return {
                status: httpStatusCodes.OK,
                message: `${this.name} found.`,
                content: document
            }

        } catch (error) {
            throw error;
        };
    };

    authenticate = async (email, password) => {
        try {
            let user = await this.Model.findOne({ email: email });
            if (!user) return {
                status: httpStatusCodes.BAD_REQUEST,
                message: `${this.name} does no exist.`,
                content: null,
            };

            const passwordIsValid = await user.validatePassword(password);
            if (!passwordIsValid) return {
                status: httpStatusCodes.BAD_REQUEST,
                message: `Invalid password.`,
                content: null,
            };

            if( this.mapper ) user = this.mapper.map( user );
            return {
                status: httpStatusCodes.OK,
                message: 'User authenticated',
                content: user
            };
        } catch (error) {
            throw error;
        }
    }
};