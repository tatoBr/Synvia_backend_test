"user strict";

const Router = require('express').Router
const Controller = require( '../controllers/toxicologicalSample' );

const inputValidator = require( '../middlewares/inputValidator' );
const { createToxicologicalSampleSchema } = inputValidator;
const { validateBody } = inputValidator;

const router = Router();
const controller = new Controller();

const passport = require( 'passport' );
const { jwtStrategy } = require( '../middlewares/credentialValidator' );
passport.use( jwtStrategy );

router.post(
    '/',
    passport.authenticate( 'jwt', { session: false }),
    validateBody( createToxicologicalSampleSchema ),
    controller.mountSample,
    controller.post
)

router.get(
    '/',
    passport.authenticate( 'jwt', { session: false }),
    controller.get
);

module.exports = router;