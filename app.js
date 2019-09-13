const express =require('express');
const bodeParser =require('body-parser');
const graphqlHttp=require('express-graphql');
const mongoose=require('mongoose');

const graphQlSchema =require('./graphql/schema/index');
const graphQlResolvers =require('./graphql/resolvers/index');

const app= express();
app.use(bodeParser.json());



app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue:graphQlResolvers,
    graphiql: true
}));

//mongodb+srv://KoriDewitt:<password>@cluster0-fpqhk.mongodb.net/test?retryWrites=true&w=majority
//mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-fpqhk.mongodb.net/${process.env.MONGO_FOLDER}?retryWrites=true&w=majority`)
mongoose.connect(process.env.MONGO_DB, {useNewUrlParser:true})
.then(()=>{
    app.listen(3000);
})
.catch(err=>{
    console.log(err);
})

//app.listen(3000);
