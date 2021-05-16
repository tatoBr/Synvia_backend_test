exports.error = ( error, req, res, next ) =>{
    return res.status( error.status || 500 ).json({
        message: error.message,
        content: error.stack
    });
}

exports.notFound = ( req, res, next ) => {
    return res.status( 400 ).json({
        message: 'PATH NOT FOUND',
        content: `${req.method} - ${req.url}.`
    });
}