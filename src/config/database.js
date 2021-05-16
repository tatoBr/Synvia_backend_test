if( process.env.NODE_ENV !== "production" )
    require("dotenv").config();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

module.exports = {
    uri: `mongodb+srv://${dbUser}:${dbPassword}@cluster0.o77px.${dbHost}/${dbName}?retryWrites=true&w=majority`,
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify: false              
    }
};