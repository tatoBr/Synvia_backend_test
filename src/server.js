if( process.env.NODE_ENV !== "production" ){
    require("dotenv").config();
}

//importing core modules
const path = require( 'path' );

//importing npm modules
const express = require( 'express' );
const mongoose = require( 'mongoose' );
const morgan = require( 'morgan' );

//importing project modules
const defaultController = require('./controllers/default');
const dbCongif = require('./config/database' );

//connect to database
mongoose.connect( dbCongif.uri, dbCongif.options, err=>{
    if( err ) return console.error( err.message, err.stack );
    console.log( 'db connected' );
});

const app = express();

//setup middlewares
app.use( morgan( 'dev'));
app.use( express.urlencoded({ extended: false }));
app.use( express.json() );

//importing routers
const userRouter = require( './routes/user' );
const toxicologicalSampleRouter = require( './routes/toxicologicalSample' );

//setting Up routes
app.use('/users', userRouter );
app.use('/samples', toxicologicalSampleRouter );

//not found route handler
app.use( defaultController.notFound );

//error route handler
app.use( defaultController.error );

app.listen( process.env.PORT, ()=> console.log(`Server Listening on PORT ${ process.env.PORT }.`));