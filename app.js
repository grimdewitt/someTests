const express = require("express");
const cron = require("node-cron");
const nodeMailer = require("nodemailer");
const bodeParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
require("isomorphic-fetch");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/auth");
const app = express();
app.use(bodeParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

cron.schedule("* * * * *", function() {
  console.log("Running Cron Job");

  const requestBody = {
    query: `
                  query{
                    events{ 
                        _id
                        date
                        creator{
                          _id
                          email
                        }                            
                      }
                  }
              `
  };

  fetch("http://localhost:8000/graphql", {
    method: "POST",
    body: JSON.stringify(requestBody),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (res.status !== 200 && res.status !== 201) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(resData => {
      const events = resData.data.events;

      // const millionPlusCities = events.filter(function (event) {
      //   var date2=new Date().toISOString();
      //   var rez=event.date-date2;
      //   console.log(rez);
      //   return event.creator.email === 'kuku@gamil.com';
      // });
      const smth = events.map(function(event) {
        return event.creator.email;
      });
      const emails = [...new Set(smth)];
      console.log(emails);
      let transporter = nodeMailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "mellie20@ethereal.email",
          pass: "Rdv4UxbQ5QdtD82qKX"
        }
      });
      const mailOptions = {
        from: "'John Doe' <john.doe@example.com>", // sender address
        to: emails, // list of receivers
        subject: "Hello there!", // Subject line
        text: "A Message from Node Cron App", // plain text body
        html: "<b>A Message from Node Cron App</b>" // html body
      };
      transporter.sendMail(mailOptions, function(error, info) {
        console.log(info.messageId);
        if (err) {
          console.log(err);
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
});

//mongodb+srv://KoriDewitt:<password>@cluster0-fpqhk.mongodb.net/test?retryWrites=true&w=majority
//mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-fpqhk.mongodb.net/${process.env.MONGO_FOLDER}?retryWrites=true&w=majority`)
mongoose
  .connect(process.env.MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });

//app.listen(3000);
